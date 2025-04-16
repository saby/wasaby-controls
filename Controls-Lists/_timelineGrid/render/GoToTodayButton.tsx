/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */

import { Base as DateUtils } from 'Controls/dateUtils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    getQuantum,
    getRangeSize,
    isQuantumLessThanDay,
    Quantum,
    shiftDate,
    ICustomRange,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    START_DAY_HOUR,
    END_DAY_HOUR,
    DAYS_IN_WEEK,
    MONTHS_IN_QUARTER,
    MONTHS_IN_YEAR,
} from 'Controls-Lists/_timelineGrid/constants';
import { TodayButton } from 'Controls-Lists/dynamicGrid';
import { TQuantsReplacementMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

interface IProps {
    range: IRange;
    setRange: (range: IRange) => void;
    fixedDate?: Date;
    quantsReplacementMap: TQuantsReplacementMap;
    customRanges?: ICustomRange[];
}

export function getTodayRange(
    currentRange: IRange,
    quantsReplacementMap?: TQuantsReplacementMap,
    fixedDate?: Date,
    customRanges?: ICustomRange[]
): IRange {
    const quantum = getQuantum(currentRange, quantsReplacementMap);
    const today = fixedDate ? new Date(fixedDate) : new Date();
    const currentHours = new Date().getHours();
    today.setHours(0, 0, 0, 0);

    const rangeSize = getRangeSize(currentRange, quantum, customRanges);

    if (customRanges && quantum === 'hour') {
        for (let i = 0; i < rangeSize; i++) {
            if (today.getHours() <= customRanges[i].start) {
                today.setHours(customRanges[i].start);
                break;
            }
        }
    }

    // В режиме с квантами меньше дня делаем подскролл к текущему времени.
    // Кроме ситуации, когда выбран квант "часы" с пользовательскими заголовками
    if (isQuantumLessThanDay(quantum) && !(quantum === 'hour' && customRanges)) {
        const startDate = new Date(today);
        startDate.setHours(START_DAY_HOUR + currentHours);
        const endDate = new Date(today);
        endDate.setHours(END_DAY_HOUR + currentHours);
        return {
            start: startDate,
            end: endDate,
        };
    }

    // Сохраняем выбранным НЕДЕЛЮ или МЕСЯЦ
    if (quantum === Quantum.Day) {
        if (rangeSize === DAYS_IN_WEEK) {
            // Если выбрана визуализация НЕДЕЛЯ и первый день - ПН, то скроллим к пн.
            if (
                DateUtils.isDaysEqual(
                    currentRange.start,
                    DateUtils.getStartOfWeek(currentRange.start)
                )
            ) {
                return {
                    start: DateUtils.getStartOfWeek(today),
                    end: DateUtils.getEndOfWeek(today),
                };
            } else {
                const end = new Date(today);
                shiftDate(end, 'forward', quantum, rangeSize - 1);
                return {
                    start: new Date(today),
                    end,
                };
            }
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
            DateUtils.isStartOfYear(currentRange.start) &&
            DateUtils.isEndOfYear(currentRange.end) &&
            rangeSize === MONTHS_IN_YEAR;
        if (isSelectedYear) {
            return {
                start: DateUtils.getStartOfYear(today),
                end: DateUtils.getEndOfYear(today),
            };
        }

        const isSelectedHalfYear =
            DateUtils.isStartOfHalfyear(currentRange.start) &&
            DateUtils.isEndOfHalfyear(currentRange.end) &&
            rangeSize === MONTHS_IN_YEAR / 2;
        if (isSelectedHalfYear) {
            return {
                start: DateUtils.getStartOfHalfyear(today),
                end: DateUtils.getEndOfHalfyear(today),
            };
        }

        const isSelectedQuarter =
            DateUtils.isStartOfQuarter(currentRange.start) &&
            DateUtils.isEndOfQuarter(currentRange.end) &&
            rangeSize === MONTHS_IN_QUARTER;
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
    const startDate = new Date(today);
    const endDate = new Date(startDate);
    shiftDate(endDate, 'forward', quantum, rangeSize, customRanges);
    return {
        start: startDate,
        end: endDate,
    };
}

export default function GoToTodayButton(props: IProps) {
    const { range, setRange, fixedDate, quantsReplacementMap, customRanges } = props;
    const onClick = () => {
        const newRange = getTodayRange(range, quantsReplacementMap, fixedDate, customRanges);
        setRange(newRange);
    };

    const currentDate = props.fixedDate ? props.fixedDate.getDate() : new Date().getDate();

    return (
        <TodayButton
            currentDate={currentDate}
            onClick={onClick}
            dataQa={'Controls-Lists_timelineGrid__GoToTodayButton'}
        />
    );
}
