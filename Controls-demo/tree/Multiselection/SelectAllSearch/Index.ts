import { Control, TemplateFunction } from 'UI/Base';
import { Record } from 'Types/entity';

import { default as CountSource } from 'Controls-demo/list_new/MultiSelect/Search/CountSource';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tree/Multiselection/SelectAllSearch/Search';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.parent = null;
            item.node = true;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedCountConfig = {
        rpc: new CountSource({ data: getData() }),
        command: 'demoGetCount',
        data: {},
    };

    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];

    protected _toStringArray(array: unknown[]): string {
        return array
            .map((it) => {
                return String(it);
            })
            .join();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiselectionSelectAllSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        view: 'infinity',
                        source: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    searchParam: 'title',
                    root: null,
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
