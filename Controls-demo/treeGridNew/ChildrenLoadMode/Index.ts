import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import * as Template from 'wml!Controls-demo/treeGridNew/ChildrenLoadMode/ChildrenLoadMode';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ChildrenLoadMode: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    childrenLoadMode: 'always',
                },
            },
        };
    }
}
