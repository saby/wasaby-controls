/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as RadioGroupTemplate from 'wml!Controls-ListEnv/_filterPanelExtEditors/RadioGroup/RadioGroup';
import { IEditorOptions } from 'Controls/filterPanel';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';
import { Logger } from 'UI/Utils';
import 'css!Controls-ListEnv/filterPanelExtEditors';

interface IRadioGroupOptions extends IEditorOptions<string | number> {
    propertyValue: string | number;
    displayProperty: string;
    items?: RecordSet;
}

/**
 * Редактор выбора из перечислений в виде группы радиокнопок
 * В основе редактора используется контрол {@link Controls/RadioGroup:Control}
 * @extends UI/Base:Control
 * @mixes Controls/interface:IHierarchy
 * @mixes Controls/interface:IToggleGroup
 * @demo Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/Index
 * @public
 */

class RadioGroup extends Control<IRadioGroupOptions> {
    protected _template: TemplateFunction = RadioGroupTemplate;

    protected _beforeMount(options: IRadioGroupOptions): Promise<void> | void {
        if (options.source) {
            Logger.error(
                'Controls-ListEnv/filterPanelExtEditors:RadioGroup не поддерживает опцию source, используйте опцию items',
                this
            );
        }
    }

    protected _selectedKeyChangedHandler(
        event: SyntheticEvent,
        selectedKey: number | string
    ): void {
        const extendedValue = {
            value: selectedKey,
            textValue: this._getTextValue(selectedKey),
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    private _getTextValue(id: string | number): string {
        if (this._options.items) {
            const record = this._options.items.getRecordById(id);
            return record.get(this._options.displayProperty);
        }
    }
}
export default RadioGroup;

/**
 * @name Controls/_filterPanelExtEditors/RadioGroup#items
 * @cfg {RecordSet} Определяет набор записей по которым строится контрол.
 * @demo Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/Index
 */
