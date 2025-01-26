import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UI/Vdom';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IVirtualScrollConfig } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScroll/VirtualScroll');

const NUMBER_OF_ITEMS = 1000;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _virtualScrollConfig: IVirtualScrollConfig;

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
                            pageSize: 10,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'direct',
                        },
                    },
                    markerVisibility: 'visible',
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._virtualScrollConfig = {
            pageSize: 100,
            segmentSize: 25,
            mode: 'remove',
        };
    }

    protected _dragStart(e: SyntheticEvent, items: string[]): ItemsEntity {
        return new ItemsEntity({ items });
    }
}
