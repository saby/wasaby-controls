import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { materializedPathData } from 'Controls-demo/tree/data/Devices';
import { HierarchicalMemory } from 'Types/source';

function getData() {
    return materializedPathData;
}

const SOURCE = new HierarchicalMemory({
    keyProperty: 'key',
    data: getData(),
});

const NAVIGATION = {
    source: 'page',
    sourceConfig: {
        page: 0,
        pageSize: 3,
        hasMore: false,
    },
    view: 'demand',
};

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
    },
];

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <TreeGridView
                source={SOURCE}
                navigation={NAVIGATION}
                columns={COLUMNS}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
                childrenProperty={'children'}
                expanderIconStyle={'unaccented'}
                expanderIconSize={'2xs'}
            />
        </div>
    );
});
