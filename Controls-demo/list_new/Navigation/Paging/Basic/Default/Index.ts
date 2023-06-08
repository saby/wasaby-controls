/* eslint-disable */
import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/Basic/Default/Basic';
import {Memory} from 'Types/source';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';
import {generateData} from '../../../../DemoHelpers/DataCatalog';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: {title: 'lorem'},
    });
}

/**
 * Стандартное отображение пэйджинга с 3 кнопками
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
                            page: 0,
                            hasMore: false,
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
