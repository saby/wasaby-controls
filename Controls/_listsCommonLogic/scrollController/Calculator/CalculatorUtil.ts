/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import type {
    IDirection,
    IItemsRange,
    IPlaceholders,
    ICalcMode,
    IEdgeItem,
    IValidateItemFunction,
} from '../ScrollController';
import type { ITriggersOffsets } from 'Controls/_listsCommonLogic/scrollController/ObserverController/AbstractObserversController';
import type {
    IItemSize,
    IItemsSizes,
    IRenderedOutsideItem,
} from '../ItemsSizeController/AbstractItemsSizeController';
import { IEdgeItemCalculatingParams } from 'Controls/_listsCommonLogic/scrollController/AbstractListVirtualScrollController';

const MIN_RATIO_INDEX_LINE = 0.15;
const MAX_RATIO_INDEX_LINE = 0.85;

export interface IGetRangeByIndexParams {
    start: number;
    end: number | null;
    pageSize: number;
    totalCount: number;
    feature1183225611?: boolean;
}

export interface IGetRangeByItemsSizesParams {
    start: number;
    totalCount: number;
    viewportSize: number;
    itemsSizes: IItemsSizes;
}

export interface IShiftRangeBySegmentParams extends IGetSegmentSizeToHideParams {
    calcMode: ICalcMode;
    pageSize: number;
    totalCount: number;
    segmentSize: number;
    direction: IDirection;
    currentRange: IItemsRange;
}

interface IGetSegmentSizeToHideParams {
    direction: IDirection;
    currentRange: IItemsRange;
    triggersOffsets: ITriggersOffsets;
    placeholders: IPlaceholders;
    itemsSizes: IItemsSizes;
    viewportSize: number;
    scrollPosition: number;
    segmentSize: number;
    contentSizeBeforeList: number;
}

export interface IGetByPositionParams {
    pageSize: number;
    totalCount: number;
    itemsSizes: IItemsSizes;
    scrollPosition: number;
    triggerOffset: number;
}

export interface IGetActiveElementIndexByPosition {
    totalCount: number;
    itemsSizes: IItemsSizes;
    scrollPosition: number;
    viewportSize: number;
    contentSize: number;
    placeholders: IPlaceholders;
    currentRange: IItemsRange;
    viewportOverlaySize: number;
    feature1183225611: boolean;
}

export interface IGetSizesByRangeParams extends IGetItemsSizesSumParams {
    totalCount: number;
}

export interface IGetItemsSizesSumParams {
    range: IItemsRange;
    itemsSizes: IItemsSizes;
    contentSizeBeforeList?: number;
    itemsRenderedOutsideRange?: IRenderedOutsideItem[];
    calcByOffset?: boolean;
}

export interface IGetFirstVisibleItemIndexParams {
    itemsSizes: IItemsSizes;
    scrollPosition: number;
    stickyContentSize: number;
    placeholders: IPlaceholders;
    currentRange: IItemsRange;
}

export interface IHasEnoughContentToScroll {
    range: IItemsRange;
    itemsSizes: IItemsSizes;
    viewportSize: number;
    itemIndex: number;
    itemPosition: string;
    calcByOffset?: boolean;
}

export interface IGetEdgeVisibleItemParams extends IEdgeItemCalculatingParams {
    viewportSize: number;
    scrollPosition: number;
    validateItem?: IValidateItemFunction;
}

export interface IGetScrollPositionToEdgeItem {
    edgeItem: IEdgeItem;
    itemsSizes: IItemsSizes;
    scrollPosition: number;
    viewportSize: number;
    placeholders: IPlaceholders;
}

/**
 * Расчет видимых индексов от переданного индекса
 * @param {IShiftRangeBySegmentParams} params
 */
