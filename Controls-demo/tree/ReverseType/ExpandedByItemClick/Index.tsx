import { forwardRef } from 'react';
import { View } from 'Controls/tree';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';

function getData() {
    return data;
}

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_tree-expandedItems';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="listData0" expandByItemClick={true} />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData0: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new ExpandedSource({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};
