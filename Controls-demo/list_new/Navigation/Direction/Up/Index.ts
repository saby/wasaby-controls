import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Direction/Up/Up';
import { Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'Controls/listWebReducers';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationDirectionUp: {
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
                            pageSize: 10,
                            hasMore: false,
                            page: 10,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    }
}
