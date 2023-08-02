/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import TumblerTemplate = require('wml!Controls/_filterPanelExtEditors/Tumbler/Tumbler');
import { IEditorOptions } from 'Controls/filterPanel';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanelExtEditors';

interface ITumblerOptions extends IEditorOptions<string | number> {
    items: RecordSet;
    displayProperty?: string;
}

interface ITumbler {
    readonly '[Controls/_filterPanelExtEditors/Tumbler]': boolean;
}

/**
 * Контрол используют в качестве редактора кнопочного переключателя.
 * @class Controls/_filterPanelExtEditors/Tumbler
 * @extends UI/Base:Control
 * @mixes Controls/Tumbler:Control
 * @demo Controls-ListEnv-demo/Filter/View/Editors/TumblerEditor/Index
 * @public
 */

class Tumbler extends Control<ITumblerOptions> implements ITumbler {
    readonly '[Controls/_filterPanelExtEditors/Tumbler]': boolean = true;
    protected _template: TemplateFunction = TumblerTemplate;

    protected _beforeMount({ viewMode }: ITumblerOptions): void {
        this._checkViewMode(viewMode);
    }

    protected _beforeUpdate({ viewMode }: ITumblerOptions): void {
        this._checkViewMode(viewMode);
    }

    protected _selectedKeyChangedHandler(event: SyntheticEvent, value: string | number): void {
        const extendedValue = {
            value,
            textValue: this._getTextValue(value),
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    protected _extendedCaptionClickHandler(event: SyntheticEvent): void {
        const value = this._options.items.at(0).getKey();
        this._selectedKeyChangedHandler(event, value);
    }

    private _checkViewMode(viewMode: string): void {
        if (viewMode === 'extended') {
            Logger.error(
                'Controls/filterPanelExtEditors:TumblerEditor: В опцию viewMode было передано значение extended. Данный редактор может отображаться только в основном блоке.',
                this
            );
        }
    }

    private _getTextValue(id: string | number): string {
        const record = this._options.items.getRecordById(id);
        return record.get(this._options.displayProperty || 'caption');
    }
}
export default Tumbler;
