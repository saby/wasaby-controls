import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/LoadItems/LoadItems';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData(100);
}

export default class ScrollToDown extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadItems: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            hasMore: false,
                            page: 0,
                            pageSize: 12,
                        },
                    },
                    multiSelectVisibility: 'hidden',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
