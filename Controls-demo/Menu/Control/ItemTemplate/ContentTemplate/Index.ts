import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/ItemTemplate/ContentTemplate/Index');
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: '1', title: 'Yaroslavl', code: '76' },
                { key: '2', title: 'Moscow', code: '77' },
                { key: '3', title: 'St-Petersburg', code: '78' },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
