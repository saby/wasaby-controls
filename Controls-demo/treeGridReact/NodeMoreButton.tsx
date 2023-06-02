import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const source = React.useMemo(() => {
        return new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
        });
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => [
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
    ], []);
    const navigation = React.useMemo(() => {
        return {
            source: 'page',
            view: 'demand',
            sourceConfig: {
                pageSize: 3,
                page: 0,
                hasMore: false,
            },
        };
    }, []);

    return (
        <div ref={ref}>
            <TreeGridView
                source={source}
                navigation={navigation}
                columns={columns}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
            />
        </div>
    );
}

export default React.forwardRef(Demo);
