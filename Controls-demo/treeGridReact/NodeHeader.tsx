import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, INodeFooterConfig } from 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { TColspanCallback } from 'Controls/grid';
import { Model } from 'Types/entity';

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const source = React.useMemo(() => {
        return new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
        });
    }, []);
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
    const nodeHeader = React.useMemo<INodeFooterConfig[]>(() => {
        return [
            { key: 'node_header_1', render: <i>Node header cell</i> },
            { key: 'node_header_2', render: <i>Node header cell</i> },
            { key: 'node_header_3', render: <i>Node header cell</i> },
        ];
    }, []);

    const [nodeHeaderColspan, setNodeHeaderColspan] = React.useState(false);
    const nodeHeaderColspanCallback = React.useCallback<TColspanCallback>(
        (node: Model, column: IColumnConfig, columnIndex: number) => {
            if (nodeHeaderColspan) {
                return 'end';
            }
        },
        [nodeHeaderColspan]
    );

    return (
        <div ref={ref}>
            <button onClick={() => setNodeHeaderColspan(prev => !prev)}>Toggle nodeHeader colspan</button>
            <TreeGridView
                source={source}
                navigation={navigation}
                columns={columns}
                nodeHeader={nodeHeader}
                nodeHeaderColspanCallback={nodeHeaderColspanCallback}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
            />
        </div>
    );
}

export default React.forwardRef(Demo);
