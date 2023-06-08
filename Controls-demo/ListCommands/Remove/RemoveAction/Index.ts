import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Remove/RemoveAction/Index';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import * as TreeMemory from 'Controls-demo/List/Tree/TreeMemory';
import 'wml!Controls-demo/ListCommands/templates/PersonInfo';
import { IAction } from 'Controls/actions';
import 'css!Controls-demo/ListCommands/ListCommands';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];
    protected _operationsItems: IAction[] = [
        {
            actionName: 'Controls/actions:Remove',
        },
    ];

    protected _source: TreeMemory = new TreeMemory({
        keyProperty: 'id',
        data: getListData(),
    });
    protected _gridColumns: IColumn[] = [
        {
            template: 'wml!Controls-demo/ListCommands/templates/PersonInfo',
        },
    ];
}
