import * as React from 'react';

import { TColumnDataDensity } from 'Controls-Lists/dynamicGrid';
import { date as formatDate } from 'Types/formatter';
import { IHeaderConfig, ICellProps } from 'Controls/gridReact';
import { InfoboxTarget } from 'Controls/popup';

import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

export interface IHolidayData {
    caption: string;
    description?: string;
}
export type TIsHolidayCallback = (date: Date) => boolean | IHolidayData;

function HolidayComponent(props: {holiday: IHolidayData}) {
    const popupTemplate = (
        <>
            <div className={'controls-fontsize-m ws-ellipsis'}>{props.holiday.caption}</div>
            {props.holiday.description && (
                <div className={'controls-fontsize-xs controls-text-label ws-ellipsis'}>
                    {props.holiday.description}
                </div>
            )}
        </>
    );

    return (
        <InfoboxTarget template={popupTemplate} alignment={'center'} targetSide={'bottom'}>
            <div className={'ControlsLists-timelineGrid__HolidayIndicator'}/>
        </InfoboxTarget>
    );
}

function HeaderDateComponent(props: {
    quantum: Quantum;
    dataDensity: TColumnDataDensity;
    renderValues?: { date?: Date };
    isHolidayCallback: TIsHolidayCallback;
}) {
    const {
        quantum,
        dataDensity,
        renderValues: { date },
        isHolidayCallback,
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

    const holiday = isHolidayCallback?.(date);
    const shouldRenderHoliday = typeof holiday === 'object' && quantum === Quantum.Day;

    // before и after занят вертикальным бордером по ховеру
    const shouldRenderHoverElement = quantum === 'day' && dataDensity !== 'advanced';

    const fontColorStyle = !!holiday && quantum !== Quantum.Month ? 'danger' : 'secondary';
    return (
        <>
            <div className={'ControlsLists-timelineGrid__headerCellContent tw-flex tw-items-center tw-w-full tw-h-full tw-justify-center'}>
                <span className={`controls-text-${fontColorStyle}`}>
                    {formatDate(date, mask)}
                </span>
                {shouldRenderHoliday && <HolidayComponent holiday={holiday}/>}
            </div>
            {shouldRenderHoverElement && <div className="ControlsLists-timelineGrid__headerCell__hoverElement"/>}
        </>
    );
}

export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    isHolidayCallback: TIsHolidayCallback,
    dataDensity: TColumnDataDensity
): IHeaderConfig {
    return {
        render: (
            <HeaderDateComponent
                quantum={quantum}
                dataDensity={dataDensity}
                isHolidayCallback={isHolidayCallback}
            />
        ),
        getCellProps: (): ICellProps => {
            // Отступы отключаются, чтобы они не суммировались с отступами внутренних ячеек
            return {
                padding: {
                    left: 'null',
                    right: 'null',
                },
                fontSize: 'm',
            };
        },
        ...dynamicHeader,
    };
}
