import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Layout/ListWithFilter/template';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import Data from '../Data';
import { FlatHierarchy } from 'Controls-demo/DemoData/Data';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = FlatHierarchy.getGridColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            nomenclature: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        parentProperty: 'parent',
                        keyProperty: 'id',
                        data: FlatHierarchy.getData(),
                    }),
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    searchParam: 'title',
                    columns: FlatHierarchy.getGridColumns(),
                    keyProperty: 'id',
                },
            },
            employees: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        parentProperty: 'parent',
                        keyProperty: 'id',
                        data: Data.employees,
                    }),
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    searchParam: 'title',
                    columns: [{ displayProperty: 'title' }],
                    keyProperty: 'id',
                },
            },
        };
    }
}
