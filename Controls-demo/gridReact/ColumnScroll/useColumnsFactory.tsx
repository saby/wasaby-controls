import * as React from 'react';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';

export default function useColumnsFactory<T extends IColumnConfig | IHeaderConfig>(
    fixedColumns: T[],
    scrollableColumnConstructorCallback: (index: number) => T,
    columnsCount: number
) {
    return React.useMemo<T[]>(() => {
        const columns = [...fixedColumns];

        for (let i = fixedColumns.length; i < columnsCount; i++) {
            columns.push(scrollableColumnConstructorCallback(i));
        }

        return columns;
    }, [fixedColumns, columnsCount, scrollableColumnConstructorCallback]);
}