export function shiftRangeBySegment(params: IShiftRangeBySegmentParams): IItemsRange {
    const { direction, segmentSize, totalCount, pageSize, currentRange, calcMode } = params;
    let { startIndex, endIndex } = currentRange;

    if (calcMode === 'nothing') {
        return { startIndex, endIndex };
    }

    // Меняем segmentSize так, чтобы заполнить pageSize. То есть возможна ситуация, что переданный segmentSize
    // сместит диапазон так, что pageSize не будет заполнен.
    const countItemsToFillPageSize =
        calcMode === 'shift-on-segment' ? 0 : Math.max(pageSize - (endIndex - startIndex), 0);
    const countItemsToBackwardEdge = startIndex;
    const countItemsToForwardEdge = totalCount - endIndex;
    const countItemsToEdge =
        direction === 'backward' ? countItemsToBackwardEdge : countItemsToForwardEdge;
    const correctedSegmentSize = Math.min(
        Math.max(segmentSize, countItemsToFillPageSize),
        countItemsToEdge
    );

    if (!pageSize) {
        return {
            startIndex: 0,
            endIndex: totalCount,
        };
    }

    // Нельзя скрывать записи на заданный segmentSize, т.к. этого может быть много и мы сразу же увидим триггер.
    const segmentSizeToHide = getSegmentSizeToHide({
        ...params,
        segmentSize: correctedSegmentSize,
    });
    if (direction === 'backward') {
        startIndex = startIndex - correctedSegmentSize;
        if (startIndex >= totalCount) {
            startIndex = Math.max(0, totalCount - pageSize);
        }

        if (calcMode === 'shift') {
            endIndex = Math.min(
                Math.max(endIndex - segmentSizeToHide, Math.min(startIndex + pageSize, totalCount)),
                totalCount
            );
        }
    } else {
        // сперва считаем именно endIndex, т.к. startIndex зависит от нового значения endIndex
        endIndex = endIndex + correctedSegmentSize;
        if (endIndex < pageSize && endIndex < totalCount) {
            endIndex = Math.min(pageSize, totalCount);
        }

        // При добавлении в пустой список у нас получится диапазон [1, 1].
        // Поэтому нужно принудительно в этом случае пересчитать startIndex.
        if (calcMode === 'shift' || startIndex === endIndex) {
            startIndex = Math.max(
                Math.min(startIndex + segmentSizeToHide, Math.max(endIndex - pageSize, 0)),
                0
            );
        }
    }

    startIndex = correctStartIndexForMultiColumns(startIndex, params.itemsSizes);

    return { startIndex, endIndex };
}

/**
 * Корректирует стартовый индекс так, чтобы записи оставались на одной линии, если расположены в несколько столбцов.
 * Нужно чтобы это не провоцировало перегруппировку элементов
 * (актуально для плитки или плоского списка с прикладным расположением в несколько колонок)
 */
function correctStartIndexForMultiColumns(startIndex: number, itemsSizes: IItemsSizes): number {
    let newStartIndex = startIndex;
    while (newStartIndex > 0 && newStartIndex < itemsSizes.length) {
        const item = itemsSizes[newStartIndex];
        const prevItem = itemsSizes[newStartIndex - 1];
        // Скрываем элементы, пока не дойдем до новой строки элементов. У новой строки отличается offset.
        // Либо останавливаемся, если предыдущий элемент не отрисован,
        // в этом кейсе мы не сможем определить какие элементы находятся на одной линии.
        if (!prevItem.size || item.offset !== prevItem.offset) {
            break;
        }

        // Обратить внимание на это место. Может вызвать в плитке лишние смещения диапазонов.
        // Но в теории этого не должно быть, т.к. если скрыть лишнию полосу, то в пределах плитки это немного.
        // Но при этом мы сэкономим время на отрисовке целой полосы записей.
        newStartIndex++;
    }
    return newStartIndex;
}

/**
 * Рассчитывает сколько элементов нужно скрыть.
 * Смещение на заданный segmentSize может сразу же вызвать shiftRange по триггеру.
 * Поэтому считаем такой segmentSize, чтобы скрыть максимальное кол-во записей, но чтобы триггер не стал виден.
 */
function getSegmentSizeToHide(params: IGetSegmentSizeToHideParams): number {
    const shiftDirection = params.direction;

    let segmentSizeToHide;
    if (shiftDirection === 'forward') {
        segmentSizeToHide = getSegmentSizeToHideBackward(params);
    } else {
        segmentSizeToHide = getSegmentSizeToHideForward(params);
    }

    // Скрываем не больше, чем будет добавлено элементов
    // Если скрыть больше, то возможна ситуация, что scrollPosition будет больше максимального значения
    // и он нативно приведется к максимальному значению. Это произойдет после отрисовки и получится,
    // что до отрисовки и после отрисовки нельзя будет свести позиции элементов
    // в одну систему(т.к. scrollPosition зависит от 3ей переменной)
    return Math.min(segmentSizeToHide, params.segmentSize);
}

