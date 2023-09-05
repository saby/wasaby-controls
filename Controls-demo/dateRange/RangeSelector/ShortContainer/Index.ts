import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dateRange/RangeSelector/ShortContainer/Template');
import 'css!Controls-demo/dateRange/RangeSelector/ShortContainer/Styles';

export default class RangeSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2016, 8, 30);
}
