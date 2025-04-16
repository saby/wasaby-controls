import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

const SOURCE = new HierarchicalMemory({
    keyProperty: 'key',
    parentProperty: 'parent',
    data: getData(),
});

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
                columns={COLUMNS}
                keyProperty={'key'}
                parentProperty={'parent'}
                nodeProperty={'type'}
                singleExpand={true}
                expandByItemClick={true}
            />
        </div>
    );
});
