import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/SelectionCountMode/SelectionCountMode';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];

    protected _beforeMount(): void {
        this._selectedKeys = [];
        this._excludedKeys = [];
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            parentProperty: 'parent',
        });
    }
}
