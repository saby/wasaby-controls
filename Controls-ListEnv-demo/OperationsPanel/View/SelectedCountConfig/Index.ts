import * as template from 'wml!Controls-ListEnv-demo/OperationsPanel/View/SelectedCountConfig/Index';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { default as TreeData } from 'Controls-ListEnv-demo/OperationsPanel/View/resources/TreeData';
import { TColumns } from 'Controls/grid';
import CountSource from './Source';

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
                    selectedCountConfig: {
                        rpc: new CountSource({
                            data: TreeData,
                        }),
                        command: 'demoGetCount',
                    },
                },
            },
        };
    }
}
