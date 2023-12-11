import { TColumnDataDensity } from 'Controls-Lists/dynamicGrid';
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
    const {
        quantum,
        dataDensity,
        renderValues: { date },
    } = props;

    let mask = '';
    switch (quantum) {
        case Quantum.Hour:
            mask = 'HH:mm';
            break;
        case Quantum.Day:
            if (dataDensity === 'advanced') {
                mask = 'D, ddl';
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
    const content = (
        <span className={`controls-text-${fontColorStyle}`}>{formatDate(date, mask)}</span>
    );
    return (
        <>
            <div
                className={
                    'ControlsLists-timelineGrid__headerCellContent tw-flex tw-items-center tw-w-full tw-h-full tw-justify-center'
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

export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    dataDensity: TColumnDataDensity
): IHeaderConfig {
    return {
        render: <HeaderDateComponent quantum={quantum} dataDensity={dataDensity} />,
        getCellProps: (): ICellProps => {
            // Отступы отключаются, чтобы они не суммировались с отступами внутренних ячеек
            return {
                padding: {
                    left: 'null',
                    right: 'null',
                },
                fontSize: 'm',
                className: 'ControlsLists-timelineGrid__dynamicHeaderCell',
            };
        },
        ...dynamicHeader,
    };
}
