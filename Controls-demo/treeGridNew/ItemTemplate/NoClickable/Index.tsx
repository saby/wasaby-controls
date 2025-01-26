import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

const columns = Flat.getColumns();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="ItemTemplateNoClickable"
                columns={columns}
                itemTemplate={(props) => {
                    return <ItemTemplate {...props} clickable={false} />;
                }}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateNoClickable: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new HierarchicalMemory({
                    keyProperty: 'key',
                    data: getData(),
                    parentProperty: 'parent',
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};
