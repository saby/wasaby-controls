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
    const nodeFooter = React.useMemo<INodeFooterConfig[]>(() => {
        return [
            { key: 'node_footer_1', render: <i>Node footer cell</i> },
            { key: 'node_footer_2', render: <i>Node footer cell</i> },
            { key: 'node_footer_3', render: <i>Node footer cell</i> },
        ];
    }, []);

    const [nodeFooterColspan, setNodeFooterColspan] = React.useState(false);
    const nodeFooterColspanCallback = React.useCallback<TColspanCallback>(
        (node: Model, column: IColumnConfig, columnIndex: number) => {
            if (nodeFooterColspan) {
                return 'end';
            }
        },
        [nodeFooterColspan]
    );

    return (
        <div ref={ref}>
            <button onClick={() => setNodeFooterColspan(prev => !prev)}>Toggle nodeFooter colspan</button>
            <TreeGridView
                source={source}
                navigation={navigation}
                columns={columns}
                nodeFooter={nodeFooter}
                nodeFooterColspanCallback={nodeFooterColspanCallback}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
            />
        </div>
    );
}

export default React.forwardRef(Demo);
