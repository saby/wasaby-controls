import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/SwitchButton/Base/Template';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: boolean = false;

    protected _onClickHandler(): void {
        this._value = !this._value;
    }

    protected _getPosition(): string {
        return this._value ? 'end' : 'start';
    }
}

export default Base;
