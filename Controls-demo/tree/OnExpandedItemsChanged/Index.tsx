import { forwardRef } from 'react';
import { View } from 'Controls/tree';
import { CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'UI/Events';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import { NodeState } from 'Controls-demo/tree/data/NodeState';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!DemoStand/Controls-demo';

function getData() {
    return NodeState.getDataExpandedItemsChanged();
}

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth500 controlsDemo_wrapper-tree-base';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                onExpandedItemsChanged={(expandedItems: CrudEntityKey[]) => {
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
            dataFactoryName: 'Controls-demo/tree/OnExpandedItemsChanged/CustomFactory',
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
            },
        },
    };
};
