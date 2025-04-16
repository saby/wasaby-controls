import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/datePopup/BaseDoc/Template');

class Component extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: Date = new Date(2022, 0, 1);
    protected _date: Date = new Date(2023, 0, 1);
    protected _startValue: Date = new Date(2022, 1, 1);
    protected _endValue: Date = new Date(2022, 1, 28);
}

export default Component;
