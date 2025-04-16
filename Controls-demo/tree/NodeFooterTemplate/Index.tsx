import { forwardRef } from 'react';
import { View, NodeFooterTemplate } from 'Controls/tree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import { data } from 'Controls-demo/tree/data/Devices';
import 'css!DemoStand/Controls-demo';

function getData() {
    return data;
}

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/node/node-footer-template/
 */
const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth300';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                nodeFooterTemplate={
                    <NodeFooterTemplate>
                        <b>footer template</b>
                    </NodeFooterTemplate>
                }
            />
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
                source: new ExpandedSource({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                expandedItems: [null],
            },
        },
    };
};
