import * as template from 'wml!Controls-ListEnv-demo/OperationsPanel/View/RightTemplate/Index';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { default as TreeData } from 'Controls-ListEnv-demo/OperationsPanel/View/resources/TreeData';
import { TColumns } from 'Controls/grid';

export default class OperationsPanelDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: TColumns = [
        {
            displayProperty: 'title',
        },
        {
            displayProperty: 'parent',
        },
    ];

    static getLoadConfig() {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'id',
                    listActions: 'Controls-ListEnv-demo/OperationsPanel/View/listActions',
                    nodeProperty: 'parent@',
                    parentProperty: 'parent',
                    source: new HierarchicalMemory({
                        data: TreeData,
                        keyProperty: 'id',
                    }),
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    }
}
