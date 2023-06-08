import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ScrollToDown/ScrollToDown';

function getData() {
    return generateData(100, [20]);
}

export default class ScrollToDown extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _fallbackImage: string = `${explorerImages[0]}`;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData2: {
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
                            hasMore: false,
                            page: 0,
                            pageSize: 20,
                        },
                    },
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    }
}
