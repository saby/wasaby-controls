import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ItemTemplate/AdditionalTextTemplate/Index');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    title: 'Закрытая',
                    comment:
                        'В закрытую группу можно вступить либо по запросу, либо по приглашению',
                },
                {
                    key: '2',
                    title: 'Открытая',
                    comment: 'В открытую группу можно вступить без запроса и приглашения',
                },
            ],
        });
    }
}
