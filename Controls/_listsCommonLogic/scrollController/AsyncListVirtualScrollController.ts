/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
} from './ListVirtualScrollController';

import {
    ObserversController,
    IObserversControllerOptions,
} from './ObserverController/ObserversController';
import {
    ItemsSizeController,
    IItemsSizesControllerOptions,
} from './ItemsSizeController/ItemsSizeController';
import type {
    IDirection,
    IItemsRange,
    ICalcMode,
    IHasItemsOutsideOfRange,
    IScrollMode,
} from 'Controls/_listsCommonLogic/scrollController/ScrollController';
import type { TItemKey } from 'Controls/display';

export type IItemsSizesControllerConstructor = new (
    options: IItemsSizesControllerOptions
) => ItemsSizeController;
export type IObserversControllerConstructor = new (
    options: IObserversControllerOptions
) => ObserversController;

/**
 * Контроллер виртуального скролла для списка с асинхронным построением элементов
 * TODO: будет не нужен, когда будет только синхронное построение.
 * @private
 */

export class AsyncListVirtualScrollController extends ListVirtualScrollController {
    private _nextRange: IItemsRange;
    private _isReset: boolean;
    private _renderAfterReset: boolean;
    private _startIndexShift: number;
    private _shiftDirection: IDirection;
    private _prevHasItemsOutsideRange: IHasItemsOutsideOfRange = {
        backward: false,
        forward: false,
    };
    private _changeItemsOutRangeOnItemsRendered: Function;
    constructor(options: IListVirtualScrollControllerOptions) {
        super(options);
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirection
    ): void {
        if (this._isReset || this._isAllRendered({ startIndex, endIndex })) {
            super._applyIndexes(startIndex, endIndex, shiftDirection);
            if (this._prevHasItemsOutsideRange && !this._isReset) {
                this._hasItemsOutRangeChangedHandler(this._prevHasItemsOutsideRange);
            }
            this._isReset = false;
            this._nextRange = null;
            this._shiftDirection = null;
        } else {
            this._nextRange = { startIndex, endIndex };
            this._shiftDirection = shiftDirection;
            if (typeof this._startIndexShift === 'number') {
                super._applyIndexes(startIndex + this._startIndexShift, endIndex, shiftDirection);
                this._startIndexShift = null;
            }
            this._collection.setNextIndexes(startIndex, endIndex, shiftDirection);
        }
    }

    protected _isAllRendered(range?: IItemsRange): boolean {
        return super._isAllRendered(range || this._nextRange);
    }

    protected _hasItemsOutRangeChangedHandler(
        hasItemsOutsideOfRange: IHasItemsOutsideOfRange
    ): void {
        if (this._isAllRendered() || this._renderAfterReset) {
            super._hasItemsOutRangeChangedHandler(hasItemsOutsideOfRange);
            this._prevHasItemsOutsideRange = hasItemsOutsideOfRange;
            this._changeItemsOutRangeOnItemsRendered = null;
        } else {
            this._changeItemsOutRangeOnItemsRendered = () => {
                this._hasItemsOutRangeChangedHandler(hasItemsOutsideOfRange);
            };
        }
    }

    addItems(position: number, count: number, scrollMode: IScrollMode, calcMode: ICalcMode): void {
        if (position <= this._collection.getStartIndex() && calcMode === 'shift') {
            // При добаввлении в начало, нужно сдвинуть текущие границы диапазона,
            // чтобы новые записи не попали сразу в список отрисованных
            this._startIndexShift = count;

            // До момента отрисовки добавленных записей, считается, что диапазон просто сдвинулся.
            // После отрисовки, будет применено новое состояние и оно будет актуально.
            super._hasItemsOutRangeChangedHandler({
                backward: true,
                forward: this._prevHasItemsOutsideRange.forward,
            });
        }
        if (
            position > this._collection.getStartIndex() &&
            position < this._collection.getStopIndex() &&
            calcMode === 'shift'
        ) {
            // при добавлении записей внутри диапазона, расширяем диапазон, чтобы старые записи не были вытеснены, пока
            // новые еще не отрисованы
            this._startIndexShift = -count;
        }
        super.addItems(position, count, scrollMode, calcMode);
        if (position === 0 && calcMode === 'shift') {
            this._hasItemsOutRangeChangedHandler(this._prevHasItemsOutsideRange);
        }
    }

    resetItems(): void {
        this._isReset = true;
        this._renderAfterReset = true;
        super.resetItems();
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        // Если не все записи отрисованы, значит еще рано устанавливать itemsContainer и работать с ним.
        // Откладываем до перерисовки, когда все записи из диапазона будут построены.
        if (this._isAllRendered()) {
            super.setItemsContainer(itemsContainer);
            this._setItemsContainerOnItemsRendered = null;
        } else {
            this._setItemsContainerOnItemsRendered = () => {
                this.setItemsContainer(itemsContainer);
                this._scrollController.updateItemsSizes();
            };
        }
    }

    afterRenderListControl(): void {
        this._setItemsContainerOnItemsRendered?.();

        // Если не все записи отрендерились, нужно попробовать сделать запланированный подскролл к записи,
        // иначе, при смене записей, скролл нативно отлетит из-за изменения контента.
        // Но восстанавливать скролл надо только при отрисовке после reset (флаг this._renderAfterReset),
        // т.к. в верстке должны быть хотя бы старые записи.
        if (
            this._renderAfterReset &&
            !this._isAllRendered() &&
            this._scheduledScrollParams?.type === 'scrollToElement'
        ) {
            this._handleScheduledScroll();
        }
        this._renderAfterReset = false;
        super.afterRenderListControl();
    }

    setRenderedItems(renderedItems: TItemKey[]): void {
        super.setRenderedItems(renderedItems);
        if (this._nextRange && this._isAllRendered()) {
            this._changeItemsOutRangeOnItemsRendered?.();
            this._applyIndexes(
                this._nextRange.startIndex,
                this._nextRange.endIndex,
                this._shiftDirection
            );
            this._collection.setNextIndexes(undefined, undefined, null);
        }
    }
}
