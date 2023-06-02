/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import AbstractCalculator, {
    IAbstractCalculatorOptions,
    IAbstractCalculatorState,
    IAbstractCalculatorResult,
    IAbstractCalculatorBaseOptions,
} from 'Controls/_baseList/Controllers/ScrollController/Calculator/AbstractCalculator';
import { IVirtualScrollConfig } from 'Controls/_baseList/interface/IVirtualScroll';
import { IItemsSizes } from 'Controls/_baseList/Controllers/ScrollController/ItemsSizeController/AbstractItemsSizeController';
import { ITriggersOffsets } from 'Controls/_baseList/Controllers/ScrollController/ObserverController/AbstractObserversController';
import {
    ICalcMode,
    IDirection,
    IHasItemsOutsideOfRange,
    IItemsRange,
    IPlaceholders,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import {
    getPlaceholdersByRange,
    getRangeByIndex,
    getRangeByItemsSizes,
    getRangeByScrollPosition,
    hasEnoughContentToScroll,
    shiftRangeBySegment,
} from 'Controls/_baseList/Controllers/ScrollController/Calculator/CalculatorUtil';
import { isEqual } from 'Types/object';
import { IRenderedOutsideItem } from '../ItemsSizeController/AbstractItemsSizeController';

export interface ICalculatorBaseOptions extends IAbstractCalculatorBaseOptions {
    /**
     * Настройка виртуализации
     */
    virtualScrollConfig: IVirtualScrollConfig;

    /**
     * Размеры элементов заданные прикладниками.
     * Берем их из рекордсета по itemHeightProperty.
     */
    givenItemsSizes?: IItemsSizes;

    /**
     * Изначальный индекс активного элемента. Далее будет пересчитываться по скроллу, или обновляться сверху.
     */
    activeElementIndex?: number;
}

export interface ICalculatorOptions
    extends ICalculatorBaseOptions,
        IAbstractCalculatorOptions {
    /**
     * Размеры смещения триггеров. Нужны чтобы избежать лишних отрисовок и сразу же отловить видимость триггера.
     */
    triggersOffsets: ITriggersOffsets;
}

export interface ICalculatorState extends IAbstractCalculatorState {
    hasItemsOutsideOfRange: IHasItemsOutsideOfRange;
    placeholders: IPlaceholders;
}

export interface ICalculatorResult
    extends IAbstractCalculatorResult<ICalculatorState> {
    hasItemsOutsideOfRange: IHasItemsOutsideOfRange;
    hasItemsOutsideOfRangeChanged: boolean;

    placeholders: IPlaceholders;
    placeholdersChanged: boolean;
}

const RELATION_COEFFICIENT_BETWEEN_PAGE_AND_SEGMENT = 4;

export class Calculator extends AbstractCalculator {
    private _givenItemsSizes: IItemsSizes;
    private _triggersOffsets: ITriggersOffsets;
    private _virtualScrollConfig: IVirtualScrollConfig;
    private _itemsRenderedOutsideRange: IRenderedOutsideItem[] = [];
    private _contentSizeBeforeList: number = 0;
    private _placeholders: IPlaceholders = { backward: 0, forward: 0 };

    constructor(options: ICalculatorOptions) {
        super(options);

        this._givenItemsSizes = options.givenItemsSizes;
        this._triggersOffsets = options.triggersOffsets;
        this._virtualScrollConfig = options.virtualScrollConfig;
    }

    // region Setters/Getters

    setTriggerOffsets(triggerOffset: ITriggersOffsets): void {
        this._triggersOffsets = triggerOffset;
    }

    /**
     * Возвращает, что в заданном направлении еще есть не отображенные элементы.
     * Используется, чтобы понять нужно ли подгружать данные или нужно сделать ссмещение виртуального скролла.
     * @param direction Направление
     */
    hasItemsOutsideOfRange(direction: IDirection): boolean {
        return direction === 'backward'
            ? this._range.startIndex > 0
            : this._range.endIndex < this._totalCount;
    }

    updateGivenItemsSizes(itemsSizes: IItemsSizes): void {
        this._givenItemsSizes = itemsSizes;
        if (itemsSizes) {
            // Инициализируем _itemsSizes по размерам из itemHeightProperty.
            // Так мы до маунта и получения размеров из DOM делать вычисления для работы с диапазоном.
            // Это нужно для оптимизации рендера тяжелых списков, например, в карточке контрагента,
            // где построить даже одну лишнюю запись дорого для производительности.
            this._itemsSizes = itemsSizes;
        }
    }

    /**
     * Устанавливает массив элементов, которые отрисовываются за пределами диапазона.
     * Например затсиканная запись, она не должна скрываться из DOM-а пока застикана.
     * @param items
     */
    setItemsRenderedOutsideRange(items: IRenderedOutsideItem[]): ICalculatorResult {
        const oldState = this._getOldState();

        if (!isEqual(this._itemsRenderedOutsideRange, items)) {
            this._itemsRenderedOutsideRange = items;
            this._placeholders = getPlaceholdersByRange({
                range: this._range,
                totalCount: this._totalCount,
                itemsSizes: this._itemsSizes,
                itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
                calcByOffset: this._virtualScrollConfig.calcByOffset,
                contentSizeBeforeList: this._contentSizeBeforeList,
            });
        }

        return this._getRangeChangeResult(oldState, null);
    }

    setContentSizeBeforeList(size: number): void {
        this._contentSizeBeforeList = size;
    }

    // endregion Setters/Getters

    // region ShiftRange

    shiftRangeToDirection(direction: IDirection): ICalculatorResult {
        const oldState = this._getOldState();

        if (this.hasItemsOutsideOfRange(direction)) {
            this._range = shiftRangeBySegment({
                currentRange: this._range,
                direction,
                pageSize: this._virtualScrollConfig.pageSize,
                segmentSize: this._getSegmentSize(),
                totalCount: this._totalCount,
                viewportSize: this._viewportSize,
                scrollPosition: this._scrollPosition,
                triggersOffsets: this._triggersOffsets,
                itemsSizes: this._itemsSizes,
                placeholders: this._placeholders,
                contentSizeBeforeList: this._contentSizeBeforeList,
                calcMode: 'shift',
            });

            this._placeholders = getPlaceholdersByRange({
                range: this._range,
                totalCount: this._totalCount,
                itemsSizes: this._itemsSizes,
                itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
                calcByOffset: this._virtualScrollConfig.calcByOffset,
                contentSizeBeforeList: this._contentSizeBeforeList,
            });
        }

        return this._getRangeChangeResult(oldState, direction);
    }

    shiftRangeToIndex(
        index: number,
        force?: boolean,
        position?: string
    ): ICalculatorResult {
        const oldState = this._getOldState();
        let shiftDirection = null;

        // Смещать диапазон нужно, если
        // 1. Элемент находится за пределами текущего диапазона
        // 2. Мы не можем к нему полноценно проскроллить(проскроллить так, чтобы элемент был в верху/внизу вьюпорта)
        // Если все записи и так отображаются, то нет смысла пытаться пересчитать диапазон
        if (this.hasEnoughContentToScrollToItem(index, position, force)) {
            shiftDirection =
                index > this._range.endIndex ? 'forward' : 'backward';

            // Когда скроллим запись к низу экрана, то перестраиваем диапазон так, чтобы запись была в конце.
            // TODO SCROLL: это можно сделать лучше:
            //  https://online.sbis.ru/opendoc.html?guid=f64aeb44-af77-4a3a-a5f1-5a3604102051
            const startIndex =
                position === 'bottom'
                    ? Math.max(
                          index - this._virtualScrollConfig.pageSize + 1,
                          0
                      )
                    : index;
            this._range = getRangeByIndex({
                pageSize: this._virtualScrollConfig.pageSize,
                start: startIndex,
                end: null,
                totalCount: this._totalCount,
            });

            this._placeholders = getPlaceholdersByRange({
                range: this._range,
                totalCount: this._totalCount,
                itemsSizes: this._itemsSizes,
                itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
                calcByOffset: this._virtualScrollConfig.calcByOffset,
                contentSizeBeforeList: this._contentSizeBeforeList,
            });
        }

        return this._getRangeChangeResult(oldState, shiftDirection);
    }

    hasEnoughContentToScrollToItem(
        index: number,
        position?: string,
        force?: boolean
    ): boolean {
        const hasEnoughContent = hasEnoughContentToScroll({
            range: this._range,
            viewportSize: this._viewportSize,
            itemIndex: index,
            itemsSizes: this._itemsSizes,
            itemPosition: position,
            calcByOffset: this._virtualScrollConfig.calcByOffset,
        });

        const itemOffset =
            this._itemsSizes[index].offset - this._placeholders.backward;
        const backwardViewportBorderPosition = this._scrollPosition;
        const forwardViewportBorderPosition =
            backwardViewportBorderPosition + this._viewportSize;
        const itemInsideViewport =
            itemOffset >= backwardViewportBorderPosition &&
            itemOffset <= forwardViewportBorderPosition;
        const allItemsIsDisplayed =
            this._range.endIndex - this._range.startIndex === this._totalCount;

        return (
            (!this._isItemInRange(index) ||
                (!hasEnoughContent && (!itemInsideViewport || force))) &&
            !allItemsIsDisplayed
        );
    }

    shiftRangeToVirtualScrollPosition(
        scrollPosition: number
    ): ICalculatorResult {
        const oldState = this._getOldState();

        if (this._scrollPosition !== scrollPosition) {
            const direction =
                scrollPosition > this._scrollPosition ? 'forward' : 'backward';
            this._range = getRangeByScrollPosition({
                itemsSizes: this._itemsSizes,
                pageSize: this._virtualScrollConfig.pageSize,
                scrollPosition,
                totalCount: this._totalCount,
                triggerOffset: this._triggersOffsets[direction],
            });

            this._placeholders = getPlaceholdersByRange({
                range: this._range,
                totalCount: this._totalCount,
                itemsSizes: this._itemsSizes,
                itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
                calcByOffset: this._virtualScrollConfig.calcByOffset,
                contentSizeBeforeList: this._contentSizeBeforeList,
            });
        }

        // При скролле к виртуальной позиции нельзя сказать куда сместился диапазон, т.к. по сути это поведение схожее
        // с resetItems. Мы просто создаем новый диапазон, а не смещаем старый. Поэтому shiftDirection = null;
        // Это нужно чтобы мы не востанавливали скролл.
        return this._getRangeChangeResult(oldState, null);
    }

    // endregion ShiftRange

    // region HandleCollectionChanges

    /**
     * Обрабатывает добавление элементов в коллекцию.
     * При необходимости смещает виртуальный диапазон.
     * @param position Индекс элемента, после которого добавили записи
     * @param count Кол-во добавленных записей
     * @param calcMode Режим пересчета диапазона отображаемых записей
     */
    addItems(
        position: number,
        count: number,
        calcMode: ICalcMode
    ): ICalculatorResult {
        // FIXME: сверху может быть группа, которая сместится вверх.
        //  То есть записи добавляют после группы, но по факту в самое начало.
        //  Сейчас только скрытую группу смотрим.
        const firstItem = (this._oldItemsSizes || this._itemsSizes)[0];
        const startPosition =
            !firstItem ||
            !firstItem.hasOwnProperty('key') ||
            this._validateItemCallback(firstItem?.key)
                ? 0
                : 1;
        const addToStart = position === startPosition || position === 0;
        // Если добавили записи в самое начало, то нужно перезаписать oldItemsSizes текущими размерами, т.к.
        // будет смещен диапазон и чтобы не выйти за пределы массива нужно взять актуальный размеры.
        if (addToStart) {
            this._oldItemsSizes = this._itemsSizes;
        }

        const oldState = this._getOldState();
        this._totalCount += count;
        let indexesChanged = false;

        // если записи добавляют в начало и список не проскроллен, то не нужно пересчитывать range,
        // т.к. добавленная запись должна сразу стать видна вверху и собой выместить последнюю запись в диапазоне
        // Если добавляют записи в пустой список, то не нужно тут пересчитывать диапазон,
        // он сразу правильно посчитается в shiftRangeBySegment.
        const shouldChangeRange =
            this._totalCount !== count &&
            (calcMode !== 'nothing' || !!this._scrollPosition || count > 1);
        // Корректируем старый диапазон. Т.к. записи добавились  в начало, то все индексы сместятся на count
        if (addToStart && shouldChangeRange) {
            indexesChanged = true;
            this._range.startIndex = Math.min(
                this._totalCount,
                this._range.startIndex + count
            );
            this._range.endIndex = Math.min(
                this._totalCount,
                this._range.endIndex + count
            );
        }

        const direction = this._calcAddDirection(position, count);
        this._range = shiftRangeBySegment({
            currentRange: this._range,
            direction,
            calcMode,
            pageSize: this._virtualScrollConfig.pageSize,
            segmentSize: this._getSegmentSize(),
            totalCount: this._totalCount,
            viewportSize: this._viewportSize,
            scrollPosition: this._scrollPosition,
            triggersOffsets: this._triggersOffsets,
            itemsSizes: this._itemsSizes,
            contentSizeBeforeList: this._contentSizeBeforeList,
            placeholders: this._placeholders,
        });

        this._placeholders = getPlaceholdersByRange({
            range: this._range,
            totalCount: this._totalCount,
            itemsSizes: this._itemsSizes,
            itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
            calcByOffset: this._virtualScrollConfig.calcByOffset,
            contentSizeBeforeList: this._contentSizeBeforeList,
        });

        return this._getRangeChangeResult(oldState, direction, indexesChanged);
    }

    /**
     * Обрабатывает удаление элементов из коллекции.
     * Смещает соответственно виртуальный диапазон.
     * @param position Индекс первого удаленного элемента.
     * @param count Кол-во удаленных элементов.
     */
    removeItems(position: number, count: number): ICalculatorResult {
        const oldState = this._getOldState();
        const direction =
            position <= this._range.startIndex ? 'backward' : 'forward';
        // Всегда смещаем диапазон, если удалили записи в начале и пересчитываем при удалении после startIndex,
        // только если за пределами диапазона недостаточно записей для заполнения pageSize, в противном случае
        // записи за пределами диапазона сами попадут в текущий диапазон из-за удаления записей.
        const enoughItemsToForward =
            this._totalCount - this._range.endIndex >= count;
        const shouldShiftRange =
            direction === 'backward' || !enoughItemsToForward;

        this._totalCount -= count;

        if (shouldShiftRange) {
            this._range = shiftRangeBySegment({
                currentRange: this._range,
                direction,
                pageSize: this._virtualScrollConfig.pageSize,
                segmentSize: count,
                totalCount: this._totalCount,
                viewportSize: this._viewportSize,
                scrollPosition: this._scrollPosition,
                triggersOffsets: this._triggersOffsets,
                itemsSizes: this._itemsSizes,
                placeholders: this._placeholders,
                contentSizeBeforeList: this._contentSizeBeforeList,
                calcMode: 'shift',
            });
        }

        this._placeholders = getPlaceholdersByRange({
            range: this._range,
            totalCount: this._totalCount,
            itemsSizes: this._itemsSizes,
            itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
            calcByOffset: this._virtualScrollConfig.calcByOffset,
            contentSizeBeforeList: this._contentSizeBeforeList,
        });

        return this._getRangeChangeResult(oldState, direction);
    }

    /**
     * Обрабатывает пересоздание всех элементов коллекции.
     * Пересчитываем виртуальный диапазон, placeholders, сбрасывает старые размеры элементов.
     * @param totalCount Новое кол-во элементов
     * @param initRange Диапазон, который задает изначальные значения start и end индексов.
     */
    resetItems(totalCount: number, initRange: IItemsRange): ICalculatorResult {
        const oldState = this._getOldState();
        this._totalCount = totalCount;

        if (this._givenItemsSizes) {
            this._range = getRangeByItemsSizes({
                start: initRange.startIndex,
                totalCount: this._totalCount,
                viewportSize: this._viewportSize,
                itemsSizes: this._givenItemsSizes,
            });
        } else {
            this._range = getRangeByIndex({
                pageSize: this._virtualScrollConfig.pageSize,
                start: initRange.startIndex,
                end: initRange.endIndex,
                totalCount: this._totalCount,
            });
        }
        // Пересчитываем плэйсхолдеры. При пересчете они сбросятся в 0(размеры элементов уже были сброшены)
        this._placeholders = getPlaceholdersByRange({
            range: this._range,
            totalCount: this._totalCount,
            itemsSizes: this._itemsSizes,
            itemsRenderedOutsideRange: this._itemsRenderedOutsideRange,
            calcByOffset: this._virtualScrollConfig.calcByOffset,
            contentSizeBeforeList: this._contentSizeBeforeList,
        });

        return this._getRangeChangeResult(oldState, null);
    }

    // endregion HandleCollectionChanges

    protected _getPlaceholders(): IPlaceholders {
        return this._placeholders;
    }

    protected _getRangeChangeResult(
        oldState: ICalculatorState,
        shiftDirection: IDirection | null,
        forceIndexesChanged: boolean = false
    ): ICalculatorResult {
        const hasItemsOutsideOfRange = {
            backward: this.hasItemsOutsideOfRange('backward'),
            forward: this.hasItemsOutsideOfRange('forward'),
        };
        const hasItemsOutsideOfRangeChanged =
            oldState.hasItemsOutsideOfRange.backward !==
                hasItemsOutsideOfRange.backward ||
            oldState.hasItemsOutsideOfRange.forward !==
                hasItemsOutsideOfRange.forward;

        const placeholdersChanged =
            oldState.placeholders.backward !== this._placeholders.backward ||
            oldState.placeholders.forward !== this._placeholders.forward;

        return {
            ...super._getRangeChangeResult(
                oldState,
                shiftDirection,
                forceIndexesChanged
            ),
            oldState,

            hasItemsOutsideOfRange,
            hasItemsOutsideOfRangeChanged,

            placeholders: { ...this._placeholders },
            placeholdersChanged,
        };
    }

    protected _getOldState(): ICalculatorState {
        return {
            ...super._getOldState(),
            placeholders: this._placeholders,
            hasItemsOutsideOfRange: {
                backward: this.hasItemsOutsideOfRange('backward'),
                forward: this.hasItemsOutsideOfRange('forward'),
            },
        };
    }

    /**
     * Возвращает, что элемент по переданному index находится внутри виртуального диапазона
     * @param index Индекс элемента
     * @return {boolean}
     */
    private _isItemInRange(index: number): boolean {
        return index >= this._range.startIndex && index < this._range.endIndex;
    }

    private _getSegmentSize(): number {
        const virtualScrollConfig = this._virtualScrollConfig;
        let segmentSize = virtualScrollConfig.segmentSize;
        if (!segmentSize) {
            segmentSize = Math.ceil(
                virtualScrollConfig.pageSize /
                    RELATION_COEFFICIENT_BETWEEN_PAGE_AND_SEGMENT
            );
        }
        return segmentSize;
    }

    private _calcAddDirection(position: number, count: number): IDirection {
        // Если изначально не было элементов, то direction === 'forward'
        if (this._totalCount === count) {
            return 'forward';
        }

        const startIndex = this._validateItemCallback(
            this._itemsSizes[this._range.startIndex].key
        )
            ? this._range.startIndex
            : this._range.startIndex + 1;
        const addBeforeStartIndex = position <= startIndex;
        // Если список проскролен в конец, то диапазон нужно стараться оставить прижатым к этому концу
        // Поэтому direction считаем 'forward', чтобы попытаться сместить диапазон в эту сторону.
        // Иначе мы можем скрыть запись в конце, которая была видна.
        const scrolledToForwardEdge =
            this._scrollPosition &&
            this._scrollPosition + this._viewportSize >=
                this._listContainerSize;
        return addBeforeStartIndex && !scrolledToForwardEdge
            ? 'backward'
            : 'forward';
    }
}
