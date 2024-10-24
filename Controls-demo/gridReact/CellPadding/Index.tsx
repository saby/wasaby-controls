import * as React from 'react';

import 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getColumns, getItems, getHeader } from './Data';
import { useMemo } from 'react';

function ResultsDemo() {
    const items = useMemo(() => getItems(), [getItems]);
    const columns = useMemo(() => getColumns(), [getColumns]);
    const header = useMemo(() => getHeader(), [getHeader]);

    return (
        <div className="controlsDemo__wrapper" style={{ maxWidth: '500px' }}>
            <ScrollContainer>
                <div className="controlsDemo__inline-flex">
                    <GridItemsView
                        items={items}
                        columns={columns}
                        header={header}
                        rowSeparatorSize="s"
                        columnSeparatorSize="s"
                    />
                </div>
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
