/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 *
 * Предоставляет кнопку увеличения размерности сетки
 * Она позволяет сменить режим, увеличив размерность сетки
 * Режим День меняется на режим Месяц с выводом Недели. Неделя меняется на режим Месяц с выводом всех его дней.
 * Месяц меняется на режим Год. В режиме год кнопка не выводится.
 */
import * as React from 'react';

import { Button } from 'Controls/buttons';
import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { DAYS_IN_WEEK } from 'Controls-Lists/_timelineGrid/constants';

import rk = require('i18n!Controls-Lists');

interface IGoUpRangeButtonProps {
    range: IRange;
    weekSize: number;
    availableRanges: Record<string, number[]>;
    setRange: (range: IRange) => void;
    visible: boolean;
    weekRangeAvailable?: boolean;
}

type TParentRange = 'week' | 'month' | 'year';

/**
 * Получить следующий отображаемый период
 * @param range Текущий период
 * @param availableRangesByWidth Доступные диапазоны
 * @param availableRanges Доступные диапазоны, расчитанные на основе ширины вьюпорта и ширины ячеек.
 * @param weekSize Количество дней в неделе
 * @param weekRangeAvailable Доступно ли отображение периода Неделя
 */
// TODO свести с getNextRangePreset
function getParentRange(
    range: IRange,
    availableRangesByWidth?: Record<string, number[]>,
    availableRanges?: Record<string, number[]>,
    weekSize?: number,
    weekRangeAvailable?: boolean
): TParentRange {
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);
    const canGoToDays = availableRanges?.days?.[availableRanges?.days.length - 1] > 1;
    let weekDaysCount = weekSize || DAYS_IN_WEEK;

    const isSelectedMonth =
        BaseDateUtils.isStartOfMonth(range.start) && BaseDateUtils.isEndOfMonth(range.end);
    let monthDaysCount = new Date(
        range.start.getFullYear(),
        range.start.getMonth() + 1,
        0
    ).getDate();
    if (weekDaysCount !== DAYS_IN_WEEK) {
        monthDaysCount -= 4;
    }
    if (availableRangesByWidth) {
        // При маленькой ширине, в выбранном месяце будет отображаться меньше дней, чем в полном месяце.
        // Следующим более крупным масштабом будет уже год.
        const maxDaysCount = availableRangesByWidth.days?.[availableRangesByWidth.days.length - 1];
        monthDaysCount = Math.min(maxDaysCount, monthDaysCount);
        weekDaysCount = Math.min(maxDaysCount, weekDaysCount);
    }
    if (rangeSizeInDays < weekDaysCount && weekRangeAvailable !== false) {
        return 'week';
    }
    if (isSelectedMonth || rangeSizeInDays >= monthDaysCount || !canGoToDays) {
        return 'year';
    }

    return 'month';
}

/**
 * Получить всплывающую подсказку
 * @param parentRange Следующий период
 */
function getTooltip(parentRange: TParentRange): string {
    let parentRangeName;
    switch (parentRange) {
        case 'week':
            parentRangeName = 'Неделя';
            break;
        case 'month':
            parentRangeName = 'Месяц';
            break;
        case 'year':
            parentRangeName = 'Год';
            break;
    }
    return `В режим "${parentRangeName}"`;
}

/**
 * Получить увеличенный период
 * @param currentRange Текущий период
 * @param parentRange Следующий период
 */
function getUpRange(currentRange: IRange, parentRange: TParentRange): IRange {
    let upRange: IRange;
    switch (parentRange) {
        case 'week':
            upRange = {
                start: BaseDateUtils.getStartOfWeek(currentRange.start),
                end: BaseDateUtils.getEndOfWeek(currentRange.start),
            };
            upRange.start.setHours(0, 0, 0);
            upRange.end.setHours(0, 0, 0);
            break;
        case 'month':
            upRange = {
                start: BaseDateUtils.getStartOfMonth(currentRange.start),
                end: BaseDateUtils.getEndOfMonth(currentRange.start),
            };
            break;
        case 'year':
            upRange = {
                start: BaseDateUtils.getStartOfYear(currentRange.start),
                end: BaseDateUtils.getEndOfYear(currentRange.start),
            };
            break;
    }
    return upRange;
}

/**
 * Кнопка увеличения размерности сетки
 */
export default function GoUpRangeButton(props: IGoUpRangeButtonProps) {
    const {
        range,
        availableRangesByWidth,
        availableRanges,
        setRange,
        weekSize,
        visible,
        weekRangeAvailable,
    } = props;

    const parentRange = getParentRange(
        range,
        availableRangesByWidth,
        availableRanges,
        weekSize,
        weekRangeAvailable
    );
    const tooltip = rk(getTooltip(parentRange));

    const onClick = React.useCallback(() => {
        const upRange = getUpRange(range, parentRange);
        setRange(upRange);
    }, [range, setRange, parentRange]);

    return (
        <Button
            icon="icon-Undo2"
            iconStyle="secondary"
            viewMode="link"
            onClick={onClick}
            customEvents={['onClick']}
            tooltip={tooltip}
            iconSize={'s'}
            inlineHeight={'mt'}
            readOnly={!visible}
            data-qa="Controls-Lists_timelineGrid__GoUpRangeButton"
            className={!visible ? 'tw-invisible' : ''}
        />
    );
}
