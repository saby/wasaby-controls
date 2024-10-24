/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import type { ICalcMode, IItemsRange, IPlaceholders, IDirection } from '../ScrollController';
import { getRangeByIndex } from './CalculatorUtil';
import AbstractCalculator, {
    IAbstractCalculatorResult,
} from 'Controls/_listsCommonLogic/scrollController/Calculator/AbstractCalculator';

export type TInvertedIndexes =
    | { inverted: true; invertedIndexes: IItemsRange }
    | { inverted: false; extendDirection: IDirection };

export default class CalculatorWithoutVirtualization extends AbstractCalculator {
    addItems(position: number, count: number, calcMode: ICalcMode): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this.resetItems(this._totalCount + count, {
            startIndex: 0,
            endIndex: null,
        });
        return this._getRangeChangeResult(oldState, direction, direction);
    }

    removeItems(position: number, count: number): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this.resetItems(this._totalCount - count, {
            startIndex: 0,
            endIndex: null,
        });
        return this._getRangeChangeResult(oldState, direction, direction);
    }

    resetItems(totalCount: number, initRange: IItemsRange): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        this._totalCount = totalCount;

        this._range = getRangeByIndex({
            pageSize: totalCount,
            start: initRange.startIndex,
            end: null,
            totalCount,
        });

        return this._getRangeChangeResult(oldState, null, null);
    }

    getInvertedIndexes(index: number, offsetBeforeItem: number): TInvertedIndexes {
        const selectedItem = this._itemsSizes[index];
        const lastItem = this._itemsSizes[this._totalCount - 1];

        const offsetAfterItem = this._viewportSize - offsetBeforeItem - selectedItem.size;

        const invertedBefore = selectedItem.offset - offsetAfterItem;
        let invertedAfter = -offsetBeforeItem;

        invertedAfter +=
            lastItem.offset + lastItem.size - (selectedItem.offset + selectedItem.size);

        if (invertedBefore < 0 || invertedAfter < 0) {
            return {
                inverted: false,
                extendDirection: invertedBefore < 0 ? 'backward' : 'forward',
            };
        }
        return {
            inverted: true,
            invertedIndexes: {
                startIndex: 0,
                endIndex: this._totalCount,
            },
        };
    }

    /**
     * Вовзращает плэйсхолдеры, в данном классе он всегда заполнен 0.
     * Нужен, чтобы не переопределять методы: getFirstVisibleItemIndex, getEdgeVisibleItem, scrollPositionChange.
     * Данные методы вызывают утилиты, которые требуют плэйсхолдеры.
     * @protected
     */
    protected _getPlaceholders(): IPlaceholders {
        return { backward: 0, forward: 0 };
    }
}
