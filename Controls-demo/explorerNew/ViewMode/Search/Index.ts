import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/_grid/display/interface/IColumn';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as indexTemplate from 'wml!Controls-demo/explorerNew/ViewMode/Search/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = indexTemplate;

    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getSearchData(),
            filter: () => {
                return true;
            },
        });
    }
}
