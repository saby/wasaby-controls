import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/Searching';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import SearchingIterativeLoadPageSize from 'Controls-ListEnv-demo/Search/List/IterativeLoadPageSize/Index';
import SearchingIterativeLoadTimeout from 'Controls-ListEnv-demo/Search/List/IterativeLoadTimeout/Index';
import SearchingEditInPlace from 'Controls-ListEnv-demo/Search/List/EditInPlace/Index';
import SearchingPortionedSearch from 'Controls-ListEnv-demo/Search/List/PortionedSearch/Index';
import SearchingPortionedSearchCaption from 'Controls-ListEnv-demo/Search/List/PortionedSearchCaption/Index';
import SearchingStandardSearch from 'Controls-ListEnv-demo/Search/List/StandardSearch/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SearchingIterativeLoadPageSize.getLoadConfig(),
            ...SearchingIterativeLoadTimeout.getLoadConfig(),
            ...SearchingEditInPlace.getLoadConfig(),
            ...SearchingPortionedSearch.getLoadConfig(),
            ...SearchingPortionedSearchCaption.getLoadConfig(),
            ...SearchingStandardSearch.getLoadConfig(),
        };
    }
}
