/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import {
    getActiveElementIndexByScrollPosition,
    getEdgeVisibleItem,
    getFirstVisibleItemIndex,
    getScrollPositionToEdgeItem,
} from './CalculatorUtil';

import type { IItemsSizes } from 'Controls/_listsCommonLogic/scrollController/ItemsSizeController/AbstractItemsSizeController';
import type {
    IActiveElementIndex,
    IDirection,
    IEdgeItem,
    IIndexesChangedParams,
    IItemsRange,
    IPlaceholders,
    ICalcMode,
    IValidateItemFunction,
} from 'Controls/_listsCommonLogic/scrollController/ScrollController';
import type { IEdgeItemCalculatingParams } from '../AbstractListVirtualScrollController';
import { isEqual } from 'Types/object';
import { TouchDetect } from 'EnvTouch/EnvTouch';

export interface IAbstractCalculatorState {
    range: IItemsRange;
    itemsSizes: IItemsSizes;
}

export interface IActiveElementIndexChanged extends IActiveElementIndex {
    activeElementIndexChanged: boolean;
}

export interface IAbstractCalculatorResult<
    TState extends IAbstractCalculatorState = IAbstractCalculatorState
> extends IIndexesChangedParams<TState> {
    indexesChanged: boolean;
}

export interface IAbstractCalculatorBaseOptions {
    scrollPosition: number;
    viewportSize: number;
    contentSize: number;
    totalCount: number;
    minVirtualScrollIndex: number;
    maxVirtualScrollIndex: number;

    /**
     * Режим подсчет активного элемента
     */
    feature1183225611: boolean;
    validateItemCallback?: IValidateItemFunction;
}

/**
 * Интерфейс опции класса Calculator
 * @private
 */
export interface IAbstractCalculatorOptions extends IAbstractCalculatorBaseOptions {
    itemsSizes: IItemsSizes;
}

/**
 * Класс предназначен для:
 *  - сбора, хранения и актуализации любых параметров scroll: scrollTop, размер viewPort, элементов и контента;
 *  - применение индексов virtual scroll на модель;
 *  - вычисление размеров virtual placeholders.
 * @private
 */
export default abstract class AbstractCalculator {
    protected _itemsSizes: IItemsSizes;
    /**
     * Предыдущие размеры элементов.
     * @remark Это такие предыдущие размеры, которые соответствуют старому диапазону записей
     * @protected
     */
    protected _oldItemsSizes: IItemsSizes;
    protected _scrollPosition: number;
    protected _viewportSize: number;
    protected _scrollContainerSize: number;
    protected _listContainerSize: number;
    protected _minVirtualScrollIndex: number;
    protected _maxVirtualScrollIndex: number;
    protected _contentSizeBeforeList: number = 0;
    protected _totalCount: number;
    protected _range: IItemsRange = { startIndex: 0, endIndex: 0 };
    protected _validateItemCallback: IValidateItemFunction;

    private readonly _feature1183225611: boolean;
    private _activeElementIndex: number;

    constructor(options: IAbstractCalculatorOptions) {
        this._itemsSizes = options.itemsSizes;
        this._scrollPosition = options.scrollPosition || 0;
        this._totalCount = options.totalCount;
        this._feature1183225611 = options.feature1183225611;
        this._viewportSize = options.viewportSize || 0;
        this._listContainerSize = options.contentSize || 0;
        this._minVirtualScrollIndex = options.minVirtualScrollIndex;
        this._maxVirtualScrollIndex = options.maxVirtualScrollIndex;
        this._validateItemCallback =
            options.validateItemCallback ||
            (() => {
                return true;
            });
    }

    shouldShiftRangeBeforeScrollToItem(index: number, position?: string, force?: boolean): boolean {
        return true;
    }

    // region Getters/Setters

    getRange(): IItemsRange {
        return this._range;
    }

    getPlaceholders(): IPlaceholders {
        return this._getPlaceholders();
    }

    getTotalItemsCount(): number {
        return this._totalCount;
    }

    setViewportSize(viewportSize: number): void {
        this._viewportSize = viewportSize;
    }

    setScrollContainerSize(size: number): void {
        this._scrollContainerSize = size;
    }

    setListContainerSize(listContainerSize: number): void {
        this._listContainerSize = listContainerSize;
    }

    setContentSizeBeforeList(size: number): void {
        this._contentSizeBeforeList = size;
    }

    getContentSizeBeforeList(): number {
        return this._contentSizeBeforeList || 0;
    }

    /**
     * Устанавливает новые размеры элементов
     * @param itemsSizes
     * @param saveOldItemsSizes
     */
    updateItemsSizes(itemsSizes: IItemsSizes, saveOldItemsSizes: boolean): boolean {
        if (!isEqual(this._itemsSizes, itemsSizes)) {
            if (saveOldItemsSizes) {
                this._oldItemsSizes = this._itemsSizes;
            } else {
                // Сбрасываем oldItemsSizes, чтобы EdgeItem считался по актуальным размерам, а не по старым
                this._oldItemsSizes = null;
            }
            this._itemsSizes = itemsSizes;
            return true;
        }
        return false;
    }

    /**
     * Возвращает индекс первой полностью видимой записи
     */
    getFirstVisibleItemIndex(stickyContentSize: number = 0): number {
        return getFirstVisibleItemIndex({
            itemsSizes: this._itemsSizes,
            currentRange: this._range,
            scrollPosition: this._scrollPosition,
            stickyContentSize,
            placeholders: this._getPlaceholders(),
        });
    }

    // endregion Getters/Setters

    // region EdgeVisibleItem

