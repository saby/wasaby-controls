import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { generateData } from 'list_new/DemoHelpers/DataCatalog';
import { IVirtualScrollConfig } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/Columns/Integration/VirtualScroll/MultipleTriggersEvents/Template');

const SIZES = [
    250, 250, 1250, 1250, 500, 1250, 750, 750, 750, 500, 750, 750, 500, 500, 750, 500, 500, 500, 500, 500, 500
];

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: SIZES.length,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key + 1}"`;
            item.height = SIZES[item.key];
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 6
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