function getSegmentSizeToHideForward(params: IGetSegmentSizeToHideParams): number {
    let segmentSize = 0;
    let endIndex = Math.min(params.currentRange.endIndex, params.itemsSizes.length) - 1;
    const startIndex = params.currentRange.startIndex;
    const itemsSizes = params.itemsSizes;
    const backwardPlaceholder = params.placeholders.backward;
    const offsetDistance =
        params.viewportSize + params.triggersOffsets.backward + params.triggersOffsets.forward;

    while (
        endIndex >= startIndex &&
        itemsSizes[endIndex].offset - backwardPlaceholder > offsetDistance
    ) {
        endIndex--;
        segmentSize++;
    }

    return segmentSize;
}

function getSegmentSizeToHideBackward(params: IGetSegmentSizeToHideParams): number {
    let segmentSize = 0;
    let start = params.currentRange.startIndex;
    const itemsSizes = params.itemsSizes;
    const backwardPlaceholder = params.placeholders.backward;
    // params.scrollPosition - высота скрытых скроллом записей сверху.
    // Убираем из нее 2 триггера, чтобы не скрыть записи на их высоту.
    // Но еще нужно учесть высоту контента до списка, который находится в этом же scrollContainer-е,
    // т.к. он учитывается в scrollPosition.
    // В итоге получаем высоту записей, которые можно скрыть, так что триггеры не сработают.
    const offsetDistance =
        params.scrollPosition -
        params.triggersOffsets.backward -
        params.triggersOffsets.forward -
        params.contentSizeBeforeList;
    // Если список не проскроллен, то offsetDistance может получиться меньше 0.
    if (offsetDistance < 0) {
        return 0;
    }

    // Проверка start < itemsSizes.length нужна, т.к. возможен кейс:
    // диапазон [0, 10], добавляют записи в начало, диапазон становится [10,20](смотреть Calculator::addItems)
    // и после этого вызывают смещение диапазона, т.к. текущий диапазон [10,20] мы тут выйдем за пределы списка.
    // В этом кейсе не нужно скрывать записи сверху, т.к. они только были добавлены.
    while (start < itemsSizes.length - 1) {
        const curItemOffset = itemsSizes[start].offset - backwardPlaceholder;
        const nextItemSize = itemsSizes[start + 1].size;
        // Проверяем что следующий элемент не превысет offset, иначе будет виден триггер.
        // Данный кейс всплывает если у нас есть очень большие записи.
        if (curItemOffset + nextItemSize >= offsetDistance) {
            break;
        }
        segmentSize++;
        start++;
    }

    return segmentSize;
}

/**
 * Проверяем, что перед элементм записей достаточно, чтобы запонлить весь вьюпорт.
 * @param {IHasEnoughContentToScroll} params
 */
function contentBeforeItemMoreThanViewport(params: IHasEnoughContentToScroll): boolean {
    const itemsSizesSum = getItemsSizesSum({
        range: {
            startIndex: params.range.startIndex,
            endIndex: params.itemIndex,
        },
        itemsSizes: params.itemsSizes,
        calcByOffset: params.calcByOffset,
    });
    return itemsSizesSum >= params.viewportSize;
}

/**
 * Проверяем, что после элемента записей достаточно, чтобы запонлить весь вьюпорт.
 * @param {IHasEnoughContentToScroll} params
 */
function contentAfterItemMoreThanViewport(params: IHasEnoughContentToScroll): boolean {
    const itemsSizesSum = getItemsSizesSum({
        range: {
            startIndex: params.itemIndex,
            endIndex: params.range.endIndex,
        },
        itemsSizes: params.itemsSizes,
        calcByOffset: params.calcByOffset,
    });
    return itemsSizesSum >= params.viewportSize;
}

/**
 * Проверка, достаточно ли в текущем диапазоне контента, чтобы можно было проскроллить к записи в нужном направлении.
 * @param {IHasEnoughContentToScroll} params
 */
