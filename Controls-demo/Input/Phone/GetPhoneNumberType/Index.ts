import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Phone/GetPhoneNumberType/GetPhoneNumberType');
import { getPhoneNumberType } from 'Controls/extendedDecorator';

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string;
    protected _numberType: string;

    protected _updateNumberType(): void {
        this._numberType = getPhoneNumberType(this._value);
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}

export default Phone;
