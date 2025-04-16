import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/MoreButtonTemplate/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import 'css!Controls-demo/treeGridNew/NodeFooter/MoreButtonTemplate/Template';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();

    protected _afterMount(): void {
        const tree = this._children.tree;
        tree.toggleExpanded(1).then(() => {
            tree.toggleExpanded(11);
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterMoreFontColorStyleDefault: {
                dataFactoryName: 'Controls/dataFactory:List',
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
                },
            },
        };
    }
}