export function hasEnoughContentToScroll(params: IHasEnoughContentToScroll): boolean {
    // Если мы скроллим так, чтобы элемент оказался вверху вьюпорта,
    // то нам нужно убедиться, что контента вверху будет достаточно.
    // Если скроллим к первой записи, так чтобы она была сверху, то нам не нужен контент сверху для скролла
    const hasContentBeforeItem =
        (params.itemIndex === params.range.startIndex && params.itemPosition === 'top') ||
        contentBeforeItemMoreThanViewport(params);
    const hasContentAfterItem = contentAfterItemMoreThanViewport(params);

    if (params.itemPosition === 'top') {
        return hasContentAfterItem;
    }

    if (params.itemPosition === 'bottom') {
        return hasContentBeforeItem;
    }

    return hasContentBeforeItem && hasContentAfterItem;
}

/**
 * Расчет видимых индексов от переданного индекса
 * @param {IGetRangeByIndexParams} params
 */
export function getRangeByIndex(params: IGetRangeByIndexParams): IItemsRange {
    const { start, end, pageSize, totalCount, feature1183225611 } = params;
    const result: IItemsRange = { startIndex: 0, endIndex: 0 };

    if (pageSize && pageSize < totalCount) {
        result.startIndex = start;
        result.endIndex = end !== null ? end : start + pageSize;

        if (result.endIndex > totalCount) {
            result.endIndex = totalCount;

            if (!feature1183225611) {
                result.startIndex = result.endIndex - pageSize;
            }
        }
    } else {
        result.startIndex = 0;
        result.endIndex = totalCount;
    }

    return result;
}

/**
 * Расчет видимых индексов от заранее высчитанных высот.
 * @remark
 * Используется для оптимизаций частных случаев, когда построить один лишний элемент будет очень дорого,
 * например если один элемент это огромный пункт с кучей контролов внутри)
 * @param {IGetRangeByItemsSizesParams} params
 */
export function getRangeByItemsSizes(params: IGetRangeByItemsSizesParams): IItemsRange {
    const itemsSizes = params.itemsSizes;
    let sumHeight = 0;
    let start: number = params.start;
    let end: number;

    // Пытаемся посчитать endIndex взяв за начало переданный startIndex
    for (let i = start; i < params.totalCount; i++) {
        const itemSize = itemsSizes[i].size;
        if (sumHeight + itemSize <= params.viewportSize) {
            sumHeight += itemSize;
        } else {
            end = i;
            break;
        }
    }

    // Если endIndex не посчитался, значит записей от startIndex до конца не хватило.
    // В таком случае, считаем наоборот - startIndex исходя из того что endIndex указывает на последний элемент
    if (typeof end === 'undefined') {
        end = params.totalCount - 1;
        sumHeight = 0;

        for (let i = end; i > 0; i--) {
            const itemSize = itemsSizes[i].size;

            if (sumHeight + itemSize <= params.viewportSize) {
                sumHeight += itemSize;
            } else {
                start = i;
                break;
            }
        }
    }

    return { startIndex: start, endIndex: end + 1 };
}

/**
 * Рассчет видимых индексов от позиции скролла
 * @param {IGetByPositionParams} params
 */
export function getRangeByScrollPosition(params: IGetByPositionParams): IItemsRange {
    const { pageSize, totalCount, itemsSizes, triggerOffset, scrollPosition } = params;

    if (!pageSize) {
        return { startIndex: 0, endIndex: totalCount };
    }

    let start: number = 0;
    while (start < itemsSizes.length && itemsSizes[start].offset < scrollPosition - triggerOffset) {
        start++;
    }
    start = correctStartIndexForMultiColumns(start, params.itemsSizes);

    const end = Math.min(start + pageSize, totalCount);

    // Если мы скроллим быстро к концу списка, startIndex может вычислиться такой,
    // что число отрисовываемых записей будет меньше virtualPageSize (например если
    // в списке из 100 записей по scrollPosition вычисляется startIndex == 95, то endIndex
    // будет равен 100 при любом virtualPageSize >= 5.
    // Нам нужно всегда рендерить virtualPageSize записей, если это возможно, т. е. когда
    // в коллекции достаточно записей. Поэтому если мы находимся в конце списка, пробуем
    // отодвинуть startIndex назад так, чтобы отрисовывалось нужное число записей.
    if (pageSize && end === totalCount) {
        const missingCount = pageSize - (end - start);
        if (missingCount > 0) {
            start = Math.max(start - missingCount, 0);
        }
    }

    return { startIndex: start, endIndex: end };
}

