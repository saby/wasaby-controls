import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/Items/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Confirmation } from 'Controls/popup';

class Items extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    key: 1,
                    title: 'Поручение',
                },
                { key: 2, title: 'Задача в разработку' },
                { key: 3, title: 'Ошибка' },
                {
                    key: 4,
                    title: 'Согласование',
                },
            ],
            keyProperty: 'key',
        });
    }

    protected _itemClickHandler(event: Event, item: Model): void {
        Confirmation.openPopup({
            type: 'ok',
            message: `Клик по: "${item.get('title')}"`,
        });
    }
}
export default Items;
