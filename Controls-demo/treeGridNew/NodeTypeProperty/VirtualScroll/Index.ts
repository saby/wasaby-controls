import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/VirtualScroll/VirtualScroll';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';
import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import MultiNavigationMemory from './DataSource';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return VirtualScrollHasMore.getDataForVirtual().map((it) => {
        const nodeType = it.type && it.parent === null ? 'group' : null;
        return {
            ...it,
            nodeType,
        };
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _children: {
        tree: View;
    };

    protected _beforeMount(): void {
        this._columns = Flat.getColumns();
        this._columns[1].width = '50px';
        this._columns[2].width = '200px';
    }

    protected _reload(): void {
        const source = this._options._dataOptionsValue.NodeTypePropertyVirtualScroll.source;
        source.data.forEach((elem) => {
            elem.title += '*';
        });
        this._children.tree.reload(true);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyVirtualScroll: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new MultiNavigationMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    deepReload: true,
                    expandedItems: [null],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    },
});
