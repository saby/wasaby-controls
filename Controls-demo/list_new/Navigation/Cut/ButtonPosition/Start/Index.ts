import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getSourceData as getData } from 'Controls-demo/list_new/Navigation/Cut/DataCatalog';
import * as template from 'wml!Controls-demo/list_new/Navigation/Cut/ButtonPosition/Start/Start';

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'cut',
                        sourceConfig: {
                            pageSize: 3,
                            hasMore: false,
                            page: 0,
                        },
                        viewConfig: {
                            buttonConfig: {
                                buttonPosition: 'start',
                            },
                        },
                    },
                },
            },
        };
    }
}
