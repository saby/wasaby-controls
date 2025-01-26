import { forwardRef } from 'react';
import { View } from 'Controls/tree';
import { HierarchicalMemory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!DemoStand/Controls-demo';

function getData() {
    return data;
}

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_tree-reverseType-singleExpand';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="listData1" />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData1: {
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
                singleExpand: true,
            },
        },
    };
};
