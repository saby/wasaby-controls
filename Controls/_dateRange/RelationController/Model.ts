/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import getPeriodType = require('Core/helpers/Date/getPeriodType');
import { Range, Base as dateUtils } from 'Controls/dateUtils';
import { IDateConstructorOptions } from 'Controls/interface';

const getPeriodLengthInMonthByType = (periodType) => {
    switch (periodType) {
        case 'month':
            return 1;
        case 'quarter':
            return 3;
        case 'halfyear':
            return 6;
        case 'year':
            return 12;
    }
};

enum SLIDE_DATE_TYPE {
    days,
    months,
    years,
}

const PLURAL_DATE = ['days', 'months', 'years'];

type TRange = [Date | null, Date | null];

export interface IModel extends IDateConstructorOptions {
    bindType: string;
    autoRangeChange: boolean;
}

class ModuleClass {
    ranges: TRange[];
    private _steps: number[];
    private _bindType: string;
    private _dateConstructor: Function;
    private _autoRangeChange: boolean;

    constructor(options: IModel) {
        this.update(options);
    }

    /**
     * Updates model fields.
     * @param options
     */
    update(options: IModel): void {
        this.ranges = this._getRangesFromOptions(options);
        this._updateSteps(this.ranges);
        this._bindType = options.bindType;
        this._dateConstructor = options.dateConstructor;
        this._autoRangeChange = options.autoRangeChange;
    }

    updateRanges(start: Date, end: Date, changedRangeIndex: number, bindType: string): void {
        if (this._rangeIsNotEmpty([start, end])) {
            let oldBindType;

            if (bindType) {
                oldBindType = bindType;
                this._bindType = bindType;
            } else {
                oldBindType = this._bindType;
            }
            this._autoRelation(this.ranges, [start, end], changedRangeIndex);
            this.ranges = this._getUpdatedRanges(
                this.ranges,
                changedRangeIndex,
                [start, end],
                oldBindType,
                this._steps
            );
            if (oldBindType !== this._bindType && oldBindType === 'normal') {
                this._updateSteps(this.ranges);
            }
        } else {
            const newRanges = this.ranges.slice();
            newRanges[changedRangeIndex] = [start, end];
            this.ranges = newRanges;
        }
    }

    // TODO: https://online.sbis.ru/opendoc.html?guid=51df3deb-24db-42ef-9a79-f71fb367fda5
    get bindType(): string {
        return this._bindType;
    }

    set bindType(value: string) {
        this._bindType = value;
    }

    shiftForward(): void {
        this._shift(1);
    }

    shiftBackward(): void {
        this._shift(-1);
    }

    private _shift(delta: number): void {
        this.ranges = this.ranges.map((range) => {
            return Range.shiftPeriod(range[0], range[1], delta);
        });
    }

    private _autoRelation(ranges: TRange[], updatedRange: TRange, changedRangeIndex: number): void {
        const periodType = getPeriodType(updatedRange[0], updatedRange[1]);
        let oldPeriodType;
        if (this._rangeIsNotEmpty(ranges[changedRangeIndex])) {
            oldPeriodType = getPeriodType(
                ranges[changedRangeIndex][0],
                ranges[changedRangeIndex][1]
            );
        }

        if (this._periodTypeIsDay(periodType)) {
            this._bindType = 'byCapacity';
        }

        if (
            this._bindType === 'normal' &&
            (periodType === 'year' || periodType === 'years') &&
            oldPeriodType !== periodType
        ) {
            this._updateSteps([updatedRange]);
        }

        if (ranges.length > 2 || this._bindType === 'normal') {
            return;
        }

        const updatedStartValue = updatedRange[0];
        const updatedEndValue = updatedRange[1];
        const updatedPeriodType = getPeriodType(updatedStartValue, updatedEndValue);

        let capacityChanged = false;
        if (this._rangeIsNotEmpty(ranges[changedRangeIndex])) {
            capacityChanged =
                updatedPeriodType !==
                    getPeriodType(ranges[changedRangeIndex][0], ranges[changedRangeIndex][1]) &&
                this._autoRangeChange;
        }

        if (changedRangeIndex < ranges.length - 1) {
            this._updateRelation(
                updatedPeriodType,
                updatedStartValue,
                ranges[changedRangeIndex + 1][0],
                capacityChanged
            );
        }
        if (/* this._options.onlyByCapacity && */ changedRangeIndex > 0) {
            this._updateRelation(
                updatedPeriodType,
                updatedStartValue,
                ranges[changedRangeIndex - 1][0],
                capacityChanged
            );
        }
    }

