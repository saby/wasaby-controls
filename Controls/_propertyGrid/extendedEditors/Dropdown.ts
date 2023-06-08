/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import CheckboxGroupTemplate = require('wml!Controls/_propertyGrid/extendedEditors/Dropdown');
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

interface IDropdownEditorOptions extends IEditorOptions {
    editorMode: string;
    propertyValue: number[] | string[];
}

/**
 * Редактор для массива в виде выпадающего списка.
 * @extends Controls/dropdown:Selector
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Dropdown/Index
 * @public
 */

class DropdownEditor extends Control implements IEditor {
    protected _template: TemplateFunction = CheckboxGroupTemplate;
    protected _selectedKeys: string[] | number[] = null;

    protected _beforeMount(options?: IDropdownEditorOptions): void {
        this._selectedKeys = options.propertyValue;
    }

    protected _beforeUpdate(options?: IDropdownEditorOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._selectedKeys = options.propertyValue;
        }
    }

    protected _handleSelectedKeysChanged(
        event: SyntheticEvent,
        value: number
    ): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }

    static getDefaultOptions(): object {
        return {
            editorMode: 'Input',
            propertyValue: [],
        };
    }
}

export default DropdownEditor;
