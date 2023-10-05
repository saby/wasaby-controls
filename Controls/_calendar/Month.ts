/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as coreMerge from 'Core/core-merge';
import { default as MonthData, IMonthOptions } from 'Controls/_calendar/interfaces/IMonth';
import MonthViewModel from 'Controls/_calendar/Month/Model';
import monthTmpl = require('wml!Controls/_calendar/Month/Month');
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Календарь, отображающий 1 месяц.
 * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора периода с помощью мыши.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_calendar.less переменные тем оформления}
 *
 * @class Controls/_calendar/Month
 * @extends UI/Base:Control
 * @mixes Controls/calendar:IMonth
 * @implements Controls/interface:IDayTemplate
 * @mixes Controls/dateRange:IRangeSelectable
 * @implements Controls/dateRange:IDateRangeSelectable
 *
 * @public
 * @demo Controls-demo/Date/Month
 *
 */

export interface IMonthControlOptions extends IControlOptions, IMonthOptions {}

export default class Month extends Control<IMonthControlOptions> {
    _template: TemplateFunction = monthTmpl;
    _monthViewModel: MonthViewModel = MonthViewModel;

    protected _onRangeChangedHandler(
        event: SyntheticEvent<Event>,
        startValue: Date,
        endValue: Date
    ): void {
        this._notify('startValueChanged', [startValue]);
        this._notify('endValueChanged', [endValue]);
    }

    protected _itemClickHandler(event: SyntheticEvent<Event>, item: object): void {
        this._notify('itemClick', [item]);
    }

    static getOptionTypes(): object {
        return coreMerge({}, MonthData.getOptionTypes());
    }

    static getDefaultOptions(): IControlOptions {
        return coreMerge({}, MonthData.getDefaultOptions());
    }
}
