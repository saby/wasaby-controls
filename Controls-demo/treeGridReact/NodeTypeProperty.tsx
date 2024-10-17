import * as React from 'react';

import 'Controls/gridReact';
import { Model } from 'Types/entity';
import { IColumnConfig } from 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { data } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';
import { TColspanCallback } from 'Controls/grid';

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const source = React.useMemo(() => {
        return new ExpandedSource({
            parentProperty: 'parent',
            keyProperty: 'key',
            data,
        });
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(
        () => [
            {
                key: 'title',
                width: '300px',
                displayProperty: 'title',
                groupNodeConfig: {
                    textAlign: 'center',
                },
            },
            {
                width: '100px',
                displayProperty: 'count',
                getCellProps: () => {
                    return {
                        halign: 'end',
                    };
                },
            },
            {
                width: '100px',
                displayProperty: 'price',
                getCellProps: () => {
                    return {
                        halign: 'end',
                    };
                },
            },
            {
                width: '100px',
                displayProperty: 'price1',
                getCellProps: () => {
                    return {
                        halign: 'end',
                    };
                },
            },
            {
                width: '100px',
                displayProperty: 'price2',
                getCellProps: () => {
                    return {
                        halign: 'end',
                    };
                },
            },
            {
                width: '50px',
                displayProperty: 'tax',
                getCellProps: () => {
                    return {
                        halign: 'end',
                    };
                },
            },
            {
                width: '100px',
                displayProperty: 'price3',
                halign: 'right',
                getCellProps: () => {
                    return { fontSize: 's', halign: 'end' };
                },
            },
        ],
        []
    );

    const colspanCallback = React.useCallback<TColspanCallback>(
        (item: Model, column: IColumnConfig, columnIndex: number) => {
            if (item.get('nodeType') === 'group' && columnIndex === 0) {
                return 3;
            }
            return 1;
        },
        []
    );

    return (
        <div ref={ref}>
            <TreeGridView
                source={source}
                columns={columns}
                keyProperty={'key'}
                nodeProperty={'type'}
                parentProperty={'parent'}
                nodeTypeProperty={'nodeType'}
                colspanCallback={colspanCallback}
            />
        </div>
    );
}

export default React.forwardRef(Demo);
