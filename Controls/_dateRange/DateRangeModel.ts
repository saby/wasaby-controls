/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import cExtend = require('Core/core-simpleExtend');
import { ObservableMixin, VersionableMixin, DateTime } from 'Types/entity';
import getPeriodType = require('Core/helpers/Date/getPeriodType');
import { Range, Base } from 'Controls/dateUtils';
import CalendarUtils from './Utils';

/**
 * Модель для контролов, предназначенных для ввода диапазона дат.
 * @class Controls/_dateRange/DateRangeModel
 *
 * @private
 */

/*
 * Model for date range controls.
 * @author Ковалев Г.Д.
 * @public
 * @noShow
 */
const _private = {
    setStartValue(self: typeof ModuleClass, value: Date): boolean {
        const startValueResetTime = Base.normalizeDate(self._startValue);
        if (Base.isDatesEqual(startValueResetTime, value)) {
            return false;
        }
        self._startValue = value;
        self._nextVersion();
        return true;
    },
    setEndValue(self: typeof ModuleClass, value: Date): boolean {
        const endValueResetTime = Base.normalizeDate(self._endValue);
        if (Base.isDatesEqual(endValueResetTime, value)) {
            return false;
        }
        self._endValue = value;
        self._nextVersion();
        return true;
    },
    notifyRangeChanged(self: typeof ModuleClass, start: Date, end: Date): void {
        const eventName = 'rangeChanged';
        self._notify(eventName, [start, end]);
        if (self._options && self._options[`${eventName}Callback`]) {
            self._options[`${eventName}Callback`](start, end);
        }
    },
    createDate(self: typeof ModuleClass, date: Date): DateTime {
        return new self._dateConstructor(date);
    },
};

// TODO: Переделать на класс

