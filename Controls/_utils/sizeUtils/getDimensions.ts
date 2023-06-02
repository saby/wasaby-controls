import DimensionsMeasurer from 'Controls/_utils/sizeUtils/DimensionsMeasurer';

function getVisibleChildren(element: HTMLElement): HTMLElement[] {
    return Array.prototype.filter.call(
        element.children,
        (child: HTMLElement) => {
            // https://drafts.csswg.org/cssom-view/#dom-htmlelement-offsetparent
            // offsetParent is null if:
            // 1) Either element or any of its parents is hidden via display style property
            // 2) The element’s computed value of the position property is fixed.
            // 3) It's either root or <body> element.
            // We don't care about the third case here, since it's a very rare case,
            // and it's not very useful to get visible children of a root element anyway.
            if (child.offsetParent !== null) {
                return child;
            }
            if (window.getComputedStyle(child).display !== 'none') {
                return child;
            }
        }
    );
}

interface IVerticalDimensions {
    height: number;
    top: number;
    bottom: number;
}

function getOrdinaryVerticalDimensions(
    element: HTMLElement,
    clear?: boolean
): IVerticalDimensions {
    const rect = getBoundingClientRect(element, clear);
    return {
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
    };
}

function getContentsVerticalDimensions(
    element: HTMLElement,
    clear?: boolean
): IVerticalDimensions {
    if (element.children.length === 0) {
        return {
            height: 0,
            top: 0,
            bottom: 0,
        };
    }
    const children = element.children;
    if (children.length === 1) {
        const firstChild = children[0] as HTMLElement;
        if (window.getComputedStyle(firstChild).display !== 'contents') {
            return getOrdinaryVerticalDimensions(firstChild, clear);
        } else {
            return getContentsVerticalDimensions(firstChild, clear);
        }
    } else {
        let topItem = children[0] as HTMLElement;
        let bottomItem = children[children.length - 1] as HTMLElement;
        if (window.getComputedStyle(topItem).display === 'contents') {
            topItem = getVisibleChildren(topItem)[0];
        }
        const top = getOffsetTop(topItem);

        if (window.getComputedStyle(bottomItem).display === 'contents') {
            bottomItem = getVisibleChildren(bottomItem)[0];
        }

        const bottom =
            getOffsetTop(bottomItem) +
            getBoundingClientRect(bottomItem, clear).height;
        return {
            height: bottom - top,
            top,
            bottom,
        };
    }
}

function getVerticalDimensions(
    element: HTMLElement,
    clear?: boolean
): IVerticalDimensions {
    if (window.getComputedStyle(element).display !== 'contents') {
        return getOrdinaryVerticalDimensions(element, clear);
    }

    return getContentsVerticalDimensions(element, clear);
}

function getBoundingClientRect(
    element: HTMLElement,
    clear?: boolean,
    canUseGetDimensions?: boolean
): ClientRect {
    let position;
    let computedStyle = null;
    if (clear || canUseGetDimensions) {
        computedStyle = getComputedStyle(element);
    }

    // To calculate the actual position of the 'position: sticky' element in the layout,
    // set the style position to 'static'
    if (clear && computedStyle?.position === 'sticky') {
        position = element.style.position;
        element.style.position = 'static';
    }
    const clientRect: ClientRect =
        canUseGetDimensions && computedStyle?.display === 'contents'
            ? getDimensions(element, clear)
            : DimensionsMeasurer.getBoundingClientRect(element);
    if (clear && position !== undefined) {
        element.style.position = position;
    }
    return clientRect;
}

/**
 * Returns the size of an element and its position relative to the viewport. Should be used when the element may have display: contents, but you still want to get its real size and position.
 * The function makes certain assumptions about the element if it has display: contents:
 * 1) The element is not a root element.
 * 2) The children of the element have the same height.
 * 3) The element doesn't have absolutely or stickily positioned children.
 * @param {HTMLElement} element
 * @param {Boolean} clear If the clear parameter is passed, then function returns the position of the element
 * as if it were in layout and 'position: sticky' styles do not act on it.
 * @function Controls/_utils/sizeUtils/getDimensions
 * @private
 * @returns {ClientRect}
 */
export default function getDimensions(
    element: HTMLElement,
    clear?: boolean,
    stickyFix?: boolean
): ClientRect {
    let dimensions: ClientRect = getBoundingClientRect(element, clear);

    if (dimensions.width !== 0 || dimensions.height !== 0) {
        return dimensions;
    }
    let firstChild;
    let lastChild;
    const visibleChildren = getVisibleChildren(element);
    if (stickyFix) {
        for (let i = 0; i <= visibleChildren.length - 1; i++) {
            if (
                visibleChildren[i].offsetHeight !== 0 &&
                visibleChildren[i].offsetWidth !== 0
            ) {
                firstChild = visibleChildren[i];
                break;
            }
        }
        for (let i = visibleChildren.length - 1; i >= 0; i--) {
            if (
                visibleChildren[i].offsetHeight !== 0 &&
                visibleChildren[i].offsetWidth !== 0
            ) {
                lastChild = visibleChildren[i];
                break;
            }
        }
    } else {
        firstChild = visibleChildren[0];
        lastChild = visibleChildren[visibleChildren.length - 1];
    }

    if (visibleChildren.length === 0 || !lastChild || !firstChild) {
        return dimensions;
    }

    const firstChildDimensions = getBoundingClientRect(firstChild, clear, true);
    const lastChildDimensions = getBoundingClientRect(lastChild, clear, true);

    dimensions = {
        width: lastChildDimensions.right - firstChildDimensions.left,
        height: lastChildDimensions.height,
        top: firstChildDimensions.top,
        right: lastChildDimensions.right,
        bottom: firstChildDimensions.bottom,
        left: firstChildDimensions.left,
    };

    return dimensions;
}

export function getOffsetTop(element: HTMLElement): number {
    if (window.getComputedStyle(element).display !== 'contents') {
        return element.offsetTop;
    }

    const visibleChildren = getVisibleChildren(element);

    return visibleChildren.length ? visibleChildren[0].offsetTop : 0;
}
