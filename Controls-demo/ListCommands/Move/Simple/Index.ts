import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Move/Simple/Index';
import { getListData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { View as TreeGrid } from 'Controls/treeGrid';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from './ExpandedSource';
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'id',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'id',
                    multiSelectVisibility: 'visible',
                    selectedKeys: [],
                    excludedKeys: [],
                    navigation: null,
                    nodeProperty: 'Раздел@',
                    parentProperty: 'Раздел',
                },
            },
        };
    }
}
