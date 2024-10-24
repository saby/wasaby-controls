import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dateRange/RangeSelector/DatePopupType/DatePopupType');

export default class RangeSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _date: Date = new Date(2018, 2);
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2018, 5, 30);
}
