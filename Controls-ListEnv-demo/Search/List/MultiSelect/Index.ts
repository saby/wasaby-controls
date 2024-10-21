import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { default as CountSource } from 'Controls-ListEnv-demo/Search/List/MultiSelect/CountSource';
import { generateData } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/MultiSelect/Search';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
    });
}

const source = new Memory({
    keyProperty: 'key',
    data: getData(),
    filter: (item: Model, filter: { title: string }) => {
        if (!filter || !filter.title) {
            return true;
        }

        const itemTitle = item.get('title').toLowerCase();
        const searchValue = filter.title.toLowerCase();
        return itemTitle.includes(searchValue);
    },
});

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _selectedCountConfig = {
        rpc: new CountSource({ data: getData() }),
        command: 'demoGetCount',
        data: {},
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiSelectSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source,
                    navigation: {
                        view: 'infinity',
                        source: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    searchParam: 'title',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }

    protected _toStringArray(array: unknown[]): string {
        return array
            .map((it) => {
                return String(it);
            })
            .join();
    }
}
