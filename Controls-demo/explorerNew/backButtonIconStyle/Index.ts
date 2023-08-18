import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/backButtonIconStyle/backButtonIconStyle';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { TRoot } from 'Controls-demo/types';
import { IColumn } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getColumns();
    protected _root: TRoot = 1;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData(),
        });
    }
}
