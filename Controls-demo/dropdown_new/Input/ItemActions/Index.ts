import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/ItemActions/Index');
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import 'css!DemoStand/Controls-demo';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _itemsMultiLine: RecordSet;
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
    protected _itemActionsMultiLine: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: TItemActionShowType.TOOLBAR,
            handler: (item) => {
                if (this._itemsMultiLine.getCount() <= 2) {
                    this._itemActionsMultiLine = null;
                }
                const items = this._itemsMultiLine.clone();
                const index = this._itemsMultiLine.getIndexByValue('key', item.getKey());
                items.removeAt(index);
                this._itemsMultiLine = items;
            },
        },
    ];
    protected _selectedKeys: number[] = [1];
    protected _selectedKeysMultiLine: number[] = [1];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, title: 'In any state', text: 'In any state' },
                { key: 2, title: 'In progress', text: 'In progress' },
                { key: 3, title: 'Completed', text: 'Completed' },
                { key: 6, title: 'Deleted', text: 'Deleted' },
                { key: 7, title: 'Drafts', text: 'Drafts' },
            ],
        });
        this._itemsMultiLine = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: 1,
                    title: 'Subdivision',
                },
                {
                    key: 2,
                    title: 'Separate unit',
                    iconStyle: 'secondary',
                    comment:
                        'A territorially separated subdivision with its own address. For him, you can specify a legal entity',
                },
                { key: 21, title: 'Development' },
                { key: 22, title: 'Exploitation' },
                { key: 23, title: 'Coordination' },
                {
                    key: 3,
                    title: 'Working group',
                    comment:
                        'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office',
                },
            ],
        });
    }
}
