import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScroll2/VirtualScroll2');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import {
    IItemAction,
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { IVirtualScrollConfig } from 'Controls/list';
import { SyntheticEvent } from 'UICommon/Events';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

const MANY_ITEMS = 200;
const LITTLE_ITEMS = 6;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory = this._getSource(MANY_ITEMS);

    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            page: 0,
            pageSize: 30,
            hasMore: false,
        },
    };

    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 30,
    };

    protected _items: RecordSet;

    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: 2,
            handler: (item) => {
                return this._handlerRemove(item);
            },
        },
    ];

    protected _markedKey: CrudEntityKey;

    protected _itemsReadyCallback: Function = (items: RecordSet) => {
        return (this._items = items);
    };

    protected _onReload(_: SyntheticEvent, param: 'empty' | 'small'): void {
        if (!param) {
            this._viewSource = this._getSource(MANY_ITEMS);
        }
        if (param === 'empty') {
            this._viewSource = this._getEmptySource();
        }
        if (param === 'small') {
            this._viewSource = this._getSource(LITTLE_ITEMS);
        }
    }

    protected _onAddItemAfterMarker(): void {
        const markedItem = this._items.getRecordById(this._markedKey);
        if (!markedItem) {
            return;
        }
        const markedItemIndex = this._items.getIndex(markedItem);

        this._viewSource.create().then((newItem) => {
            const key = this._items.getCount();
            newItem.setRawData({
                key,
                title: `Запись с id="${key}"`,
            });

            this._items.add(newItem, markedItemIndex + 1);
        });
    }

    private _getSource(count: number): MemorySource {
        const data = generateData<{
            key: number;
            title: string;
            description: string;
            column: number;
        }>({
            count,
            entityTemplate: { title: 'string', description: 'lorem' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". ${item.title}`;
            },
        });

        return new MemorySource({
            data,
            keyProperty: 'key',
        });
    }

    private _getEmptySource(): MemorySource {
        return new MemorySource({
            data: [],
            keyProperty: 'key',
        });
    }

    private _handlerRemove(item: Model): void {
        this._items.remove(item);
    }
}
