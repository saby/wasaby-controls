import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { INameValue } from 'Controls-Name/Input';

import EditorTemplate = require('wml!Controls-Name/_propertyGrid/Editor');

interface IEditorOptions extends IControlOptions {
    propertyValue: INameValue;
    fields: string[];
}

/**
 * Редактор для поля ввода ФИО.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-Name-demo/PropertyGrid/NameEditor
 * @public
 */
class PropertyGridEditor extends Control<IEditorOptions> {
    protected _template: TemplateFunction = EditorTemplate;
    protected _firstName: string;
    protected _middleName: string;
    protected _lastName: string;

    protected _beforeMount(options: IEditorOptions): void {
        const { lastName, firstName, middleName } = options.propertyValue;
        this._lastName = lastName;
        this._firstName = firstName;
        this._middleName = middleName;
    }

    protected _beforeUpdate(newOptions: IEditorOptions): void {
        if (this._options.propertyValue !== newOptions.propertyValue) {
            const { lastName, firstName, middleName } = newOptions.propertyValue;
            this._lastName = lastName;
            this._firstName = firstName;
            this._middleName = middleName;
        }
    }

    protected _valueChangedHandler(
        event: SyntheticEvent,
        stringValue: string,
        value: INameValue
    ): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }

    static getDefaultOptions(): Partial<IEditorOptions> {
        return {
            fields: ['lastName', 'firstName', 'middleName'],
            propertyValue: { lastName: '', firstName: '', middleName: '' },
        };
    }
}

export default PropertyGridEditor;
