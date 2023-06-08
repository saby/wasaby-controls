import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/resources/Editors/Additional/Dropdown';
import { SyntheticEvent } from 'Vdom/Vdom';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _value: string = '';

    protected _selectedKeysChangedHandler(
        event: SyntheticEvent<Event>,
        value: string[]
    ): void {
        if (value.length && value[0] !== null) {
            this._notify('selectedKeysChanged', [value]);
        }
    }
    protected _textValueChangedHandler(
        event: SyntheticEvent<Event>,
        text: string
    ): void {
        this._notify('textValueChanged', [text]);
    }
}