/**
 * Расчёт активного элемента от позиции скролла
 * @param {IGetActiveElementIndexByPosition} params
 */
export function getActiveElementIndexByScrollPosition(
    params: IGetActiveElementIndexByPosition
): number {
    const {
        viewportSize,
        contentSize,
        scrollPosition,
        itemsSizes,
        placeholders,
        totalCount,
        currentRange,
        viewportOverlaySize,
        feature1183225611,
    } = params;

    let fixedScrollPosition: number;

    // На тач устройствах scroll может заходить за пределы границ контейнера.
    // Такие ситуации нужно корректировать под крайние максимальные и минимальные значения scrollPosition
    if (scrollPosition < 0) {
        fixedScrollPosition = 0;
    } else if (!feature1183225611 && viewportSize + scrollPosition > contentSize) {
        fixedScrollPosition = Math.max(contentSize - viewportSize, 0);
    } else {
        fixedScrollPosition = scrollPosition;
    }

    // Если выставлена опция feature1183225611, то активный элемент определяем на основании
    // верхней границы ScrollContainer. Активным является тот, который либо пересек верхнюю
    // границу либо находится вплотную к ней
    if (feature1183225611) {
        // Если не инициализировать activeElementIndex как startIndex, то, в случае,
        // когда до списка есть контент и скролл в самом верху, активный элемент не будет определен вообще
        let activeElementIndex = currentRange.startIndex;
        for (let i = currentRange.startIndex; i < currentRange.endIndex; i++) {
            // Нужно округлять размеры при сравнении с позицией скролла.
            // Погрешность в десятые доли пикселя приводит к неверному результату.
            // Пример ошибки: https://online.sbis.ru/doc/22d684c3-e062-4132-a903-46dc59671439?client=3
            if (
                Math.floor(params.itemsSizes[i].offset - placeholders.backward) <=
                fixedScrollPosition + viewportOverlaySize
            ) {
                activeElementIndex = i;
            } else {
                break;
            }
        }

        return activeElementIndex;
    }

    if (!totalCount) {
        return undefined;
    } else if (isRangeOnEdge('backward', currentRange, totalCount) && fixedScrollPosition === 0) {
        return currentRange.startIndex;
    } else if (
        isRangeOnEdge('forward', currentRange, totalCount) &&
        fixedScrollPosition + viewportSize === contentSize
    ) {
        return currentRange.endIndex - 1;
    } else {
        let activeElementIndex;
        const scrollPositionWithPlaceholder = fixedScrollPosition + placeholders.backward;
        const knownContentHeight = contentSize + placeholders.forward + placeholders.backward;
        const viewportSizeWithoutOverlay = viewportSize - viewportOverlaySize;
        const indexLineRatio =
            scrollPositionWithPlaceholder / (knownContentHeight - viewportSizeWithoutOverlay);
        const indexLine = Math.max(
            MIN_RATIO_INDEX_LINE,
            Math.min(MAX_RATIO_INDEX_LINE, indexLineRatio)
        );

        for (let i = currentRange.startIndex; i < currentRange.endIndex; i++) {
            const itemOffset = itemsSizes[i].offset - placeholders.backward;
            if (itemOffset < fixedScrollPosition + viewportSizeWithoutOverlay * indexLine) {
                activeElementIndex = i;
            } else {
                break;
            }
        }

        return activeElementIndex;
    }
}

/**
 * Проверяет что диапазон находится на переданном краю
 * @param {IDirection} edge
 * @param {IItemsRange} range
 * @param {number} totalCount
 */
function isRangeOnEdge(edge: IDirection, range: IItemsRange, totalCount: number): boolean {
    return edge === 'backward' ? range.startIndex === 0 : range.endIndex === totalCount;
}

/**
 * Рассчитывает плейсхолдеры для переданного диапазона
 * @param {IGetSizesByRangeParams} params
 */
export function getPlaceholdersByRange(params: IGetSizesByRangeParams): IPlaceholders {
    const { range, totalCount } = params;

    const backward = getItemsSizesSum({
        ...params,
        range: { startIndex: 0, endIndex: range.startIndex },
    });
    const forward = getItemsSizesSum({
        ...params,
        range: { startIndex: range.endIndex, endIndex: totalCount },
    });

    return { backward, forward };
}

/**
 * Возвращает сумму высот элементов из указанного диапазона
 * @param {IGetItemsSizesSumParams} params
 */
