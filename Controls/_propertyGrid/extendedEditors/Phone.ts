/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

import PhoneTemplate = require('wml!Controls/_propertyGrid/extendedEditors/Phone');

interface IPhoneEditorOptions extends IEditorOptions, IControlOptions {
    propertyValue: string;
}
/**
 * Редактор для поля ввода номера телефона.
 * @extends Controls/input:Phone
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/PhoneEditor/Index
 * @public
 */
class PhoneEditor extends Control<IPhoneEditorOptions> implements IEditor {
    protected _template: TemplateFunction = PhoneTemplate;
    protected _value: string = '';

    protected _beforeMount(options: IPhoneEditorOptions): void {
        this._value = options.propertyValue;
    }

    protected _beforeUpdate(newOptions: IPhoneEditorOptions): void {
        if (this._options.propertyValue !== newOptions.propertyValue) {
            this._value = newOptions.propertyValue;
        }
    }

    protected _handleInputCompleted(
        event: SyntheticEvent,
        value: string
    ): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }
}
export default PhoneEditor;
