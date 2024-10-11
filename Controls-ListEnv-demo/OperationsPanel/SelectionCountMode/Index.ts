import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/OperationsPanel/SelectionCountMode/SelectionCountMode';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SelectionCountMode: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'key',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    source: new HierarchicalMemory({
                        data: getData(),
                        parentProperty: 'parent',
                        keyProperty: 'key',
                    }),
                    multiSelectVisibility: 'visible',
                    selectionCountMode: 'leaf',
                    listActions: 'Controls-ListEnv-demo/OperationsPanel/View/listActions',
                },
            },
        };
    }
}