function getItemsSizesSum(params: IGetItemsSizesSumParams): number {
    const { range, itemsSizes, itemsRenderedOutsideRange } = params;

    if (params.calcByOffset && range.endIndex - range.startIndex > 0) {
        const inStart = range.startIndex === 0;
        const inEnd = itemsSizes.length === range.endIndex;
        const startItemSize = itemsSizes[range.startIndex];
        const endItemSize = inEnd ? itemsSizes[range.endIndex - 1] : itemsSizes[range.endIndex];
        const startItemOffset = inStart ? params.contentSizeBeforeList : startItemSize.offset;
        const endItemOffset = inEnd ? endItemSize.size + endItemSize.offset : endItemSize.offset;

        // Между записями может быть отступ(марджин). У последней записи его не нужно считать в placeholder.
        const prevEndItemSize = itemsSizes[range.endIndex - 1];
        const offsetBetweenLastItems =
            endItemSize.offset - prevEndItemSize.offset - prevEndItemSize.size;

        const result = endItemOffset - startItemOffset - offsetBetweenLastItems / 2;
        return Math.max(result, 0);
    }

    let result = 0;

    for (let index = range.startIndex; index < range.endIndex; index++) {
        const itemSize = itemsSizes[index];
        // Не учитываем в placeholder элементы, отрисованные за пределами диапазона.
        if (
            itemsRenderedOutsideRange &&
            itemsRenderedOutsideRange.find((it) => it.key === itemSize?.key)
        ) {
            continue;
        }
        result += itemSize?.size || 0;
    }

    return result;
}

/**
 * Возвращает индекс первой полностью видимой записи
 * @param params
 */
export function getFirstVisibleItemIndex(params: IGetFirstVisibleItemIndexParams): number {
    const itemsSizes = params.itemsSizes;

    // При расчете первого видимого элемента, нужно учитывать высоту застиканного контента.
    // Он занимает верхнюю часть вьюпорта и закрывает часть записей.
    // Если список не проскроллен, то и застиканного контента не может быть
    const stickyContentSize = params.scrollPosition === 0 ? 0 : params.stickyContentSize;
    const offsetForVisibleItem = params.scrollPosition + stickyContentSize;
    const maxIndex = params.currentRange.endIndex;
    const backwardPlaceholder = params.placeholders.backward;
    let itemIndex = params.currentRange.startIndex;

    while (
        itemIndex < maxIndex &&
        itemsSizes[itemIndex].offset - backwardPlaceholder < offsetForVisibleItem
    ) {
        itemIndex++;
    }

    return itemIndex;
}

