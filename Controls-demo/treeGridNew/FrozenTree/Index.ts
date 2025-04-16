import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/FrozenTree/FrozenTree';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FrozenTree: {
                dataFactoryName: 'Controls-demo/treeGridNew/FrozenTree/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 2],
                },
            },
        };
    }
}
