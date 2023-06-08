import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Move/Simple/Index';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { memoryFilter as moverMemoryFilter } from 'Controls-demo/ListCommands/Move/memoryFilter';
import { HierarchicalMemory } from 'Types/source';
import { View as TreeGrid } from 'Controls/treeGrid';
import { IColumn } from 'Controls/grid';
import 'css!Controls-demo/ListCommands/ListCommands';
import 'wml!Controls-demo/ListCommands/templates/PersonInfo';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _excludedkeys: string[] = [];
    protected _children: {
        treeGrid: TreeGrid;
    };
    protected _gridColumns: IColumn[] = [
        {
            template: 'wml!Controls-demo/ListCommands/templates/PersonInfo',
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'department',
            width: '',
        },
    ];

    protected _source: HierarchicalMemory = new HierarchicalMemory({
        keyProperty: 'id',
        data: getListData(),
        filter: moverMemoryFilter,
    });

    protected _move(): void {
        this._children.treeGrid
            .moveItemsWithDialog({
                selected: this._selectedKeys,
                excluded: this._excludedkeys,
            })
            .then(() => {
                this._selectedKeys = [];
                this._excludedkeys = [];
                this._children.treeGrid.reload();
            });
    }
}
