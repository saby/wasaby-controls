import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { date as formatDate } from 'Types/formatter';
import Source from 'Controls-demo/Calendar/MonthList/Source/GetInitialData/resource/Source';
import template = require('wml!Controls-demo/Calendar/MonthList/Source/Source');
import dayTemplate = require('wml!Controls-demo/Calendar/MonthList/resources/DayTemplate');
import 'css!Controls-demo/Calendar/MonthList/resources/MonthListDemo';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _position: Date = new Date(2020, 0);
    protected _source: Source = new Source();
    protected _dayTemplate: TemplateFunction = dayTemplate;

    protected _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }
}
export default DemoControl;
