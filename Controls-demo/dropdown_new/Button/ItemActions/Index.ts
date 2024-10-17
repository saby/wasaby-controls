import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ItemActions/Index');
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import 'css!DemoStand/Controls-demo';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Edit',
            iconStyle: 'secondary',
            title: 'edit',
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 2,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: TItemActionShowType.TOOLBAR,
            handler: (item) => {
                if (this._items.getCount() <= 2) {
                    this._itemActions = null;
                }
                const items = this._items.clone();
                const index = this._items.getIndexByValue('key', item.getKey());
                items.removeAt(index);
                this._items = items;
            },
        },
    ];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, title: 'DNS' },
                { key: 2, title: 'М.Видео' },
                { key: 3, title: 'Ситилинк' },
                { key: 6, title: 'Эльдорадо' },
            ],
        });
    }
}
