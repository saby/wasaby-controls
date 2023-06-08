/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_propertyGrid/defaultEditors/Enum');

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';

/**
 * Редактор для перечисляемого типа данных.
 * @class Controls/_propertyGrid/defaultEditors/EnumEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Enum/Index
 */

/*
 * Editor for enum type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @author Герасимов А.М.
 */

class EnumEditor extends Control implements IEditor {
    protected _template: Function = template;
    protected _options: IEditorOptions;

    protected selectedKey: string = '';

    _beforeMount(options: IEditorOptions): void {
        this._enum = options.propertyValue;
        this.selectedKey = options.propertyValue.getAsValue();
    }

    _beforeUpdate(options: IEditorOptions): void {
        this._enum = options.propertyValue;
        this.selectedKey = options.propertyValue.getAsValue();
    }

    _selectedKeyChanged(event: Event, value: string): void {
        this.selectedKey = value;
        this._enum.setByValue(value);
        this._notify('propertyValueChanged', [this._enum], { bubbling: true });
    }
}

export = EnumEditor;
