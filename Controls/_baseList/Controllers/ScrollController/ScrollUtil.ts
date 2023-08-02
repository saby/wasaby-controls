/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import type {
    ICalcMode,
    IItemsRange,
    IScrollMode,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import { CollectionItem } from 'Controls/display';

/*
При подгрузке в любую из сторон:
      сохранять скролл 100% надо и 100% надо пересчитать диапазон

При добавлении в рекордсет(прикладник запушил, разворот узла, подгрузка в узел):
    =============ПРОСКРОЛЛЕН В НАЧАЛО===========
    [[[ НАЧАЛО ]]]
    1. был скролл === 0, добавили запись перед текущей первой.
            если virtualPageSize > (stop - start) - не сохранять скролл и дополнять диапазон.

    [[[ СЕРЕДИНА ]]]
    2. был скролл === 0, добавили запись после первой, перед последней.
            если virtualPageSize > (stop - start) - дополняем диапазон

    [[[ КОНЕЦ ]]]
    3. был скролл === 0, добавили запись после текущей последней.
            если virtualPageSize > (stop - start) - дополняем диапазон

    =============ПРОСКРОЛЛЕН В СЕРЕДИНУ===========
    [[[ НАЧАЛО ]]]
    4. был скролл === 100, добавили запись перед текущей первой.
            если virtualPageSize > (stop - start) - дополняем диапазон
                + нужно сохранять скролл (чтобы не прыгнуло, saveItem = 5)

    [[[ СЕРЕДИНА ]]]
    5. был скролл === 100, добавили запись после первой, но перед последней.
            если virtualPageSize > (stop - start) - дополняем диапазон
            ВСЕГДА нужно сохранять скролл
                (чтобы не прыгнуло, ведь могут добавить перед первой видимой записью)

    [[[ КОНЕЦ ]]]
    6. был скролл === 100, добавили запись после последней.
            если virtualPageSize > (stop - start) - дополняем диапазон

    =============ПРОСКРОЛЛЕН В КОНЕЦ===========
    [[[ НАЧАЛО ]]]
    7. был скролл === END, добавили запись перед текущей первой.
            если virtualPageSize > (stop - start) - дополняем диапазон
                + в случае дополнения нужно сохранять скролл

    [[[ СЕРЕДИНА ]]]
    8. был скролл === END, добавили запись после первой перед последней.
            если virtualPageSize > (stop - start) - дополняем диапазон
            ВСЕГДА нужно сохранять скролл

    [[[ КОНЕЦ ]]]
    9. был скролл === END, добавили запись после текущей последней.
            Нужно всегда сдвигать диапазон, из-за этого записи в начале удалятся,
            в конце добавятся и на скролл влиять не нужно
            https://jsfiddle.net/alex111089/h25ba03s/
*/

export interface IGetModeParams {
    itemsLoadedByTrigger: boolean;
    newItemsIndex: number;
    range: IItemsRange;
    virtualPageSize: number;
    scrolledToBackwardEdge: boolean;
    scrolledToForwardEdge: boolean;
    portionedLoading: boolean;
    changedItems?: CollectionItem[][];
    preloadItems?: boolean;
    renderPreloadedItems?: boolean;
}

export function getCalcMode(params: IGetModeParams): ICalcMode {
    const virtualPageSize = params.virtualPageSize;
    const virtualPageIsFilled =
        virtualPageSize && virtualPageSize <= params.range.endIndex - params.range.startIndex;
    const addToEnd = params.newItemsIndex >= params.range.endIndex;

    let calcMode: ICalcMode;
    if (params.preloadItems && params.renderPreloadedItems) {
        // Предзагруженные записи нужно рендерить принудительно на segmentSize,
        // не нужно предзагруженными записями пытаться заполнять весь virtualPageSize
        calcMode = 'shift-on-segment';
    } else if (params.portionedLoading) {
        // Если проскроллены к краю, то должны пересчитать диапазон, чтобы подгруженны записи сразу отобразились.
        const scrolledToEdge = params.scrolledToBackwardEdge || params.scrolledToForwardEdge;
        calcMode = virtualPageIsFilled && !scrolledToEdge ? 'nothing' : 'shift';
    } else if (params.itemsLoadedByTrigger) {
        calcMode = 'shift';
    } else if (params.scrolledToForwardEdge) {
        // когда проскроллены в конец нужно обязательно пересчитывать диапазон,
        // т.к. записи в конце не должны пропасть
        calcMode = addToEnd || virtualPageIsFilled ? 'shift' : 'extend';
    } else if (params.scrolledToBackwardEdge) {
        calcMode = virtualPageIsFilled ? 'nothing' : 'extend';
    } else {
        // список проскроллен не в начало и не в конец
        // Если виртуальная страница заполнена, то не нужно смещать диапазон, добавленная запись должна:
        // 1. Если добавлена в диапазон, то выместить собой запись в конце диапазона(не нужно пересчитывать диапазон)
        // 2. Если добавлена вне диапазона, то ничего не делать
        calcMode = virtualPageIsFilled ? 'nothing' : 'shift';
    }

    return calcMode;
}

export function getScrollMode(params: IGetModeParams): IScrollMode {
    const virtualPageSize = params.virtualPageSize;
    const virtualPageIsFilled =
        virtualPageSize && virtualPageSize <= params.range.endIndex - params.range.startIndex;
    const addToStart = params.newItemsIndex <= params.range.startIndex;
    const addToEnd = params.newItemsIndex >= params.range.endIndex;
    const addToMiddle = !addToStart && !addToEnd;
    const isFirstChangesInSession = !params.changedItems || params.changedItems.length === 1;

    let scrollMode: IScrollMode;
    if (!isFirstChangesInSession) {
        // Если это не первое изменение в сессии, то не нужно перебивать восстановление скролла новой пачкой записей.
        // Такое может быть, например если при подгрузке часть записей оказывается в уже существующей группе.
        // Из-за этого событий об изменении коллекции будет 2, т.к. группа разделяет загруженные записи на 2 группы.
        scrollMode = 'unfixed';
    } else if (params.itemsLoadedByTrigger) {
        scrollMode = 'fixed';
    } else if (params.scrolledToForwardEdge) {
        scrollMode =
            (addToStart && !virtualPageIsFilled) ||
            addToMiddle ||
            addToEnd ||
            params.portionedLoading
                ? 'fixed'
                : 'unfixed';
    } else if (params.scrolledToBackwardEdge) {
        // В этом случае не нужно восстанавливать скролл. ПРи подгрузке у нас сработает условие выше.
        // А если добавили какую-то запись просто в рс, то ее нужно сразу увидеть
        scrollMode = 'unfixed';
    } else {
        // список проскроллен не в начало и не в конец
        scrollMode = 'fixed';
    }

    return scrollMode;
}

export function getMaxScrollPosition(scrollContentSize: number, viewportSize: number): number {
    if (!scrollContentSize || !viewportSize) {
        return 0;
    }

    return scrollContentSize - viewportSize;
}
