import { forwardRef } from 'react';
import { View, NodeFooterTemplate } from 'Controls/tree';
import { HierarchicalMemory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return data;
}

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth500';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                nodeFooterTemplate={(nodeFooterProps) => {
                    return (
                        <NodeFooterTemplate
                            {...nodeFooterProps}
                            content={() => {
                                return <b>footer template</b>;
                            }}
                        ></NodeFooterTemplate>
                    );
                }}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData: {
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
                multiSelectVisibility: 'visible',
            },
        },
    };
};
