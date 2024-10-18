/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { TColumnDataDensity, RenderUtils } from 'Controls-Lists/dynamicGrid';
import { date as formatDate } from 'Types/formatter';
import { IHeaderConfig, ICellProps } from 'Controls/gridReact';
import { PeriodTypes, period as dateRangeFormatter } from 'Types/formatter';

import { Quantum } from 'Controls-Lists/_timelineGrid/utils';
import {
    HolidayConnectedComponent,
    useWeekendDate,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
import { Base as DateUtils } from 'Controls/dateUtils';
import { HOURS_COUNT, MONTHS_COUNT } from 'Controls-Lists/_timelineGrid/constants';

function HeaderDateComponent(props: {
    quantum: Quantum;
    dataDensity: TColumnDataDensity;
    renderValues?: { date?: Date };
}) {
    const { quantum, dataDensity, renderValues, isNeedOpacity } = props;
    const date = RenderUtils.correctServerSideDateForRender(renderValues.date);
    let mask = '';
    switch (quantum) {
        case Quantum.Second:
            mask = ':ss';
            break;
        case Quantum.Minute:
        case Quantum.Hour:
            mask = 'HH:mm';
            break;
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
    }

    const shouldRenderHoliday = quantum === Quantum.Day;

    // before и after занят вертикальным бордером по ховеру
    const shouldRenderHoverElement = quantum === 'day' && dataDensity !== 'advanced';

    const isWeekend = useWeekendDate(date);
    const fontColorStyle = isWeekend && quantum !== Quantum.Month ? 'primary' : 'secondary';
    let content;
    if (quantum === Quantum.Minute || quantum === Quantum.Hour) {
        content = (
            <>
                <span
                    className={`ControlsLists-timelineGrid__headerCellContent_hours controls-text-${fontColorStyle}`}
                >
                    {formatDate(date, 'HH')}
                </span>
                <span
                    className={`ControlsLists-timelineGrid__headerCellContent_minutes controls-text-${fontColorStyle}`}
                >
                    {formatDate(date, ':mm')}
                </span>
            </>
        );
    } else {
        content = (
            <span className={`controls-text-${fontColorStyle}`}>{formatDate(date, mask)}</span>
        );
    }
    return (
        <>
            <div
                className={
                    'ControlsLists-timelineGrid__headerCellContent ControlsLists-dynamicGrid__cross-vertical-part' +
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

function SuperHeaderDateComponent(props: { quantum: Quantum; renderValues?: { date?: Date } }) {
    let caption = '';
    const date = props.renderValues.date;
    switch (props.quantum) {
        case Quantum.Month: {
            caption = formatDate(date, 'YYYY');
            break;
        }
        case Quantum.Day: {
            caption = formatDate(date, "MMMM'YY");
            break;
        }
        default: {
            caption = formatDate(date, "D MMMl'YY");
            break;
        }
    }
    return <div className={'tw-truncate'}>{caption}</div>;
}

// Возвращает параметры для ячейки шапки динамической колонки.
export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    dataDensity: TColumnDataDensity,
    isAdaptive: boolean
) {
    let superHeaders;
    if (isAdaptive) {
        superHeaders = [
            {
                key: 'Super',
                colspanCallback: (date) => {
                    switch (quantum) {
                        case Quantum.Month: {
                            const month = date.getMonth();
                            return MONTHS_COUNT - month + 1;
                        }
                        case Quantum.Day: {
                            const day = date.getDate();
                            const endOfMonthDay = DateUtils.getEndOfMonth(date).getDate();
                            return endOfMonthDay - day + 1;
                        }
                        case Quantum.Hour: {
                            const day = date.getDate();
                            return HOURS_COUNT - day + 1;
                        }
                    }
                },
                getCellProps: () => {
                    return {
                        halign: 'left',
                        fontSize: 'xs',
                        baseline: '4xl',
                        textOverflow: 'ellipsis',
                        valign: 'baseline',
                        fontColorStyle: 'default',
                        className: 'ControlsLists-timelineGrid__dynamicHeaderCell_SuperHeader_cell',
                    };
                },
                render: <SuperHeaderDateComponent quantum={quantum} dataDensity={dataDensity} />,
            },
        ];
    }

    return {
        render: <HeaderDateComponent quantum={quantum} dataDensity={dataDensity} />,
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
    };
}
