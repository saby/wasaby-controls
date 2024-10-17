import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as ExplorerMemory from 'Controls-ListEnv-demo/Search/DataHelpers/ExplorerMemory';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Gadgets } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import * as template from 'wml!Controls-ListEnv-demo/Search/Explorer/SearchNavigationMode/Expand/Expand';

interface ISearchExpandColumn {
    displayProperty: string;
    width: string;
}

const columns: ISearchExpandColumn[] = [
    {
        displayProperty: 'title',
        width: '1fr',
    },
    {
        displayProperty: 'code',
        width: '150px',
    },
    {
        displayProperty: 'price',
        width: '150px',
    },
];

export default class SearchExpand extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewColumns: ISearchExpandColumn[];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewColumns = columns;
    }

    static _styles: string[] = ['Controls-ListEnv-demo/Search/Explorer/Search'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchNavigationMode: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExplorerMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getSearchData(),
                    }),
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    searchStartingWith: 'root',
                    multiSelectVisibility: 'visible',
                    searchParam: 'title',
                    searchNavigationMode: 'expand',
                    viewMode: 'table',
                },
            },
        };
    }
}
