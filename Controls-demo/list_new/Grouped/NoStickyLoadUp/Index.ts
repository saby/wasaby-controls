import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { generateData } from '../../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/Grouped/NoStickyLoadUp/NoStickyLoadUp';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 200;

function getData() {
    return generateData<{
        key: number;
        title: string;
        group: string;
    }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.group = item.key > 100 ? '> 100' : '<= 100';
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedNoStickyLoadUp: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        view: 'infinity',
                        source: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 5,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
