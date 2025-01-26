import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IColumnConfig, ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getColumns, getItems } from './Data';

const items = getItems();
const columns: IColumnConfig[] = getColumns();

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
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
