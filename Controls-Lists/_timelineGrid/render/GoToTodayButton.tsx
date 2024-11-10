/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as rk from 'i18n!Controls';
import { Base as DateUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    getQuantum,
    getRangeSize,
    Quantum,
    shiftDate,
    IQuantum,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    START_DAY_HOUR,
    END_DAY_HOUR,
    DAYS_IN_WEEK,
    QUARTER,
    MONTHS_COUNT,
} from 'Controls-Lists/_timelineGrid/constants';

interface IProps {
    range: IRange;
    setRange: (range: IRange) => void;
    fixedDate?: Date;
    quantums: IQuantum[];
}

export function getTodayRange(
    currentRange: IRange,
    quantums: IQuantum[],
    fixedDate?: Date
): IRange {
    const quantum = getQuantum(currentRange, quantums, 1);
    const today = fixedDate ? new Date(fixedDate) : new Date();
    today.setHours(0, 0, 0, 0);

    const rangeSize = getRangeSize(currentRange, quantum);
    if (quantum === Quantum.Hour) {
        const startDate = new Date(today);
        startDate.setHours(START_DAY_HOUR);
        const endDate = new Date(today);
        endDate.setHours(END_DAY_HOUR);
        return {
            needScroll: true,
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
            rangeSize === MONTHS_COUNT;
        if (isSelectedYear) {
            return {
                start: DateUtils.getStartOfYear(today),
                end: DateUtils.getEndOfYear(today),
            };
        }

        const isSelectedHalfYear =
            DateUtils.isStartOfHalfyear(currentRange.start) &&
            DateUtils.isEndOfHalfyear(currentRange.end) &&
            rangeSize === MONTHS_COUNT / 2;
        if (isSelectedHalfYear) {
            return {
                start: DateUtils.getStartOfHalfyear(today),
                end: DateUtils.getEndOfHalfyear(today),
            };
        }

        const isSelectedQuarter =
            DateUtils.isStartOfQuarter(currentRange.start) &&
            DateUtils.isEndOfQuarter(currentRange.end) &&
            rangeSize === QUARTER;
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

const WRAPPER_CLASS_NAME =
    'ControlsLists-timelineGrid__GoToTodayButton_wrapper tw-flex tw-items-center tw-justify-center';
const CLASS_NAME =
    'ControlsLists-timelineGrid__GoToTodayButton controls-text-secondary controls-fontsize-l tw-cursor-pointer';
export default function GoToTodayButton(props: IProps) {
    const { range, setRange, fixedDate, quantums } = props;
    const onClick = () => {
        const newRange = getTodayRange(range, quantums, fixedDate);
        setRange(newRange);
    };

    const currentDate = props.fixedDate ? props.fixedDate.getDate() : new Date().getDate();

    return (
        <div className={WRAPPER_CLASS_NAME}>
            <div
                className={CLASS_NAME}
                data-qa="Controls-Lists_timelineGrid__GoToTodayButton"
                onClick={onClick}
                title={rk('Текущий период')}
            >
                {currentDate}
            </div>
        </div>
    );
}