    /**
     * Считает и возвращает крайний видимый элемент.
     */
    getEdgeVisibleItem(params: IEdgeItemCalculatingParams): IEdgeItem {
        return getEdgeVisibleItem({
            ...params,
            range: params.range || this._range,
            placeholders: params.placeholders || this._getPlaceholders(),
            itemsSizes: params.itemsSizes || this._itemsSizes,
            viewportSize: this._viewportSize,
            scrollPosition: this._scrollPosition,
            validateItem: this._validateItemCallback,
        });
    }

    /**
     * Возвращает позицию скролла, чтобы EdgeItem остался так же виден.
     * @param edgeItem
     */
    getScrollPositionToEdgeItem(edgeItem: IEdgeItem): number {
        return getScrollPositionToEdgeItem({
            edgeItem,
            scrollPosition: this._scrollPosition,
            viewportSize: this._viewportSize,
            itemsSizes: this._itemsSizes,
            placeholders: this._getPlaceholders(),
        });
    }

    // endregion EdgeVisibleItem

    // region ScrollPositionChange

    /**
     * Изменение позиции скролла. Пересчитывает индекс активного элемента от текущей позиции скролла
     * @param scrollPosition Позиция скролла
     * @param updateActiveElement Нужно ли обновлять активный эелемент
     * @param viewportOverlaySize Размер элементов, перекрывающих верхнюю часть вьюпорта
     */
    scrollPositionChange(
        scrollPosition: number,
        updateActiveElement: boolean,
        viewportOverlaySize: number = 0
    ): IActiveElementIndexChanged {
        const oldActiveElementIndex = this._activeElementIndex;
        if (this._scrollPosition !== scrollPosition) {
            if (TouchDetect.getInstance().isTouch() && this._scrollContainerSize) {
                // На тач устройствах скролл может уходить за пределым контейнера.
                // Из-за этого позиция скролла не корректная и неправильно восстанавливается скролл.
                const maxScrollPosition = this._scrollContainerSize - this._viewportSize;
                this._scrollPosition = Math.min(scrollPosition, maxScrollPosition);
            } else {
                this._scrollPosition = scrollPosition;
            }
        }
        if (updateActiveElement) {
            this._activeElementIndex = getActiveElementIndexByScrollPosition({
                contentSize: this._listContainerSize + this._contentSizeBeforeList,
                viewportSize: this._viewportSize,
                itemsSizes: this._itemsSizes,
                currentRange: this._range,
                placeholders: this._getPlaceholders(),
                scrollPosition,
                viewportOverlaySize,
                totalCount: this._totalCount,
                feature1183225611: this._feature1183225611,
            });
        }

        return {
            activeElementIndex: this._activeElementIndex,
            activeElementIndexChanged: oldActiveElementIndex !== this._activeElementIndex,
        };
    }

    // endregion ScrollPositionChange

    setActiveElementIndex(activeElementIndex: number): void {
        this._activeElementIndex = activeElementIndex;
    }

    // region HandleCollectionChanges

    /**
     * Обрабатывает добавление элементов в коллекцию.
     * При необходимости смещает виртуальный диапазон.
     * @param position Индекс элемента, после которого добавили записи
     * @param count Кол-во добавленных записей
     * @param calcMode Режим пересчета диапазона отображаемых записей
     */
    abstract addItems(
        position: number,
        count: number,
        calcMode: ICalcMode
    ): IAbstractCalculatorResult;

    /**
     * Обрабатывает удаление элементов из коллекции.
     * Смещает соответственно виртуальный диапазон.
     * @param position Индекс первого удаленного элемента.
     * @param count Кол-во удаленных элементов.
     */
    abstract removeItems(position: number, count: number): IAbstractCalculatorResult;

    /**
     * Обрабатывает пересоздание всех элементов коллекции.
     * Пересчитываем виртуальный диапазон, placeholders, сбрасывает старые размеры элементов.
     * @param totalCount Новое кол-во элементов
     * @param initRange Диапазон, который задает изначальные значения start и end индексов.
     */
    abstract resetItems(totalCount: number, initRange: IItemsRange): IAbstractCalculatorResult;

    // endregion HandleCollectionChanges

    protected abstract _getPlaceholders(): IPlaceholders;

    protected _getRangeChangeResult(
        oldState: IAbstractCalculatorState,
        shiftDirection: IDirection | null,
        restoreDirection: IDirection | null = null,
        forceIndexesChanged: boolean = false
    ): IAbstractCalculatorResult {
        if (this._minVirtualScrollIndex !== undefined) {
            this._range.startIndex = Math.max(this._minVirtualScrollIndex, this._range.startIndex);
            this._range.endIndex = Math.max(this._minVirtualScrollIndex, this._range.endIndex);
        }

        if (this._maxVirtualScrollIndex !== undefined) {
            this._range.startIndex = Math.min(this._maxVirtualScrollIndex, this._range.startIndex);
            this._range.endIndex = Math.min(this._maxVirtualScrollIndex, this._range.endIndex);
        }

        // TODO избавиться от forceIndexesChanged по
        //  https://online.sbis.ru/opendoc.html?guid=c6c7d72b-6808-4500-b857-7455d0520d53
        const indexesChanged =
            oldState.range.startIndex !== this._range.startIndex ||
            oldState.range.endIndex !== this._range.endIndex ||
            forceIndexesChanged;

        return {
            range: this._range,
            oldState,
            indexesChanged,
            shiftDirection,
            restoreDirection,
            scrollMode: null,
        };
    }

    protected _getOldState(): IAbstractCalculatorState {
        return {
            range: this._range,
            itemsSizes: this._oldItemsSizes,
        };
    }
}
