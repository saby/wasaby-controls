import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { generateData } from '../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/TrackedProperties/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 100;
const TEN = 10;

function getData(): { key: number; title: string; trackedVal: string }[] {
    return generateData<{
        key: number;
        title: string;
        trackedVal: string;
    }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.trackedVal = `${TEN + item.key - (item.key % TEN)}`;
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _trackedProperties: string[] = ['trackedVal'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TrackedProperties: {
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
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
