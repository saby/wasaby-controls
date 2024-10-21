import { Component } from 'react';
import { MonthView, MonthViewDayTemplate } from 'Controls/calendar';
import { MonthModel } from 'Controls/compactDatePicker';
import getDayTemplate from './getDayTemplate';
import { IDateRangeOptions } from 'Controls/_dateRange/interfaces/IDateRange';

interface IMonthsRangeMonthView extends IDateRangeOptions {
    monthIndex: number;
    quarterIndex: number;
    halfYearIndex: number;
    holidaysData: object;
}

export default class MonthsRangeMonthView extends Component<IMonthsRangeMonthView> {
    private _dayTemplate: Component;
    constructor(props: IMonthsRangeMonthView) {
        super(props);
        this._getHolidaysData = this._getHolidaysData.bind(this);
        this._dayTemplate = getDayTemplate(MonthViewDayTemplate);
    }

    protected shouldComponentUpdate(props: IMonthsRangeMonthView): boolean {
        return (
            props.holidaysData !== this.props.holidaysData ||
            props.startValue !== this.props.startValue ||
            props.endValue !== this.props.endValue
        );
    }

    private _getHolidaysData(): object {
        return this.props.holidaysData?.[
            this.props.monthIndex + 3 * this.props.quarterIndex + 6 * this.props.halfYearIndex
        ];
    }
    render() {
        return (
            <MonthView
                className="controls-PeriodDialog-MonthsRange__month controls-CompactDatePicker_notHovered "
                data-qa="controls-PeriodDialog-MonthsRange__month"
                monthViewModel={MonthModel}
                holidaysData={this._getHolidaysData()}
                hoveredStartValue={null}
                hoveredEndValue={null}
                startValue={this.props.startValue}
                endValue={this.props.endValue}
                dayTemplate={this._dayTemplate}
                showWeekdays={false}
                month={this.props.month}
                captionFormat="%B"
                isDayAvailable={this.props.isDayAvailable}
                newMode={true}
                _date={this.props._date}
            />
        );
    }
}
