import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/EditingCell';
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { Model, Record } from 'Types/entity';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { RecordSet } from 'Types/collection';
import { IItemAction } from 'Controls/itemActions';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumnRes[] = Editing.getEditingColumns();
    protected _markedKey: number;
    protected _dataLoadCallback: TItemsReadyCallback =
        this._dataCallback.bind(this);
    protected _items: RecordSet;
    protected _lastId: number;
    protected _selectedKeys: number[] = [];
    protected _viewModel: unknown;

    protected _itemActions: IItemAction = [
        {
            id: 1,
            icon: 'icon-Erase icon-error',
            title: 'delete',
            style: 'bordered',
            showType: showType.TOOLBAR,
            handler: function (item: Record): void {
                this._children.remover.removeItems([item.get('key')]);
            }.bind(this),
        },
    ];

    protected _beforeMount(): void {
        const data = Editing.getEditingData();
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
        this._lastId = data.length + 1;
    }

    protected _afterMount(): void {
        this._viewModel =
            this._children.list._children.listControl.getViewModel();
    }

    private _dataCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _afterItemsRemove(): void {
        this._toggleAddButton();
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: {
                    key: this._lastId++,
                    title: '',
                    description: '',
                    price: '',
                    balance: '',
                    balanceCostSumm: '',
                    reserve: '',
                    costPrice: '',
                },
            }),
        });
    }

    private _toggleAddButton(): void {
        // eslint-disable-next-line
        const self = this;
        this._viewSource.query().addCallback((items) => {
            const rawData = items.getRawData();
            const getSumm = (title) => {
                return rawData.items.reduce((acc: number, cur: unknown) => {
                    // eslint-disable-next-line
                    acc += parseInt(cur[title], 10) || 0;
                    return acc;
                }, 0);
            };
            const newColumns = self._columns.map((cur) => {
                if (cur.results || cur.results === 0) {
                    return {
                        ...cur,
                        results: getSumm(cur.displayProperty),
                    };
                }
                return cur;
            });
            self._columns = newColumns;
            return items;
        });
    }
}
