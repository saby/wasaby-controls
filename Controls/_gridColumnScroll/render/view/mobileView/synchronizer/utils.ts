/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { ISize } from './types';

export function getBeforeContainerContentSize(
    container: HTMLDivElement,
    parentContainer: HTMLDivElement
): number {
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
            const selector = keyMask.replace(keyMaskToken, size.key);
            const height = typeof size.size === 'number' ? `${size.size}px` : size.size;
            return `${selector} { height: ${height}; ${getTopStyle(size)} }`;
        })
        .join('\n');
}
