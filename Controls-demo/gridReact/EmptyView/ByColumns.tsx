import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IEmptyViewConfig, IEmptyViewProps } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { getColumns, getEmptyItems } from 'Controls-demo/gridReact/resources/EmptyData';

function getEmptyViewOnWholeRow(): IEmptyViewConfig[] {
    return [
        {
            key: 'first_cell',
            render: <div>Первая ячейка</div>,
        },
        {
            key: 'second_cell',
            render: <div>Вторая ячейка пустого представления</div>,
        },
        {
            key: 'third_cell',
            render: <div>Третья ячейка пустого представления</div>,
        },
    ];
}

function EmptyViewByColumns(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => getEmptyItems(), []);
    const columns = React.useMemo<IColumnConfig[]>(() => getColumns(), []);
    const emptyView = React.useMemo(() => getEmptyViewOnWholeRow(), []);
    const emptyViewProps = React.useMemo<IEmptyViewProps>(
        () => ({
            padding: {
                top: '2xl',
                bottom: 'xl',
            },
        }),
        []
    );

    return (
        <div ref={ref}>
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    emptyView={emptyView}
                    emptyViewProps={emptyViewProps}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(EmptyViewByColumns);
