/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import CheckboxGroupTemplate = require('wml!Controls/_propertyGrid/extendedEditors/CheckboxGroup');
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

/**
 * Редактор для массива в виде группы чекбоксов.
 * @extends Controls/CheckboxGroup:Control
 * @mixes Controls/propertyGrid:IEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/CheckboxGroup/Index
 * @public
 */
class CheckboxGroupEditor extends Control implements IEditor {
    protected _template: TemplateFunction = CheckboxGroupTemplate;
    protected _selectedKeys: string[] | number[] = null;

    protected _beforeMount(options?: IEditorOptions): void {
        this._selectedKeys = options.propertyValue;
    }

    protected _beforeUpdate(options?: IEditorOptions): void {
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
}
export default CheckboxGroupEditor;
