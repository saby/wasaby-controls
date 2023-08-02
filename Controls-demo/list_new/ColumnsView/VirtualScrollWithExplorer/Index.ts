import { Control, TemplateFunction } from 'UI/Base';
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { IVirtualScrollConfig } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScrollWithExplorer/VirtualScrollWithExplorer');

const NUMBER_OF_ITEMS = 200;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;

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

    protected _useColumns: boolean = true;

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
                },
            },
        };
    }

    protected _beforeMount(): void {
        const data = generateData<{
            key: number;
            title: string;
            description: string;
            column: number;
        }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string', description: 'lorem' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". ${item.title}`;
            },
        });
        this._viewSource = new MemorySource({
            data,
            keyProperty: 'key',
        });
    }

    protected _changeViewMode(): void {
        this._useColumns = !this._useColumns;
    }
}
