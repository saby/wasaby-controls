import { SyntheticEvent } from 'Vdom/Vdom';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Input/DateBase/DisplayValue/Template';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _displayValue: string = '  .  .21';

    protected _onValueChanged(
        e: SyntheticEvent,
        value: Date,
        displayValue: string
    ): void {
        this._displayValue = displayValue;
    }
}

export default DemoControl;
