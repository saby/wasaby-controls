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

function Demo(_props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => {
        return getItems();
    }, []);
    const columns = React.useMemo(() => {
        return getColumns();
    }, []);

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

export default React.forwardRef(Demo);
