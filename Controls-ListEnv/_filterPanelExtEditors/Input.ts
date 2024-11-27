/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { debounce } from 'Types/function';
import * as InputTemplate from 'wml!Controls-ListEnv/_filterPanelExtEditors/Input/Input';
import 'css!Controls-ListEnv/filterPanelExtEditors';

interface IInputOptions extends IControlOptions {
    propertyValue: string;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом String.
 * @class Controls-ListEnv/_filterPanelExtEditors/Input
 * @extends UI/Base:Control
 * @mixes Controls/input:IMaxLength
 * @mixes Controls/interface:IFontSize
 * @mixes Controls/interface:IFontWeight
 * @mixes Controls/interface:IInputPlaceholder
 * @mixes Controls/interface:IContrastBackground
 * @demo Controls-ListEnv-demo/Filter/View/Editors/InputEditor/Index
 * @public
 */

class InputEditor extends Control<IInputOptions> {
    protected _template: TemplateFunction = InputTemplate;
    protected _value: string;

    protected _beforeMount(options?: IInputOptions): void {
        this._value = options.propertyValue;
        this._valueChanged = debounce(this._valueChanged, 500, true);
    }

    _beforeUpdate(newOptions: IInputOptions): void {
        if (this._options.propertyValue !== newOptions.propertyValue) {
            this._value = newOptions.propertyValue;
        }
    }

    private _valueChanged(value): void {
        this._propertyValueChanged(value);
    }

    protected _valueChangedHandler(event: SyntheticEvent, newValue: string): void {
        this._value = newValue;
        this._valueChanged(newValue);
    }

    protected _extendedCaptionClickHandler(): void {
        this._propertyValueChanged(this._value);
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

/**
 * @typedef {String} Controls-ListEnv/_filterPanelExtEditors/Input/InputWidth
 * @description Значения для настройки ширины редактора поля ввода.
 * @variant s Маленькое поле ввода, рассчитанное на небольшое число символов.
 * @variant default Поле ввода развернутое на всю доступную ширину.
 */

/**
 * @name Controls-ListEnv/_filterPanelExtEditors/Input#inputWidth
 * @cfg {InputWidth} Ширина поля ввода.
 * @default default
 * @demo Controls-ListEnv-demo/Filter/View/Editors/InputEditor/InputWidth/Index
 */
