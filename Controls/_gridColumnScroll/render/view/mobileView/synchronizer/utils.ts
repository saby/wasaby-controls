/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { ISize } from './types';

export function getBeforeContainerContentSize(
    container: Element,
    parentContainer?: Element | null
): number | undefined {
    if (parentContainer) {
        return (
            container.getBoundingClientRect().top +
            parentContainer.scrollTop -
            parentContainer.getBoundingClientRect().top
        );
    }
}

export function getSizesBySelector(
    container: HTMLDivElement,
    selector: string
): {
    sizes: Required<ISize>[];
    fullSize: number;
} {
    return getSizesByArray(Array.from(container.querySelectorAll<HTMLDivElement>(selector)));
}

function getSizesByArray(array: HTMLDivElement[]): {
    sizes: Required<ISize>[];
    fullSize: number;
} {
    let minOffsetTop: number = Number.MAX_SAFE_INTEGER;
    let maxOffsetTop: number = Number.MIN_SAFE_INTEGER;
    let maxOffsetTopIndex: number = -1;

    const sizes: Required<ISize>[] = array
        .map((cellContainer, index) => {
            const offsetTop = cellContainer.offsetTop;
            minOffsetTop = Math.min(minOffsetTop, offsetTop);

            if (offsetTop > maxOffsetTop) {
                maxOffsetTop = offsetTop;
                maxOffsetTopIndex = index;
            }

            return {
                key: `${index + 1}`,
                size: cellContainer.offsetHeight,
                clearOffsetTop: offsetTop,
            };
        })
        .map((s) => ({
            ...s,
            clearOffsetTop: s.clearOffsetTop - minOffsetTop,
        }));

    return {
        sizes,
        fullSize:
            maxOffsetTopIndex !== -1
                ? sizes[maxOffsetTopIndex].clearOffsetTop + sizes[maxOffsetTopIndex].size
                : 0,
    };
}

export function getSizesStyle(
    keyMask: string,
    keyMaskToken: string,
    sizes: ISize[],
    beforeContentSize?: number
): string {
    const getTopStyle = (size: ISize) => {
        if (typeof beforeContentSize === 'undefined') {
            return '';
        }
        return `top: ${beforeContentSize + (size.clearOffsetTop || 0)}px !important;`;
    };

    return sizes
        .map((size) => {
            const selector = replaceAll(keyMask, keyMaskToken, size.key);
            const height = typeof size.size === 'number' ? `${size.size}px` : size.size;
            return `${selector} { height: ${height}; ${getTopStyle(size)} }`;
        })
        .join('\n');
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
