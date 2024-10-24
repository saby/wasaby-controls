import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/Decorators/Markup/WithControls/WrapperControl';

interface IOptions extends IControlOptions {
    value: string;
    id: string;
}

export default class WrapperControl extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _value: string;

    protected _beforeMount(options: IOptions): void {
        this._value = options.value;
    }

    protected _valueChangedHandler(e: Event, value: string): void {
        this._value = value;
        this._notify('inputDataChanged', [this._options.id, value]);
    }
}