    private _updateRelation(
        updatedPeriodType: string,
        updatedStartValue: Date,
        startValue: Date,
        capacityChanged: boolean
    ): void {
        let step;
        if (!startValue) {
            return;
        }

        // The linking is turned on only if we switch to year mode and this means that the offset between periods
        // is a multiple of years in any case, or if the bit width has not changed and the step between periods
        // is a multiple of years.
        if (
            updatedPeriodType === 'year' ||
            updatedPeriodType === 'years' ||
            (!capacityChanged &&
                updatedStartValue?.getFullYear() !== startValue?.getFullYear() &&
                updatedStartValue?.getMonth() === startValue?.getMonth() &&
                updatedStartValue?.getDate() === startValue?.getDate())
        ) {
            this._bindType = 'normal';

            // We update steps for calculation of the periods in other controls.
            // If the digit capacity has changed, then adjacent periods are
            // included and the step must be equal to this period.
            if (capacityChanged) {
                step = getPeriodLengthInMonthByType(updatedPeriodType);
            } else {
                step =
                    Math.abs(updatedStartValue.getFullYear() - (startValue?.getFullYear() || 0)) *
                    12;
            }
            this._resetSteps(step);
        }
    }

    private _updateSteps(dateRanges: TRange[]): void {
        this._steps = [];
        for (let i = 0; i < dateRanges.length - 1; i++) {
            const currentRange = dateRanges[i];
            const nextRange = dateRanges[i + 1];
            if (this._rangeIsNotEmpty(currentRange) && this._rangeIsNotEmpty(nextRange)) {
                this._steps[i] = this._getMonthCount(currentRange[0], nextRange[0]);
            }
        }
    }

    private _rangeIsNotEmpty(range: [Date | null, Date | null]): boolean {
        return range[0] !== null && range[1] !== null;
    }

    private _resetSteps(step: number): void {
        this._steps = [];
        for (let i = 0; i < this.ranges.length - 1; i++) {
            this._steps.push(step);
        }
    }

    private _getMonthCount(start: Date, end: Date): number {
        return (
            end.getFullYear() * 12 + end.getMonth() - start.getFullYear() * 12 - start.getMonth()
        );
    }

    protected _getChangedIndex(ranges: Date[]): number {
        for (const i in this.ranges) {
            if (
                !dateUtils.isDatesEqual(this.ranges[i][0], ranges[i][0]) ||
                !dateUtils.isDatesEqual(this.ranges[i][1], ranges[i][1])
            ) {
                return parseInt(i, 10);
            }
        }
        return -1;
    }

    private _getRangesFromOptions(options: IModel): TRange[] {
        const ranges = [];
        let i;
        let j;
        for (const field in options) {
            if (options.hasOwnProperty(field)) {
                i = null;
                if (field.indexOf('startValue') === 0) {
                    i = parseInt(field.slice(10), 10);
                    j = 0;
                } else if (field.indexOf('endValue') === 0) {
                    i = parseInt(field.slice(8), 10);
                    j = 1;
                }
                if (i !== null) {
                    if (!ranges[i]) {
                        ranges[i] = [];
                    }
                    ranges[i][j] = options[field];
                }
            }
        }
        return ranges;
    }

    private _periodTypeIsDay(periodType: string): boolean {
        return periodType === 'day' || periodType === 'days';
    }

    private _periodTypeIsYears(periodType: string): boolean {
        return periodType === 'year' || periodType === 'years';
    }

