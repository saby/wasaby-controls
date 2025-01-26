import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/tree';
import { Memory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!DemoStand/Controls-demo';

function getData() {
    return data;
}

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/paddings/
 */
const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth300 controlsDemo_treeGrid-offset-levelIndent-all-xl';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                itemTemplate={(props) => {
                    return <ItemTemplate levelIndentSize="xl" {...props} />;
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
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                expandedItems: [1],
            },
        },
    };
};
