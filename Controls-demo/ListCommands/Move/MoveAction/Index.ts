import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { getListData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import DemoSource from 'Controls-demo/ListCommands/DemoHelpers/DemoSource';

import 'wml!Controls-demo/ListCommands/templates/PersonInfo';
import 'css!Controls-demo/ListCommands/ListCommands';

import * as template from 'wml!Controls-demo/ListCommands/Move/MoveAction/Index';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _gridColumns: IColumn[] = [
        {
            template: 'wml!Controls-demo/ListCommands/templates/PersonInfo',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    selectedKeys: [],
                    excludedKeys: [],
                    keyProperty: 'id',
                    multiSelectVisibility: 'visible',
                    nodeProperty: 'Раздел@',
                    parentProperty: 'Раздел',
                    filter: {
                        expanded: true,
                        Служебные: true,
                    },
                    listActions: [
                        {
                            actionName: 'Controls/actions:Move',
                            commandOptions: {
                                columns: [
                                    {
                                        displayProperty: 'department',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        };
    }
}
