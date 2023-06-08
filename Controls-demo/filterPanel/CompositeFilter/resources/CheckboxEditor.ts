import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/CompositeFilter/resources/CheckboxEditor';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IEditor {
    propertyValue: boolean;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _value: boolean;

    protected _beforeMount(options: IEditor): void {
        this._value = options.propertyValue;
    }

    protected _beforeUpdate(options: IEditor): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._value = options.propertyValue;
        }
    }

    protected _handleValueChanged(event: SyntheticEvent, value: boolean): void {
        this._value = value;
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }
    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}
