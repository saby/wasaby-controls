/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as InputTemplate from 'wml!Controls/_filterPanelExtEditors/Input/Input';
import 'css!Controls/filterPanelExtEditors';

interface IInputOptions extends IControlOptions {
    propertyValue: string;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом String.
 * @class Controls/_filterPanelExtEditors/Input
 * @extends UI/Base:Control
 * @mixes Controls/input:Text
 * @demo Controls-demo/filterPanelPopup/Editors/Input/Index
 * @public
 */

class InputEditor extends Control<IInputOptions> {
    protected _template: TemplateFunction = InputTemplate;
    protected _value: string;

    protected _beforeMount(options?: IInputOptions): void {
        this._value = options.propertyValue;
    }

    _beforeUpdate(newOptions: IInputOptions): void {
        if (this._options.propertyValue !== newOptions.propertyValue) {
            this._value = newOptions.propertyValue;
        }
    }

    protected _valueChangedHandler(
        event: SyntheticEvent,
        newValue: string
    ): void {
        this._propertyValueChanged(newValue);
    }

    protected _extendedCaptionClickHandler(): void {
        this._propertyValueChanged(null);
    }

    protected _propertyValueChanged(newValue: string): void {
        const extendedValue = {
            value: newValue,
            textValue: newValue,
            viewMode: 'basic',
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }
}
export default InputEditor;
