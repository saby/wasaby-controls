/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import {
    DYNAMIC_GRID_CELL_STICKIED_Z_INDEX,
    RenderUtils,
    TColumnDataDensity,
} from 'Controls-Lists/dynamicGrid';
import { date as formatDate } from 'Types/formatter';
import { ICellProps, IHeaderConfig } from 'Controls/gridRender';

import {
    DayRange,
    IQuantum,
    isQuantumLessThanDay,
    isRangeAvailable,
    Quantum,
    getCustomRanges,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    HolidayConnectedComponent,
    useWeekendDate,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
import { Base as DateUtils } from 'Controls/dateUtils';
import { DAYS_IN_WEEK, HOURS_IN_DAY, MONTHS_IN_YEAR } from 'Controls-Lists/_timelineGrid/constants';

function HourRender({
    date,
    fontColorStyle,
}: {
    date: Date;
    fontColorStyle: string;
}): React.ReactElement {
    return (
        <span
            className={`ControlsLists-timelineGrid__headerCellContent_hours controls-text-${fontColorStyle}`}
        >
            {formatDate(date, 'HH')}
        </span>
    );
}

function MinutesRender({
    date,
    fontColorStyle,
}: {
    date: Date;
    fontColorStyle: string;
}): React.ReactElement {
    return (
        <span
            className={`ControlsLists-timelineGrid__headerCellContent_minutes controls-text-${fontColorStyle}`}
        >
            {formatDate(date, 'mm')}
        </span>
    );
}

function TimeRender({
    startDate,
    className,
    endDate,
}: {
    startDate: Date;
    className: string;
    endDate?: Date;
}): React.ReactElement {
    const isWeekend = useWeekendDate(startDate);
    let hoursFontColorStyle;
    let minutesFontColorStyle;
    if (isWeekend) {
        hoursFontColorStyle = minutesFontColorStyle = 'primary';
    } else {
        hoursFontColorStyle = 'default';
        minutesFontColorStyle = 'unaccented';
    }
    return (
        <div className={className}>
            <span className="ControlsLists-timelineGrid__headerCellContent_date tw-flex">
                <HourRender date={startDate} fontColorStyle={hoursFontColorStyle} />
                <MinutesRender date={startDate} fontColorStyle={minutesFontColorStyle} />
            </span>
            {endDate ? (
                <>
                    <span>{' - '}</span>
                    <span className="ControlsLists-timelineGrid__headerCellContent_date tw-flex">
                        <HourRender date={endDate} fontColorStyle={hoursFontColorStyle} />
                        <MinutesRender date={endDate} fontColorStyle={minutesFontColorStyle} />
                    </span>
                </>
            ) : null}
        </div>
    );
}

function DateRender({
    startDate,
    endDate,
    quantum,
    dataDensity,
    className,
}: {
    startDate: Date;
    endDate?: Date;
    quantum: Quantum;
    dataDensity: TColumnDataDensity;
    className: string;
}): React.ReactElement {
    let mask = '';
    switch (quantum) {
        case Quantum.Second:
            mask = ':ss';
            break;
        case Quantum.Week:
        case Quantum.Day:
            if (dataDensity === 'advanced') {
                mask = 'D ddl';
            } else {
                mask = 'D';
            }
            break;
        case Quantum.Month:
            mask = 'MMMl';
            break;
        case Quantum.HalfYear:
            mask = 'YYhr';
            break;
        case Quantum.Quarter:
            mask = 'QQr';
            break;
        case Quantum.Year:
            mask = 'YYYY';
            break;
    }
    const isWeekend = useWeekendDate(startDate);
    const considerWeekends =
        quantum !== Quantum.Week &&
        quantum !== Quantum.Month &&
        quantum !== Quantum.Quarter &&
        quantum !== Quantum.HalfYear &&
        quantum !== Quantum.Year;
    const showEndDate = endDate && quantum === Quantum.Week;
    const fontColorStyle = considerWeekends && isWeekend ? 'primary' : 'default';
    return (
        <div className={className}>
            <span
                className={`ControlsLists-timelineGrid__headerCellContent_date controls-text-${fontColorStyle}`}
            >
                {formatDate(startDate, mask) +
                    (showEndDate ? ' - ' + formatDate(endDate, mask) : '')}
            </span>
        </div>
    );
}

function HeaderDateComponent(props: {
    quantum: Quantum;
    quantums: IQuantum[];
    dataDensity: TColumnDataDensity;
    renderValues?: { date?: Date };
    weekRangeAvailable?: boolean | undefined;
}) {
    const { quantum, dataDensity, renderValues, isNeedOpacity, weekRangeAvailable, quantums } =
        props;
    const date = RenderUtils.correctServerSideDateForRender(renderValues.date);

    const shouldRenderHoliday = quantum === Quantum.Day;

    // before и after занят вертикальным бордером по ховеру
    const shouldRenderHoverElement =
        quantum === 'day' && dataDensity !== 'advanced' && weekRangeAvailable !== false;

    const contentClassName =
        'ControlsLists-timelineGrid__headerCellContent_baseline' +
        ' tw-items-baseline tw-inline-flex tw-w-full tw-justify-center';
    let endDate;
    if (quantum === Quantum.Hour) {
        const customRanges = getCustomRanges(quantums);
        const range = customRanges?.find((customRange) => {
            return customRange.start === date.getHours();
        });
        if (range) {
            endDate = new Date(date);
            endDate.setHours(range.end);
        }
    } else if (quantum === Quantum.Week) {
        endDate = new Date(date);
        endDate.setDate(endDate.getDate() + DAYS_IN_WEEK - 1);
    }
    const content =
        quantum !== Quantum.Second && isQuantumLessThanDay(quantum) ? (
            <TimeRender startDate={date} endDate={endDate} className={contentClassName} />
        ) : (
            <DateRender
                startDate={date}
                endDate={endDate}
                quantum={quantum}
                dataDensity={dataDensity}
                className={contentClassName}
            />
        );

    return (
        <>
            <div
                className={
                    'ControlsLists-timelineGrid__headerCellContent' +
                    ' tw-flex tw-items-center tw-w-full tw-h-full tw-justify-center ' +
                    (isNeedOpacity ? 'ControlsLists-timelineGrid__headerCellContent_opacity ' : ' ')
                }
            >
                {shouldRenderHoliday ? (
                    <HolidayConnectedComponent
                        date={date}
                        view={'circle'}
                        className={'ControlsLists-timelineGrid__HolidayIndicator_inHeader'}
                    >
                        {content}
                    </HolidayConnectedComponent>
                ) : (
                    content
                )}
            </div>
            {shouldRenderHoverElement && (
                <div className="ControlsLists-timelineGrid__headerCell__hoverWeekElement" />
            )}
        </>
    );
}

function SuperHeaderDateComponent() {
    return <div className={'ControlsLists-timelineGrid__headerCellContent_baseline'} />;
}

// Возвращает параметры для ячейки шапки динамической колонки.
export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    dataDensity: TColumnDataDensity,
    isAdaptive: boolean,
    quantums: IQuantum[]
) {
    let superHeaders;
    const weekRangeAvailable = isRangeAvailable(Quantum.Day, quantums, DayRange.Week, 'all');
    if (isAdaptive) {
        superHeaders = [
            {
                key: 'Super',
                colspanCallback: (date) => {
                    switch (quantum) {
                        case Quantum.Month: {
                            const month = date.getMonth();
                            return MONTHS_IN_YEAR - month;
                        }
                        case Quantum.Day: {
                            const day = date.getDate();
                            const endOfMonthDay = DateUtils.getEndOfMonth(date).getDate();
                            return endOfMonthDay - day + 1;
                        }
                        case Quantum.Hour: {
                            const hour = date.getHours();
                            return HOURS_IN_DAY - hour;
                        }
                    }
                },
                getCellProps: (item) => {
                    const superResult = dynamicHeader?.getCellProps?.(item) || {};
                    return {
                        ...superResult,
                        halign: 'left',
                        fontSize: 'xs',
                        baseline: '3xl',
                        textOverflow: 'ellipsis',
                        valign: 'baseline',
                        fontColorStyle: 'default',
                        className: 'ControlsLists-timelineGrid__dynamicHeaderCell_SuperHeader_cell',
                    };
                },
                render: <SuperHeaderDateComponent />,
            },
        ];
    }

    return {
        render: (
            <HeaderDateComponent
                quantum={quantum}
                dataDensity={dataDensity}
                weekRangeAvailable={weekRangeAvailable}
                quantums={quantums}
            />
        ),
        superHeaders,
        ...dynamicHeader,
        getCellProps: (item) => {
            const superResult = dynamicHeader?.getCellProps?.(item) || {};
            return {
                cursor: 'default',
                ...superResult,
            };
        },
    };
}

// Возвращает параметры для основной колонки, внутри которой рендерятся ячейки шапки динамических колонок.
export function getDynamicColumnHeaderProps(): ICellProps {
    // Отступы отключаются, чтобы они не суммировались с отступами внутренних ячеек
    return {
        padding: {
            left: 'null',
            right: 'null',
        },
        fontSize: 'm',
        className: 'ControlsLists-timelineGrid__dynamicHeaderCell',
        fixedZIndex: DYNAMIC_GRID_CELL_STICKIED_Z_INDEX,
    };
}
