import * as template from 'wml!Controls-ListEnv-demo/OperationsPanel/View/OperationsPanel';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import 'wml!Controls-ListEnv-demo/OperationsPanel/View/resources/HeaderWithOperationsPanel';
import { HierarchicalMemory } from 'Types/source';
import { default as TreeData } from 'Controls-ListEnv-demo/OperationsPanel/View/resources/TreeData';
import { DataLoader, ILoadDataResult } from 'Controls/dataSource';
import 'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect';
import { IHeaderCell, TColumns } from 'Controls/grid';

export default class OperationsPanelDemo extends Control<
    IControlOptions,
    void | ILoadDataResult[]
> {
    protected _template: TemplateFunction = template;
    protected _prefetchResults: unknown = [];
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];

    protected _header: IHeaderCell[] = [
        {
            template:
                'wml!Controls-ListEnv-demo/OperationsPanel/View/resources/HeaderWithOperationsPanel',
            templateOptions: {
                actions: [
                    {
                        id: 'print',
                        icon: 'icon-Save',
                        actionName:
                            'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect',
                    },
                    {
                        id: 'print2',
                        icon: 'icon-Save',
                        actionName:
                            'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect',
                    },
                    {
                        id: 'print3',
                        icon: 'icon-Save',
                        actionName:
                            'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect',
                    },
                    {
                        id: 'print4',
                        icon: 'icon-Save',
                        actionName:
                            'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect',
                    },
                    {
                        id: 'print5',
                        icon: 'icon-Save',
                        actionName:
                            'Controls-ListEnv-demo/OperationsPanel/View/Actions/MultiSelect',
                    },
                ],
            },
        },
        { caption: 'Батя' },
    ];
    protected _columns: TColumns = [
        {
            displayProperty: 'title',
        },
        {
            displayProperty: 'parent',
        },
    ];
    protected _viewSource: HierarchicalMemory = new HierarchicalMemory({
        data: TreeData,
        keyProperty: 'id',
    });

    protected _beforeMount(): Promise<void | ILoadDataResult[]> {
        return (
            new DataLoader().load([
                {
                    source: this._viewSource,
                    actions: true,
                    keyProperty: 'id',
                },
            ]) as Promise<unknown>
        ).then((loadResults) => {
            this._prefetchResults = loadResults;
            this._prefetchResults[0].operationsController.setOperationsPanelVisible(
                true
            );
        });
    }
}
