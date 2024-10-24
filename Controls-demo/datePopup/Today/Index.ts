import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/datePopup/Today/Today');

class Component extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _beforeMount() {
        this._startValueRange = new Date(2021, 0, 1);
        this._endValueRange = new Date(2021, 0, 10);
        this._date = new Date(2021, 0, 11);
        this._dateWeekend = new Date(2021, 0, 16);
    }
}

export default Component;
