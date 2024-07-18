/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TColumnDataDensity, RenderUtils } from 'Controls-Lists/dynamicGrid';
import { date as formatDate } from 'Types/formatter';
import { IHeaderConfig, ICellProps } from 'Controls/gridReact';

import { Quantum } from 'Controls-Lists/_timelineGrid/utils';
import {
    HolidayConnectedComponent,
    useWeekendDate,
} from 'Controls-Lists/_timelineGrid/render/Holidays';

function HeaderDateComponent(props: {
    quantum: Quantum;
    dataDensity: TColumnDataDensity;
    renderValues?: { date?: Date };
}) {
    const { quantum, dataDensity, renderValues } = props;
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
                    ' tw-flex tw-items-center tw-w-full tw-h-full tw-justify-center'
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

// Возвращает параметры для ячейки шапки динамической колонки.
export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    dataDensity: TColumnDataDensity
) {
    return {
        render: <HeaderDateComponent quantum={quantum} dataDensity={dataDensity} />,
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
