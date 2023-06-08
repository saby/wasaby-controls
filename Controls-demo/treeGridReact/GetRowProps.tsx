import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';

import { getBaseColumns, getBaseRecordSet } from './Data';

const items = getBaseRecordSet();

const INITIAL_COLUMNS: IColumnConfig[] = getBaseColumns();

export default React.forwardRef(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const [getRowPropsCalledCount, setGetRowPropsCalledCount] =
            React.useState(0);
        const getRowProps = React.useCallback(() => {
            setGetRowPropsCalledCount((prev) => {
                return prev + 1;
            });
        }, [setGetRowPropsCalledCount]);

        return (
            <div ref={ref}>
                <div>{`getRowProps called ${getRowPropsCalledCount} times`}</div>
                <TreeGridItemsView
                    items={items}
                    columns={INITIAL_COLUMNS}
                    root={null}
                    keyProperty={'key'}
                    nodeProperty={'type'}
                    parentProperty={'parent'}
                    getRowProps={getRowProps}
                />
            </div>
        );
    }
);
