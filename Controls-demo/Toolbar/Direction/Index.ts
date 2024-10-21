import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Toolbar/Direction/Template';
import { Record } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getItemsWithDirection(),
        });
    }

    protected _itemClick(e: Event, item: Record): void {
        if (item.get('isUpdateIcon')) {
            const parentId = item.get('parent');
            const itemsData = data.getItemsWithDirection();
            itemsData.forEach((itemData) => {
                if (itemData.id === parentId) {
                    itemData.icon = item.get('icon');
                }
            });
            this._items = new RecordSet({
                keyProperty: 'id',
                rawData: itemsData,
            });
        }
    }
}

export default Base;
