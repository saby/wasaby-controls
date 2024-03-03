import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Actions/_commands/CreateLead/LeadThemeEditor';

interface IOptions extends IControlOptions {
    propertyValue?: object;
}

/**
 * Редактор темы для действия создания лида
 *
 * @public
 */
export default class LeadThemeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _themesTypes: string[] = ['Лид'];
    protected _value: object;
    protected _textValue: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._updateValue(propertyValue);
    }

    protected _beforeUpdate({ propertyValue }: IOptions): void {
        if (propertyValue !== this._options.propertyValue) {
            this._updateValue(propertyValue);
        }
    }

    protected _valueChangedHandler(_: Event, value: number): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }

    private _updateValue(propertyValue: object): void {
        if (!propertyValue) {
            this._value = null;
            this._textValue = null;
        } else {
            this._value = propertyValue;
            this._textValue = propertyValue.Название;
        }
    }
}
