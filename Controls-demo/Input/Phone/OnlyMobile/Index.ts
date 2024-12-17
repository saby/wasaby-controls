import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Phone/OnlyMobile/Phone');

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string = '';

    protected _valueChanged(e: Event, val: string): void {
        this._value = val;
    }
}

export default Phone;
