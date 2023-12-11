import * as rk from 'i18n!Controls';
import { Base as DateUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import { getQuantum, getRangeSize, Quantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import { START_DAY_HOUR, END_DAY_HOUR, DAYS_IN_WEEK } from 'Controls-Lists/_timelineGrid/constants';

interface IProps {
    range: IRange;
    setRange: (range: IRange) => void;
    fixedDate?: Date;
}

export function getTodayRange(currentRange: IRange, fixedDate?: Date): IRange {
    const quantum = getQuantum(currentRange);
    const today = fixedDate ? fixedDate : new Date();
    today.setHours(0, 0, 0);

    const rangeSize = getRangeSize(currentRange, quantum);
    if (quantum === Quantum.Hour) {
        const startDate = new Date(today);
        startDate.setHours(START_DAY_HOUR);
        const endDate = new Date(today);
        endDate.setHours(END_DAY_HOUR);
        return {
            start: startDate,
            end: endDate,
        };
    }

    // Сохраняем выбранным НЕДЕЛЮ или МЕСЯЦ
    if (quantum === Quantum.Day) {
        if (rangeSize === DAYS_IN_WEEK) {
            return {
                start: DateUtils.getStartOfWeek(today),
                end: DateUtils.getEndOfWeek(today),
            };
        }

        const isSelectedMonth =
            DateUtils.isStartOfMonth(currentRange.start) &&
            DateUtils.isEndOfMonth(currentRange.end);
        if (isSelectedMonth) {
            return {
                start: DateUtils.getStartOfMonth(today),
                end: DateUtils.getEndOfMonth(today),
            };
        }
    }

    // Сохраняем выбранным КВАРТАЛ или ПОЛУГОДИЕ или ГОД
    if (quantum === Quantum.Month) {
        const isSelectedYear =
            DateUtils.isStartOfYear(currentRange.start) && DateUtils.isEndOfYear(currentRange.end);
        if (isSelectedYear) {
            return {
                start: DateUtils.getStartOfYear(today),
                end: DateUtils.getEndOfYear(today),
            };
        }

        const isSelectedHalfYear =
            DateUtils.isStartOfHalfyear(currentRange.start) &&
            DateUtils.isEndOfHalfyear(currentRange.end);
        if (isSelectedHalfYear) {
            return {
                start: DateUtils.getStartOfHalfyear(today),
                end: DateUtils.getEndOfHalfyear(today),
            };
        }

        const isSelectedQuarter =
            DateUtils.isStartOfQuarter(currentRange.start) &&
            DateUtils.isEndOfQuarter(currentRange.end);
        if (isSelectedQuarter) {
            return {
                start: DateUtils.getStartOfQuarter(today),
                end: DateUtils.getEndOfQuarter(today),
            };
        }
    }

    // В режиме по месяцу диапазон должен начинаться с первого дня месяца
    if (quantum === Quantum.Month) {
        today.setDate(1);
    }

    // Не был выбран какой-то определенный период, поэтому просто от текущего дня считаем диапазон такого же размера
    const endDate = new Date(today);
    shiftDate(endDate, 'forward', quantum, rangeSize);
    return {
        start: new Date(today),
        end: endDate,
    };
}

const CLASS_NAME =
    'ControlsLists-timelineGrid__GoToTodayButton controls-text-secondary controls-fontsize-l tw-cursor-pointer';
export default function GoToTodayButton(props: IProps) {
    const { range, setRange, fixedDate } = props;
    const onClick = () => {
        const newRange = getTodayRange(range, fixedDate);
        setRange(newRange);
    };

    const currentDate = props.fixedDate ? props.fixedDate.getDate() : new Date().getDate();

    return (
        <div
            className={CLASS_NAME}
            data-qa="Controls-Lists_timelineGrid__GoToTodayButton"
            onClick={onClick}
            title={rk('Текущий период')}
        >
            {currentDate}
        </div>
    );
}
