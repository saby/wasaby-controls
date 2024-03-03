/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as CheckboxGroupTemplate from 'wml!Controls-ListEnv/_filterPanelExtEditors/CheckboxGroup/CheckboxGroup';
import { IEditorOptions } from 'Controls/filterPanel';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';
import 'css!Controls-ListEnv/filterPanelExtEditors';

interface ICheckboxOptions extends IEditorOptions<string | number> {
    propertyValue: string | number;
    displayProperty: string;
    items?: RecordSet;
}

/**
 * Редактор выбора из перечислений в виде группы чекбоксов
 * В основе редактора используется контрол {@link Controls/CheckboxGroup:Control}
 * @extends UI/Base:Control
 * @mixes Controls/interface:IHierarchy
 * @mixes Controls/interface:ISource
 * @mixes Controls/interface:IToggleGroup
 * @public
 */

class CheckboxGroup extends Control<ICheckboxOptions> {
    protected _template: TemplateFunction = CheckboxGroupTemplate;

    protected _selectedKeysChangedHandler(
        event: SyntheticEvent,
        selectedKeys: number[] | string[]
    ): void {
        const extendedValue = {
            value: selectedKeys,
            textValue: this._getTextValue(selectedKeys),
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    private _getTextValue(keys: string[] | number[]): string {
        if (!this._options.items) {
            return '';
        }
        const text = keys.map((key) => {
            const item = this._options.items.getRecordById(key);
            if (item) {
                return item.get(this._options.displayProperty);
            }
        });
        return text.join(', ');
    }
}
export default CheckboxGroup;
