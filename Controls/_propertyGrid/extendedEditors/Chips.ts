/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as ChipsTemplate from 'wml!Controls/_propertyGrid/extendedEditors/Chips';
import IEditor from 'Controls/_propertyGrid/IEditor';

/**
 * Редактор для перечисляемого типа данных. В основе редактора используется контрол {@link Controls/Chips:Control}.
 * @extends Controls/Chips:Control
 * @mixes Controls/propertyGrid:IEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Chips/SingleSelection/Demo
 * @demo Controls-demo/PropertyGridNew/Editors/Chips/MultiSelect/Demo
 * @public
 */
class ChipsEditor extends Control implements IEditor {
    protected _template: TemplateFunction = ChipsTemplate;

    protected _handleSelectedKeysChanged(
        event: SyntheticEvent,
        value: number
    ): void {
        this._notify('propertyValueChanged', [value], { bubbling: true });
    }
}
export default ChipsEditor;

/**
 * @name Controls/propertyGrid/ChipsEditor#multiSelect
 * @cfg {boolean} Определяет, установлен ли множественный выбор.
 * @demo Controls-demo/PropertyGridNew/Editors/Chips/MultiSelect/Demo
 * @default false
 */
