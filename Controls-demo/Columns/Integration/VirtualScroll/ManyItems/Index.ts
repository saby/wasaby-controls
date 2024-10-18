import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { generateData } from 'list_new/DemoHelpers/DataCatalog';
import { IVirtualScrollConfig } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/Columns/Integration/VirtualScroll/ManyItems/Template');

const NUMBER_OF_ITEMS = 200;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key + 1}"`;
            const lastKeyChar = ('' + item.key).slice(-1);
            let height = 0;
            switch (lastKeyChar) {
                case '0':
                case '2':
                case '6':
                    height = 210;
                    break;
                case '1':
                case '5':
                case '9':
                    height = 300;
                    break;
                default:
                    height = 120;
            }
            item.height = height;
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 30
    };

    protected _itemPadding: {} = {
        top: 'null',
        left: 'null',
        bottom: 'null',
        right: 'null'
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewVirtualScroll: {
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
                            pageSize: 50,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
