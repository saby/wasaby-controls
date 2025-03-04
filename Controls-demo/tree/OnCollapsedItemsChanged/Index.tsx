import { forwardRef } from 'react';
import { View } from 'Controls/tree';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'UI/Events';
import { NodeState } from '../data/NodeState';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';

function getData() {
    return NodeState.getDataCollapsedItemsChanged();
}

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth500 controlsDemo_wrapper-tree-base';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                onCollapsedItemsChanged={(collapsedItems: CrudEntityKey[]) => {
                    // Use Slice _beforeApplyState instead. see CustomFactory from this demo.
                }}
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData: {
            dataFactoryName: 'Controls-demo/tree/OnCollapsedItemsChanged/CustomFactory',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new ExpandedSource({
                    keyProperty: 'key',
                    data: getData(),
                    parentProperty: 'parent',
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                expandedItems: [null],
                collapsedItems: [],
            },
        },
    };
};
