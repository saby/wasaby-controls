import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Date/DatePopupType/DatePopupType');

export default class RangeSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: Date = new Date(2018, 0, 1);
}