    private _getUpdatedRanges(
        ranges: TRange[],
        rangeIndex: number,
        newRange: TRange,
        bindType: string,
        steps: number[]
    ): TRange[] {
        let selectionType: SLIDE_DATE_TYPE = SLIDE_DATE_TYPE.months;
        const start = newRange[0];
        const end = newRange[1];
        const oldStart = ranges[rangeIndex][0];
        const oldEnd = ranges[rangeIndex][1];
        const respRanges = [];
        let periodLength;
        let oldPeriodLength;
        let step;
        let capacityChanged;
        let control;
        let lastDate;
        let i;

        const getStep = (value: number): number => {
            let newStep;
            if (selectionType === SLIDE_DATE_TYPE.days) {
                return periodLength;
            }
            // In the capacity mode we move the periods as adjacent.
            // In the normal mode, if the capacity has changed and the step is not a multiple of the year
            // and the month of the periods differ or step is not aligned to the new capacity,
            // then we also set adjacent periods.
            const isStepDivides = (stepLength: number): boolean => {
                return steps[value] % stepLength === 0;
            };

            const monthsAreEqual = start.getMonth() === oldStart?.getMonth();
            const monthsInYear = 12;

            if (
                (!(this._periodTypeIsDay(periodType) && this._periodTypeIsYears(oldPeriodType)) &&
                    bindType === 'byCapacity') ||
                (capacityChanged &&
                    !isStepDivides(monthsInYear) &&
                    periodLength > oldPeriodLength &&
                    (!monthsAreEqual || !isStepDivides(periodLength)))
            ) {
                newStep = periodLength;
            } else {
                newStep = steps[value] || periodLength;
            }
            return newStep;
        };

        if (!start || !end) {
            return;
        }

        const periodType = getPeriodType(start, end) || 'days';
        const oldPeriodType = oldStart && oldEnd ? getPeriodType(oldStart, oldEnd) || 'days' : null;

        if (this._periodTypeIsDay(oldPeriodType)) {
            oldPeriodLength = Range.getPeriodLengthInDays(oldStart, oldEnd);
        } else {
            oldPeriodLength = oldPeriodType
                ? Range.getPeriodLengthInMonths(oldStart, oldEnd)
                : null;
        }

        if (this._periodTypeIsDay(periodType)) {
            selectionType = SLIDE_DATE_TYPE.days;
            periodLength = Range.getPeriodLengthInDays(start, end);
        } else {
            periodLength = periodType ? Range.getPeriodLengthInMonths(start, end) : null;
        }

        if (this._periodTypeIsDay(periodType) && this._periodTypeIsDay(oldPeriodType)) {
            capacityChanged =
                periodLength !== Range.getPeriodLengthInDays(oldStart, oldEnd) &&
                this._autoRangeChange;
        } else {
            capacityChanged =
                this._getPeriodChanged(periodType, oldPeriodType, ranges, selectionType) &&
                this._autoRangeChange;
        }

        // iterate dates in the controls from the current to the first.
        let endDateStep: number;
        lastDate = start;
        step = 0;
        for (i = 1; i <= rangeIndex; i++) {
            step += getStep(rangeIndex - i);
            control = ranges[rangeIndex - i];
            if (
                bindType === 'byCapacity' &&
                !capacityChanged &&
                (lastDate > control[1] || !this._autoRangeChange)
            ) {
                respRanges[rangeIndex - i] = ranges[rangeIndex - i];
            } else if (this._autoRangeChange || capacityChanged || bindType === 'normal') {
                endDateStep =
                    selectionType === SLIDE_DATE_TYPE.years ? -step : -step + periodLength - 1;
                respRanges[rangeIndex - i] = [
                    this._slideStartDate(start, -step, selectionType),
                    this._slideEndDate(start, endDateStep, selectionType, periodLength),
                ];
            }
            lastDate = control[0];
        }

        respRanges[rangeIndex] = newRange;

        // iterate dates in the controls from the first to the current.
        lastDate = end;
        step = 0;
        for (i = 1; i < ranges.length - rangeIndex; i++) {
            step += getStep(rangeIndex + i - 1);
            control = ranges[rangeIndex + i];
            if (bindType === 'byCapacity' && !capacityChanged && lastDate < control[0]) {
                respRanges[rangeIndex + i] = ranges[rangeIndex + i];
            } else if (
                this._autoRangeChange ||
                periodType !== oldPeriodType ||
                periodLength !== oldPeriodLength ||
                bindType === 'normal'
            ) {
                if ((control[0] !== null && control[1] !== null) || bindType === 'normal') {
                    endDateStep =
                        selectionType === SLIDE_DATE_TYPE.years ? step : step + periodLength - 1;
                    respRanges[rangeIndex + i] = [
                        this._slideStartDate(start, step, selectionType),
                        this._slideEndDate(start, endDateStep, selectionType, periodLength),
                    ];
                } else {
                    respRanges[rangeIndex + i] = [control[0], control[1]];
                    capacityChanged = false;
                }
            }
            lastDate = respRanges[respRanges.length - 1][1];
        }

        if (!capacityChanged && this._isAdjacentPeriod(respRanges, periodType, oldPeriodType)) {
            capacityChanged = true;
        }

        if (capacityChanged && this._bindType === 'byCapacity') {
            this._bindType = 'normal';
        }

        return respRanges;
    }

