/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import type { ICalcMode, IItemsRange, IPlaceholders } from '../ScrollController';
import { getRangeByIndex } from './CalculatorUtil';
import AbstractCalculator, {
    IAbstractCalculatorResult,
} from 'Controls/_baseList/Controllers/ScrollController/Calculator/AbstractCalculator';

export default class CalculatorWithoutVirtualization extends AbstractCalculator {
    addItems(position: number, count: number, calcMode: ICalcMode): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this.resetItems(this._totalCount + count, {
            startIndex: 0,
            endIndex: null,
        });
        return this._getRangeChangeResult(oldState, direction);
    }

    removeItems(position: number, count: number): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this.resetItems(this._totalCount - count, {
            startIndex: 0,
            endIndex: null,
        });
        return this._getRangeChangeResult(oldState, direction);
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

        return this._getRangeChangeResult(oldState, null);
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
