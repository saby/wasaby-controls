import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'css!Controls-demo/list_new/Navigation/MoreButton/Template/Template';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MoreButton/Template/Template';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

function getData() {
    return generateData({
        count: 30,
        entityTemplate: { title: 'lorem' },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _moreButtonIndicator: boolean = true;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationMoreButtonTemplate: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 7,
                            hasMore: false,
                            page: 0,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    }

    protected _toggleMoreButtonIndicator(): void {
        this._moreButtonIndicator = !this._moreButtonIndicator;
    }
}
