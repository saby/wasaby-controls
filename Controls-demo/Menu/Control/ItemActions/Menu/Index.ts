import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { showType } from 'Controls/toolbars';
import controlTemplate = require('wml!Controls-demo/Menu/Control/ItemActions/Menu/Index');

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _itemActions: any[];

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

        this._itemActions = [
            {
                id: 1,
                icon: 'icon-Edit',
                iconStyle: 'secondary',
                title: 'edit',
                showType: showType.Menu,
                handler: (item) => {
                    return alert(`Edit clicked at ${item.getId()}`);
                },
            },
            {
                id: 2,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'delete',
                showType: showType.Menu,
                handler: (item) => {
                    if (this._items.getCount() <= 2) {
                        this._itemActions = null;
                        this._items = this._items.clone(true);
                    }
                    const index = this._items.getIndex(item);
                    this._items.removeAt(index);
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
