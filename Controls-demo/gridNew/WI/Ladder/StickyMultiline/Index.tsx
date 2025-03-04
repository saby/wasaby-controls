import * as React from 'React';
import { TInternalProps } from 'UICore/Executor';
import { IColumnConfig, ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getColumns, getItems } from './Data';

const items = getItems();
const columns: IColumnConfig[] = getColumns();

function ResultsDemo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <div className="controlsDemo__wrapper">
                <ScrollContainer className={'controlsDemo__height300'}>
                    <GridItemsView
                        items={items}
                        columns={columns}
                        ladderProperties={['date', 'time']}
                    />
                </ScrollContainer>
            </div>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
