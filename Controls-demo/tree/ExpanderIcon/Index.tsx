import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/tree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import 'css!DemoStand/Controls-demo';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            parent: 1,
            type: true,
        },
        {
            key: 111,
            title: 'Leaf',
            parent: 11,
            type: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            parent: 1,
            type: false,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            parent: 1,
            type: null,
        },
        {
            key: 2,
            title: 'Node 2',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            parent: 2,
            type: null,
        },
        {
            key: 3,
            title: 'Node 3',
            parent: null,
            type: true,
            hasChild: false,
        },
    ];
}

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/node/expander/#expander-icon
 */
const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                itemTemplate={(props) => {
                    return <ItemTemplate expanderIcon="hiddenNode" {...props} />;
                }}
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
