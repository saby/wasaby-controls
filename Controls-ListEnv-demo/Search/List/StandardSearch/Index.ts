import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getFewCategories as getData } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/StandardSearch/Searching';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchingStandardSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    searchParam: 'title',
                    searchValue: 'ap',
                },
            },
        };
    }
}
