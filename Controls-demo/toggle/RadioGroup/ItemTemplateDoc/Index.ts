import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-demo/toggle/RadioGroup/ItemTemplateDoc/ItemTemplate');

class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey: string = '3';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Отправить в VK',
                },
                {
                    id: '2',
                    title: 'Отправить в OK',
                },
                {
                    id: '3',
                    title: 'Отправить по Telegram',
                },
            ],
        });
    }
}

export default ItemTemplate;