const ModuleClass = cExtend.extend(
    [ObservableMixin.prototype, VersionableMixin],
    {
        _options: null,
        _dateConstructor: DateTime,

        constructor(cfg?: { dateConstructor?: DateTime }) {
            ModuleClass.superclass.constructor.apply(this, arguments);
            if (cfg && cfg.dateConstructor) {
                this._dateConstructor = cfg.dateConstructor;
            }
        },

        update(options: object): boolean {
            this._options = options;
            let changed = false;
            if (
                options.hasOwnProperty('startValue') &&
                !Base.isDatesEqual(options.startValue, this._startValue)
            ) {
                this._startValue = options.startValue;
                changed = true;
            }
            if (
                options.hasOwnProperty('endValue') &&
                !Base.isDatesEqual(options.endValue, this._endValue)
            ) {
                this._endValue = options.endValue;
                changed = true;
            }
            return changed;
        },

        get startValue() {
            return this._startValue;
        },

        set startValue(value: Date) {
            if (_private.setStartValue(this, value)) {
                this._notifyValueChanged('startValue', value);
                _private.notifyRangeChanged(this, value, this._endValue);
            }
        },

        get endValue() {
            return this._endValue;
        },

        set endValue(value: Date) {
            if (_private.setEndValue(this, value)) {
                this._notifyValueChanged('endValue', value);
                _private.notifyRangeChanged(this, this._startValue, value);
            }
        },

        setRange(startValue: Date, endValue: Date) {
            let changed = false;
            if (_private.setStartValue(this, startValue)) {
                this._notifyValueChanged('startValue', startValue);
                changed = true;
            }
            if (_private.setEndValue(this, endValue)) {
                this._notifyValueChanged('endValue', endValue);
                changed = true;
            }
            if (changed) {
                _private.notifyRangeChanged(this, startValue, endValue);
            }
        },

        _notifyValueChanged(valueName: string, value: Date | null): void {
            if (Base.isValidDate(value) || value === null) {
                const eventName = `${valueName}Changed`;
                this._notify(eventName, [value]);
                if (this._options && this._options[`${eventName}Callback`]) {
                    this._options[`${eventName}Callback`](value);
                }
            }
        },

        _hitsDisplayedRange(date: Date, index: number): boolean {
            // Проверяем второй элемент массива на null. Если задан null в опции displayedRanges
            // то можно бесконечно переключать период.
            return (
                this._options.displayedRanges[index][0] <= date &&
                (this._options.displayedRanges[index][1] === null ||
                    this._options.displayedRanges[index][1] >= date)
            );
        },

        _getDisplayedRange(
            range: [Date, Date],
            direction: number
        ): [Date, Date] {
            const nextRange = Range.shiftPeriod(
                range[0],
                range[1],
                direction,
                this._options.selectionType
            );
            if (!this._options.displayedRanges) {
                return nextRange;
            }
            // Берем любую из дат, т.к. нам нужно дата с точностью в год
            const currentDate = new Date(range[0].getFullYear(), 0);
            const nextDate = new Date(nextRange[0].getFullYear(), 0);

            const findCurrentDateArrayIndex = (): number => {
                for (
                    let index = 0;
                    index < this._options.displayedRanges.length;
                    index++
                ) {
                    if (this._hitsDisplayedRange(currentDate, index)) {
                        return index;
                    }
                }
            };
            const arrayIndex = findCurrentDateArrayIndex();

            // Проверяем год, на который переходим. Если оне не попадает в тот же массив что и текущий год - ищем ближайших
            // год на который можно перейти в соседнем массиве
            if (this._hitsDisplayedRange(nextDate, arrayIndex)) {
                return nextRange;
            }

            // Высчитываем разница между startValue и endValue, чтобы оставить такой же промежуток
            const periodType = getPeriodType(range[0], range[1]);
            const intervals = {
                month: 1,
                quarter: 3,
                halfyear: 6,
                year: 12,
            };
            const currentInterval = intervals[periodType];

            const adjacentArray =
                this._options.displayedRanges[arrayIndex + direction];

            if (this._options.displayedRanges[arrayIndex + direction]) {
                let year;
                let startValueMonth;
                let endValueMonth;
                const monthsInYear = 12;
                if (direction === 1) {
                    startValueMonth = 0;
                    endValueMonth = currentInterval;
                    year = adjacentArray[0].getFullYear();
                } else {
                    startValueMonth = monthsInYear - currentInterval;
                    endValueMonth = monthsInYear;
                    year = adjacentArray[1].getFullYear();
                }
                return [
                    new Date(year, startValueMonth, 1),
                    new Date(year, endValueMonth, 0),
                ];
            }
            return range;
        },

        /**
         * If you select a period of several whole months, quarters, six months, or years,
         * then shift it for the same period forward.
         */
        _shiftRange(direction: number): void {
            if (this._startValue && this._endValue) {
                let range = this._prepareRange();
                range = this._getDisplayedRange(range, direction);
                if (this._hasRanges()) {
                    range = this._rangeSelected(range);
                }
                this.setRange(range[0], range[1]);
            }
        },

        shiftForward() {
            this._shiftRange(Range.SHIFT_DIRECTION.FORWARD);
        },

        /**
         * If a period of several whole months, quarters, six months, or years is selected,
         * it shifts it for the same period back.
         */
        shiftBack() {
            this._shiftRange(Range.SHIFT_DIRECTION.BACK);
        },

        _prepareRange(): Date[] {
            let range;
            if (this._hasRanges() && this._options.rangeSelectedCallback) {
                // Если заданы кванты вместе с rangeSelectedCallback, то мы должны сначала подстроить дату под них
                range = CalendarUtils.updateRangeByQuantum(
                    this.startValue,
                    this.startValue,
                    this._options.ranges
                );
            } else if (this._options.selectionType === 'workdays') {
                range = CalendarUtils.updateRangeByWorkdays(this.startValue);
            } else {
                range = [this.startValue, this.endValue];
            }
            return range;
        },

        _hasRanges(): boolean {
            return (
                this._options.selectionType === 'quantum' &&
                this._options.ranges
            );
        },

        _rangeSelected(range: Date[]): Date[] {
            if (this._options.rangeSelectedCallback) {
                return this._options.rangeSelectedCallback(range[0], range[1]);
            }
            return range;
        },
    }
);

ModuleClass._private = _private;

export default ModuleClass;
