import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/HasMoreMany/HasMoreMany';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = VirtualScrollHasMore;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = VirtualScrollHasMore.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollHasMoreMany: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 40,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
