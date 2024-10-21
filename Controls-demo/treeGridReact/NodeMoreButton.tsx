import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const columns = React.useMemo<IColumnConfig[]>(
        () => [
            {
                key: 'title',
                displayProperty: 'title',
            },
            {
                displayProperty: 'rating',
            },
            {
                displayProperty: 'country',
            },
        ],
        []
    );

    return (
        <div ref={ref}>
            <TreeGridView
                storeId="listData"
                columns={columns}
                multiSelectVisibility="visible"
            />
        </div>
    );
}

const ForwardedRefDemo = React.forwardRef(Demo);

ForwardedRefDemo.getLoadConfig = () => {
    return {
        listData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                keyProperty: 'key',
                nodeProperty: 'type',
                parentProperty: 'parent',
                source: new HierarchicalMemory({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: Flat.getData(),
                }),
                navigation: {
                    source: 'page',
                    view: 'demand',
                    sourceConfig: {
                        pageSize: 3,
                        page: 0,
                        hasMore: false,
                    },
                },
            },
        },
    };
};

export default ForwardedRefDemo;
