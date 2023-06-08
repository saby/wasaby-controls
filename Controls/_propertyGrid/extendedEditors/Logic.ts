/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import template = require('wml!Controls/_propertyGrid/extendedEditors/Logic');
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

interface ILogicEditorOptions extends IEditorOptions {
    editorMode: string;
    propertyValue: boolean;
}

/**
 * Редактор логическое поле. Отображается в виде выпадающего списка с тремя значениями:
 * • Да
 * • Нет
 * • Не выбрано
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 * @mixes Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Logic/Index
 * @public
 * @see @see Controls/propertyGrid:Boolean
 */

export default class extends Control<ILogicEditorOptions> implements IEditor {
    protected _template: TemplateFunction = template;
    protected _selectedKey: boolean = null;

    protected _beforeMount(options?: ILogicEditorOptions): void {
        this._selectedKey = options.propertyValue;
    }

    protected _beforeUpdate(options?: ILogicEditorOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._selectedKey = options.propertyValue;
        }
    }

    protected _handleSelectedKeyChanged(
        event: SyntheticEvent,
        value: boolean
    ): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }
}