export function getEdgeVisibleItem(params: IGetEdgeVisibleItemParams): IEdgeItem {
    const {
        viewportSize,
        scrollPosition,
        direction,
        range,
        placeholders,
        itemsSizes,
        validateItem,
        offset,
    } = params;

    // Возможен кейс, что после resetItems записи не успели отрисоваться
    // и в этот же _beforeUpdate изменили коллекцию. Допустим свернули узлы.
    // Это вызовет removeItems, который запланирует восстановление скролла.
    // Но скролл восстанавливать нельзя, т.к. записи еще не были отрисованы.
    const itemsIsRendered = itemsSizes.some((it) => {
        return it.size;
    });
    if (!itemsIsRendered) {
        return null;
    }

    let edgeItem: IEdgeItem = null;
    let itemKey: string;
    let itemOffset: number;
    let itemBorderBottom: number;
    let isValidItem: boolean;
    // при скроле вверх - на границе тот элемент, нижняя граница которого больше чем scrollTop
    let viewportBorderPosition = offset || 0;
    // при скроле вниз - на границе тот элемент, нижняя граница которого больше scrollTop + viewportSize
    if (direction === 'forward') {
        // нижняя граница - это верхняя + размер viewPort
        viewportBorderPosition += viewportSize;
    }

    const fillItemData = (item: IItemSize) => {
        itemKey = item.key;
        itemOffset = item.offset - placeholders.backward - scrollPosition;
        itemBorderBottom = Math.round(itemOffset) + Math.round(item.size);
        isValidItem = !validateItem || validateItem(itemKey);
    };

    for (
        let index = range.startIndex;
        index < range.endIndex && index < itemsSizes.length;
        index++
    ) {
        const item = itemsSizes[index];
        const prevItem = itemsSizes[index - 1];
        const nextItem = itemsSizes[index + 1];
        fillItemData(item);

        // запоминаем для восстановления скрола либо граничный элемент, либо просто самый последний.
        const isLastItem = index === range.endIndex - 1 || index === itemsSizes.length - 1;
        const hasNextRenderedItem = itemsSizes.slice(index + 1, range.endIndex).some((it) => {
            return it.size;
        });
        const isLastRenderedItem = (!nextItem || !nextItem.size) && !hasNextRenderedItem;
        if (itemBorderBottom > viewportBorderPosition || isLastItem || isLastRenderedItem) {
            // Не все элементы могут использоваться для запоминания граничного. Например, при вертикальном скролле -
            // группа не может использоваться в качестве граничного, т.к. при загрузке вверх - сам элемент группы будет
            // вытеснен загруженными записями выше и восстановление скролла к группе будет выглядеть некорректно.
            // Пример ошибки: https://online.sbis.ru/opendoc.html?guid=0d840742-e99c-4e5e-83d3-d91aa760d873
            if (!isValidItem && (!isLastItem || index !== 0)) {
                // проверка на direction === 'backward' введена, т.к. в дереве возникает ситуация, когда граничный
                // элемент - это footer узла и воостанавливать к нему скролл нельзя. в таком случае берем для
                // восстановления предыдущий элемент (https://online.sbis.ru/doc/30e805b5-bc36-459d-ac2d-dc2bc3ec2b9c)
                fillItemData(
                    isLastItem || (direction === 'backward' && prevItem) ? prevItem : nextItem
                );
            }

            // В плитке после удаления элементы все смещаются
            // Первый элемент в строке обязательно перескочет на другую строку и к нему нельзя восстанавливать скролл.
            // Поэтому берем следующий элемент.
            // Это не решает полностью проблему, но если удаляют много записей то в плитке все записи сместятся
            // и прыжок скролла не будет сильно бросаться в глаза.
            // Но зато мы чиним кейс, когда удаляют по одной записи с помощью itemActions.
            const itemIsFirstInRow =
                prevItem &&
                prevItem.offset < item.offset &&
                nextItem &&
                nextItem.offset === item.offset;
            if (itemIsFirstInRow) {
                fillItemData(nextItem);
            }

            if (isValidItem) {
                let borderDistance;
                let border;
                if (direction === 'forward') {
                    // от верхней границы элемента до нижней границы viewPort
                    // считаем так, из нижней границы viewPort вычитаем верхнюю границу элемента
                    border = 'backward';
                    borderDistance = viewportBorderPosition - itemOffset;
                } else {
                    // запись - выше, чем верхняя граница viewPort
                    if (viewportBorderPosition > itemOffset) {
                        border = 'forward';
                        borderDistance = itemBorderBottom - viewportBorderPosition;
                    } else {
                        border = 'backward';
                        borderDistance = viewportBorderPosition - itemOffset;
                    }
                }
                edgeItem = {
                    key: itemKey,
                    direction,
                    border,
                    borderDistance,
                };
                break;
            }
        }
    }

    return edgeItem;
}

export function getScrollPositionToEdgeItem(params: IGetScrollPositionToEdgeItem): number {
    const { itemsSizes, edgeItem, placeholders, scrollPosition, viewportSize } = params;

    let scrollPositionOffset = 0;

    const item = itemsSizes.find((itemSizesElement) => {
        return itemSizesElement.key === edgeItem.key;
    });
    if (!item) {
        return scrollPosition;
    }

    // https://jsfiddle.net/alex111089/oj8bL0mq/ нативная демка про восстановление скролла
    // Вычитаем scrollPosition, чтобы привести координаты в единую систему, до и после отрисовки.
    const itemOffset = item.offset - scrollPosition - placeholders.backward;
    if (edgeItem.direction === 'backward') {
        if (edgeItem.border === 'forward') {
            scrollPositionOffset = itemOffset + (item.size - edgeItem.borderDistance);
        } else {
            scrollPositionOffset = itemOffset + edgeItem.borderDistance;
        }
    } else {
        scrollPositionOffset = itemOffset - viewportSize + edgeItem.borderDistance;
    }

    return Math.max(scrollPosition + scrollPositionOffset, 0);
}
