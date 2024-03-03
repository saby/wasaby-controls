import * as React from 'react';

import 'Controls/gridReact';
import { TGetRowPropsCallback } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getColumns, getItems } from './Data';

interface IDemoProps {
    stickyResults?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

function ResultsDemo(props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [items, setItems] = React.useState(getItems());
    const [columns, setColumns] = React.useState(getColumns());

    return (
        <div ref={ref}>
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    ladderProperties={['photo', 'date']}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);