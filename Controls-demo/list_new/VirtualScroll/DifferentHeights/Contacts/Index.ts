import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/DifferentHeights/Contacts/Contacts';
import { Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { IItemAction } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IItem {
    title: string;
    key: string | number;
}

function getData(): IItem[] {
    return generateData<{
        key: number;
        title: string;
    }>({
        count: 1000,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            title: 'Ответить',
            handler: (item) => {
                const index = this._items.getIndex(item);
                item.set('title', item.get('title') + ' ' + item.get('title'));
                this._items.move(index, 0);
            },
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'hidden',
                        },
                    },
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._itemsReady = this._itemsReady.bind(this);
    }

    protected _itemsReady(items: RecordSet): void {
        this._items = items;
    }
}
