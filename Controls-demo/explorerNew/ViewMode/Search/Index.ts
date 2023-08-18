import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as indexTemplate from 'wml!Controls-demo/explorerNew/ViewMode/Search/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getSearchData();
}

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = indexTemplate;

    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ViewModeSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    root: null,
                    viewMode: 'table',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'hidden',
                    searchValue: 'sata',
                    searchParam: 'title',
                },
            },
        };
    }
}

/*
filter: () => {
    return true;
},
*/
