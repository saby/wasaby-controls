import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';

import * as template from 'wml!Controls-Actions/_commands/CreateClient/ClientTypeEditor';

export type TClient = 'ИП' | 'Физическое лицо' | 'Организация';

interface IClientTypeItem {
    id: TClient;
}

interface IOptions extends IControlOptions {
    propertyValue?: TClient;
}

export default class RuleChooserEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TClient;
    protected _items: RecordSet<IClientTypeItem> = new RecordSet({
        rawData: [
            {
                id: 'ИП',
            },
            {
                id: 'Физическое лицо',
            },
            {
                id: 'Организация',
            },
        ],
        keyProperty: 'id',
    });

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
    }

    protected _selectedKeyChangedHandler(_: Event, selectedKey: string[]): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }
}
