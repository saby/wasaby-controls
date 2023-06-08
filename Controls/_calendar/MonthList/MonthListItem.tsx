/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { Base as dateUtils } from 'Controls/dateUtils';
import ITEM_TYPES from 'Controls/_calendar/MonthList/ItemTypes';
import { date as formatDate } from 'Types/formatter';
import { Date as WSDate, Model } from 'Types/entity';
import monthListUtils from 'Controls/_calendar/MonthList/Utils';
import { IDateRangeOptions } from 'Controls/dateRange';
import MonthListItemTemplate from './MonthListItemTemplate';

interface IMonthListItemOptions extends IDateRangeOptions, IControlProps, TInternalProps {}

export default class MonthListItem extends React.Component<IMonthListItemOptions> {
    protected _startValue: Date;
    protected _endValue: Date;

    protected constructor(props: IMonthListItemOptions) {
        super(props);
        this._updateRangeValues(props.startValue, props.endValue, props.item.get('date'));
    }

    protected shouldComponentUpdate(props: IMonthListItemOptions): void {
        this._updateRangeValues(props.startValue, props.endValue, props.item.get('date'));
        return true;
    }

    private _updateRangeValues(startValue: Date, endValue: Date, monthDate: Date): void {
        // Будем обновлять startValue и endValue только в тех месяцах, в которых происходит выбор
        const startDate = dateUtils.getStartOfMonth(startValue);
        const endDate = dateUtils.getEndOfMonth(endValue);
        if (
            (startValue === null || (startValue && startDate <= monthDate)) &&
            (endValue === null || (endValue && monthDate <= endDate))
        ) {
            this._startValue = startValue;
            this._endValue = endValue;
        } else {
            this._startValue = undefined;
            this._endValue = undefined;
        }
    }

    protected _getTemplate(data: Model): React.ReactElement {
        switch (data.get('type')) {
            case ITEM_TYPES.header:
                return this.props.itemHeaderTemplate;
            case ITEM_TYPES.stub:
                return this.props.stubTemplate;
            default:
                return this.props.itemTemplate;
        }
    }

    protected _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }

    protected _getMonth(year: number, month: number): Date {
        return new WSDate(year, month, 1);
    }

    protected _dateToDataString(date: Date): string {
        return monthListUtils.dateToId(date);
    }

    render() {
        return (
            <MonthListItemTemplate
                {...this.props}
                itemTemplate={this._getTemplate(this.props.item)}
                extData={this.props.extData.getData(this.props.item.get('id'))}
                startValue={this._startValue}
                endValue={this._endValue}
                _formatMonth={this._formatMonth}
                _getMonth={this._getMonth}
                _dateToDataString={this._dateToDataString}
            />
        );
    }
}
