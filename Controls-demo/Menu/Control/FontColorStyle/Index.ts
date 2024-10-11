import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-demo/Menu/Control/FontColorStyle/Index');

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'DNS' },
                { key: 2, title: 'M.Video' },
                { key: 3, title: 'Citilink' },
                { key: 4, title: 'Eldorado' },
                { key: 5, title: 'Wildberries' },
                { key: 6, title: 'Ozon' },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
