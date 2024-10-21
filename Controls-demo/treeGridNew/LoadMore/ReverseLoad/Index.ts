import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/LoadMore/ReverseLoad/ReverseLoad';
import { IColumn } from 'Controls/grid';
import { default as HierarchicalReverseMemory, getColumns, getData } from './Data';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalReverseMemory;
    protected _columns: IColumn[] = getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadMoreReverseLoad: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalReverseMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    markerVisibility: 'hidden',
                    navigation: {
                        source: 'position',
                        view: 'demand',
                        sourceConfig: {
                            direction: 'bothways',
                            field: 'key',
                            limit: 2,
                            multiNavigation: true,
                        },
                    },
                },
            },
        };
    }
}