    private _isRangesSameLength(
        ranges: Date[][],
        periodType: string,
        oldPeriodType: string
    ): boolean {
        const [firstRange, secondRange] = ranges;
        if (this._periodTypeIsDay(periodType) && this._periodTypeIsDay(oldPeriodType)) {
            return (
                Range.getPeriodLengthInDays(firstRange[0], firstRange[1]) ===
                Range.getPeriodLengthInDays(secondRange[0], secondRange[1])
            );
        } else {
            return (
                Range.getPeriodLengthInMonths(firstRange[0], firstRange[1]) ===
                Range.getPeriodLengthInMonths(secondRange[0], secondRange[1])
            );
        }
    }

    private _isAdjacentPeriod(
        ranges: Date[][],
        periodType: string,
        oldPeriodType: string
    ): boolean {
        if (ranges[0] && ranges[0][1] && ranges[1] && ranges[1][0]) {
            let startDate;
            let endDate;
            if (ranges[0][0] > ranges[1][0]) {
                startDate = ranges[1][1];
                endDate = ranges[0][0];
            } else {
                startDate = ranges[0][1];
                endDate = ranges[1][0];
            }
            const adjacentValue = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate() - 1
            );
            return (
                dateUtils.isDatesEqual(startDate, adjacentValue) &&
                this._isRangesSameLength(ranges, periodType, oldPeriodType)
            );
        }
        return false;
    }

    protected _getPeriodChanged(
        newPeriodType: string,
        oldPeriodType: string,
        oldRanges: TRange[],
        selectionType: SLIDE_DATE_TYPE
    ): boolean {
        if (newPeriodType && oldPeriodType) {
            return newPeriodType !== oldPeriodType;
        }
        let adjacentPeriodType = PLURAL_DATE[selectionType];
        if (!oldPeriodType) {
            if (oldRanges[0][0] && oldRanges[0][1]) {
                adjacentPeriodType = getPeriodType(oldRanges[0][0], oldRanges[0][1]) || 'days';
            }
            return newPeriodType !== adjacentPeriodType;
        }
        if (!newPeriodType) {
            if (oldRanges[1][0] && oldRanges[1][1]) {
                adjacentPeriodType = getPeriodType(oldRanges[1][0], oldRanges[1][1]) || 'days';
            }
            return oldPeriodType !== adjacentPeriodType;
        }
    }

    private _slideStartDate(date: Date, delta: number, selectionType: SLIDE_DATE_TYPE): Date {
        if (selectionType === SLIDE_DATE_TYPE.days) {
            // При проходе днями, смещаемся на нужное количество дней.
            return new this._dateConstructor(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + delta
            );
        } else if (selectionType === SLIDE_DATE_TYPE.years) {
            // При проходе годами смещаемся шагами кратными месяцам, но оставлем такую же дату.
            return new this._dateConstructor(
                date.getFullYear(),
                date.getMonth() + delta,
                date.getDate()
            );
        }
        // По умолчанию проходим целыми месяцами с первого по послежний день месяца.
        return new this._dateConstructor(date.getFullYear(), date.getMonth() + delta, 1);
    }

    private _slideEndDate(
        date: Date,
        delta: number,
        selectionType: SLIDE_DATE_TYPE,
        periodLength: number
    ): Date {
        if (selectionType === SLIDE_DATE_TYPE.days) {
            return new this._dateConstructor(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + delta
            );
        } else if (selectionType === SLIDE_DATE_TYPE.years) {
            return new this._dateConstructor(
                date.getFullYear(),
                date.getMonth() + delta,
                date.getDate() + periodLength - 1
            );
        }
        return new this._dateConstructor(date.getFullYear(), date.getMonth() + delta + 1, 0);
    }
}

export default ModuleClass;
