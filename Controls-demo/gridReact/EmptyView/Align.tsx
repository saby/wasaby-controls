import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IEmptyViewConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { THorizontalAlign } from 'Controls/interface';

import { getColumns, getEmptyItems } from 'Controls-demo/gridReact/resources/EmptyData';

function getEmptyViewOnWholeRow(halign: THorizontalAlign): IEmptyViewConfig[] {
    return [
        {
            render: <div>Пустое представление на всю таблицу</div>,
            startColumn: 1,
            endColumn: 4,
            getCellProps: () => ({ halign }),
        },
    ];
}

function EmptyGrid({ halign }: { halign: THorizontalAlign }) {
    const items = React.useMemo(() => getEmptyItems(), []);
    const columns = React.useMemo<IColumnConfig[]>(() => getColumns(), []);
    const emptyView = React.useMemo(() => getEmptyViewOnWholeRow(halign), []);

    return <GridItemsView items={items} columns={columns} emptyView={emptyView} />;
}

function AlignEmptyView(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            Horizontal align is start:
            <EmptyGrid halign={'start'} />
            Horizontal align is center:
            <EmptyGrid halign={'center'} />
            Horizontal align is end:
            <EmptyGrid halign={'end'} />
        </div>
    );
}

export default React.forwardRef(AlignEmptyView);
