import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/datePopup/SelectionTypeDoc/Template');

class Component extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _date: Date = new Date(2022, 2, 1);
    protected _startValue = new Date(2022, 0, 1);
    protected _endValue = new Date(2022, 0, 7);
}

export default Component;
