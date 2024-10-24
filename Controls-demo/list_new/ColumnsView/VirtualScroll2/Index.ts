import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory, Memory as MemorySource } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IItemAction } from 'Controls/interface';
import { IVirtualScrollConfig } from 'Controls/list';
import { SyntheticEvent } from 'UICommon/Events';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScroll2/VirtualScroll2');

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const MANY_ITEMS = 200;
const LITTLE_ITEMS = 6;

function getData(count = MANY_ITEMS) {
    return generateData<{
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
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;

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
            this._options._dataOptionsValue.ColumnsViewVirtualScroll2.setState({
                source: this._getSource(MANY_ITEMS),
            });
        }
        if (param === 'empty') {
            this._options._dataOptionsValue.ColumnsViewVirtualScroll2.setState({
                source: this._getEmptySource(),
            });
        }
        if (param === 'small') {
            this._options._dataOptionsValue.ColumnsViewVirtualScroll2.setState({
                source: this._getSource(LITTLE_ITEMS),
            });
        }
    }

    protected _onAddItemAfterMarker(): void {
        const markedItem = this._items.getRecordById(this._markedKey);
        if (!markedItem) {
            return;
        }
        const markedItemIndex = this._items.getIndex(markedItem);
        const source = this._options._dataOptionsValue.ColumnsViewVirtualScroll2.source;
        source.create().then((newItem) => {
            const key = this._items.getCount();
            newItem.setRawData({
                key,
                title: `Запись с id="${key}"`,
            });

            this._items.add(newItem, markedItemIndex + 1);
        });
    }

    private _getSource(count: number): Memory {
        return new Memory({
            data: getData(count),
            keyProperty: 'key',
        });
    }

    private _getEmptySource(): Memory {
        return new MemorySource({
            data: [],
            keyProperty: 'key',
        });
    }

    private _handlerRemove(item: Model): void {
        this._items.remove(item);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewVirtualScroll2: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            page: 0,
                            pageSize: 30,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    },
});
