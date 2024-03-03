/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import * as coreMerge from 'Core/core-merge';
import RangeSelectionController, { IRangeSelectionController } from './RangeSelectionController';
import IDateRangeSelectable = require('Controls/_dateRange/interfaces/IDateRangeSelectable');
import CalendarUtils from './../Utils';
import { Base as DateUtil } from 'Controls/dateUtils';

/**
 * Контроллер, реализующий выделение элементов от одного до другого. В качестве элементов используются даты.
 * Поддерживает выделение квантами кратными дням, неделям, месяцам.
 *
 * @remark
 * Компонент, которым управляет контроллер, должен поддерживать опции startValue и endValue.
 * Это значения элементов, от которого и до которого в данный момент выделен диапазон.
 * Так же компонент должен поддерживать события itemClick и itemMouseEnter.
 * Эти события должны передавать в качестве параметра значения элементов, с которыми в данный момент происходит взаимодействие.
 *
 * @class Controls/_dateRange/Controllers/DateRangeSelectionController
 * @extends Controls/_dateRange/Controllers/RangeSelectionController
 * @public
 */

interface IDateRangeSelectionController extends IRangeSelectionController {
    quantum: [];
}

export default class DateRangeSelectionController extends RangeSelectionController {
    private _quantum: {};
    private _isSingleQuant: boolean;
    private _rangeSelectedCallback: Function;

    protected _beforeMount(options: IDateRangeSelectionController): void {
        const quantum = options.quantum || {};
        this._quantum = quantum;
        this._rangeSelectedCallback = options.rangeSelectedCallback;

        const isSingleQuant = () => {
            // Проверяем, есть ли в каком-нибудь из видов кванта больше чем
            // одно значение (например days: [1, 3]). В таком
            // случае квант не единственный.
            for (const i in quantum) {
                if (quantum[i].length > 1) {
                    return false;
                }
            }
            // Проверяем, передали ли в quantum два или больше типа квантов
            // (days, weeks, months, quarters, halfyears и years).
            // Например {days: [3], weeks: [5]}, В таком случае квант
            // не единственный.
            return (
                options.selectionType === DateRangeSelectionController.SELECTION_TYPES.quantum &&
                Object.keys(quantum).length === 1
            );
        };

        this._isSingleQuant = isSingleQuant();
        const normalizedOptions = this._prepareState(options);
        super._beforeMount(normalizedOptions);
    }

    protected _beforeUpdate(options: IDateRangeSelectionController): void {
        const normalizedOptions = this._prepareState(options);
        super._beforeUpdate(normalizedOptions);
    }

    protected _prepareState(state: IDateRangeSelectionController): IDateRangeSelectionController {
        const newState = { ...state };
        if (newState.hasOwnProperty('startValue')) {
            newState.startValue = DateUtil.normalizeDate(state.startValue);
        }
        if (newState.hasOwnProperty('endValue')) {
            newState.endValue = DateUtil.normalizeDate(newState.endValue);
        }
        if (newState.hasOwnProperty('selectionBaseValue')) {
            newState.selectionBaseValue = DateUtil.normalizeDate(newState.selectionBaseValue);
        }
        if (newState.hasOwnProperty('selectionHoveredValue')) {
            newState.selectionHoveredValue = DateUtil.normalizeDate(newState.selectionHoveredValue);
        }
        return newState;
    }

    protected _isExternalChanged(
        valueName: string,
        options: IDateRangeSelectionController
    ): boolean {
        return (
            options.hasOwnProperty(valueName) &&
            !DateUtil.isDatesEqual(options[valueName], this['_' + valueName])
        );
    }

    protected _itemClickHandler(event: Event, item: Date): void {
        // Такое же событие может прилететь от списка
        if (!(item instanceof Date)) {
            return;
        }
        if (this._state.selectionType === DateRangeSelectionController.SELECTION_TYPES.workdays) {
            this._processSingleSelection(item);
        }
        if (this._state.selectionType === DateRangeSelectionController.SELECTION_TYPES.quantum) {
            // this._processRangeSelection(item);
            if (this._isSingleQuant) {
                this._processSingleSelection(item);
            } else {
                this._processRangeSelection(item);
            }
        } else {
            super._itemClickHandler(event, item);
        }
    }

    protected _getDisplayedRangeEdges(item: Date): Date[] {
        let range;
        if (this._selectionType === DateRangeSelectionController.SELECTION_TYPES.quantum) {
            range = CalendarUtils.updateRangeByQuantum(
                this.getSelectionBaseValue() || item,
                item,
                this._quantum
            );
        } else if (this._selectionType === DateRangeSelectionController.SELECTION_TYPES.workdays) {
            range = CalendarUtils.updateRangeByWorkdays(item);
        } else {
            range = super._getDisplayedRangeEdges(item);
        }
        if (this._rangeSelectedCallback) {
            range = this._rangeSelectedCallback(range[0], range[1], this.getSelectionBaseValue());
        }
        return range;
    }

    static SELECTION_TYPES: object = IDateRangeSelectable.SELECTION_TYPES;

    static getOptionTypes(): object {
        return coreMerge({}, IDateRangeSelectable.getOptionTypes());
    }

    static getDefaultOptions(): object {
        return coreMerge({}, IDateRangeSelectable.getDefaultOptions());
    }
}
