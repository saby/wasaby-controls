/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import LookupTemplate = require('wml!Controls/_propertyGrid/extendedEditors/Lookup');
import IEditor from 'Controls/_propertyGrid/IEditor';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

interface ILookupEditorOptions extends IEditorOptions {
    propertyValue: number[] | string[];
}

/**
 * Редактор для поля выбора из справочника.
 * @extends Controls/lookup:Input
 * @implements Controls/propertyGrid:IEditor
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Lookup/Index
 */

class LookupEditor extends Control implements IEditor {
    protected _template: TemplateFunction = LookupTemplate;
    protected _selectedKeys: string[] | number[] = null;

    protected _beforeMount(options?: ILookupEditorOptions): void {
        this._selectedKeys = options.propertyValue;
    }

    protected _beforeUpdate(options?: ILookupEditorOptions): void {
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
            propertyValue: [],
        };
    }
}

export default LookupEditor;
