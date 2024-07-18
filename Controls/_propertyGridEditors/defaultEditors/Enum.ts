/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_propertyGridEditors/defaultEditors/Enum');

import IEditorOptions from 'Controls/_propertyGridEditors/IEditorOptions';
import IEditor from 'Controls/_propertyGridEditors/IEditor';
import 'css!Controls/propertyGridEditors';

/**
 * Редактор для перечисляемого типа данных.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dropdown.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Enum/Index
 * @see Controls/ComboBox
 */

/*
 * Editor for enum type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
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

export default EnumEditor;
