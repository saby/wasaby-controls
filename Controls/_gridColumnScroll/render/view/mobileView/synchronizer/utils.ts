/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { ISize } from './types';
import { TSelectorMask } from 'Controls/_gridColumnScroll/render/view/mobileView/synchronizer/SizesStyleRender';
import { FIXED_END_VIEW_WRAPPER_CLASS_NAME, ITEM } from 'Controls/_gridColumnScroll/Selectors';

export function getBeforeContainerContentSize(
    container: Element,
    parentContainer?: Element | null,
    fixColumnScrollBeforeContainerContentSize?: boolean
): number | undefined {
    /* TODO: Временная опция fixColumnScrollBeforeContainerContentSize для решения задачи:
        https://online.sbis.ru/opendoc.html?guid=7b226e6c-3f0d-419e-913e-41cb686ea836&client=3
        Нужно придумать алгоритм, при помощи которого можно будет вычислить высоту всех стики-блоков внутри parentContainer,
        находящихся перед container и вернуть их сумму.
     */
    if (fixColumnScrollBeforeContainerContentSize) {
        return 0;
    }
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
                width: cellContainer.offsetWidth,
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
            const width = typeof size.width === 'number' ? `${size.width}px` : size.width;
            return `${selector} { height: ${height}; width: ${width}; ${getTopStyle(size)} }`;
        })
        .join('\n');
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function getFakeGridColumnTemplate(fixedItemCellsSizes: ISize[] | undefined): string | null {
    if (fixedItemCellsSizes) {
        return fixedItemCellsSizes?.reduce((res, size) => {
            if (size.width) {
                res += typeof size.width === 'number' ? ` ${size.width}px` : ` ${size.width}`;
            }
            return res;
        }, '');
    }
    return null;
}
