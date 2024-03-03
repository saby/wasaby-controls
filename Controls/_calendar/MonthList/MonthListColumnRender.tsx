/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { useItemData, useItemState } from 'Controls/gridReact';
import MarkerComponent from 'Controls/markerComponent';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { Record } from 'Types/entity';
import ExtDataModel from './ExtDataModel';
import MonthListItem from './MonthListItem';
import MonthListItemTemplate from './MonthListItemTemplate';
import ITEM_TYPES from './ItemTypes';

interface IMonthListColumnRenderProps extends TInternalProps, IControlProps {
    extData: ExtDataModel;
    itemTemplate: React.ReactElement;
    itemHeaderTemplate: React.ReactElement;
    formatMonth: Function;
    getMonth: Function;
    dateToDataString: Function;
    stubTemplate: React.ReactElement;
    dayHeaderTemplate: React.ReactElement;
    dayTemplate: React.ReactElement;
    monthTemplate: React.ReactElement;
    monthProps: object;
    startValue: Date;
    endValue: Date;
    newMode: boolean;
    hasStartOrEndValue: boolean;
    viewMode: unknown;
}

function getTemplate(item: Record, props: IMonthListColumnRenderProps): React.ReactElement {
    switch (item.get('type')) {
        case ITEM_TYPES.header:
            return props.itemHeaderTemplate;
        case ITEM_TYPES.stub:
            return props.stubTemplate;
        default:
            return props.itemTemplate;
    }
}

export default function MonthListColumnRender(
    props: IMonthListColumnRenderProps
): React.ReactElement {
    const { item } = useItemData([]);
    const { marked } = useItemState(['marked']);

    if (props.hasStartOrEndValue) {
        return (
            <MonthListItem
                className="controls-MonthList__item"
                itemHeaderTemplate={props.itemHeaderTemplate}
                stubTemplate={props.stubTemplate}
                startValue={props.startValue}
                endValue={props.endValue}
                itemTemplate={props.itemTemplate}
                item={item}
                extData={props.extData}
                monthTemplate={props.monthTemplate}
                monthProps={props.monthProps}
                dayTemplate={props.dayTemplate}
                dayHeaderTemplate={props.dayHeaderTemplate}
                newMode={props.newMode}
                viewMode={props.viewMode}
            />
        );
    } else {
        return (
            <>
                {marked && (
                    <MarkerComponent
                        markerSize="content-xs"
                        className="controls-MonthList__marker"
                    />
                )}
                <MonthListItemTemplate
                    className="controls-MonthList__item"
                    item={item}
                    itemTemplate={getTemplate(item, props)}
                    extData={props.extData.getData(item.get('id'))}
                    holidaysData={props.extData.getHolidaysData(item.get('id'))}
                    _formatMonth={props.formatMonth}
                    _getMonth={props.getMonth}
                    _dateToDataString={props.dateToDataString}
                    startValue={props.startValue}
                    endValue={props.endValue}
                    monthTemplate={props.monthTemplate}
                    monthProps={props.monthProps}
                    dayTemplate={props.dayTemplate}
                    dayHeaderTemplate={props.dayHeaderTemplate}
                    newMode={props.newMode}
                />
            </>
        );
    }
}
