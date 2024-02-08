import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/datePopup/DayTemplate/Template');
import 'css!Controls-demo/datePopup/DayTemplate/DayTemplate';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2022, 4, 3);
    protected _endValue: Date = new Date(2022, 5, 0);
    protected _date: Date = new Date(2022, 0, 27);
}
