import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import 'Controls/masterDetail';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IVirtualScrollConfig } from 'Controls/baseList';

import { getItems } from './resources/CountriesData';

function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const items = React.useMemo<RecordSet>(() => {
        return getItems();
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return [
            {
                key: 'key',
                displayProperty: 'key',
                width: '50px',
            },
            {
                key: 'country',
                displayProperty: 'country',
            },
        ];
    }, []);
    const virtualScrollConfig = React.useMemo<IVirtualScrollConfig>(() => {
        return {
            pageSize: 20,
        };
    }, []);

    // TODO style=master нужен просто чтобы у стики блока был правильный фон,
    //  нужно будет удалить когда поддержим master

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer
                className={'controlsDemo__height500 controlsDemo__width800px'}
            >
                <GridView
                    columns={columns}
                    items={items}
                    virtualScrollConfig={virtualScrollConfig}
                    stickyMarkedItem
                    style={'master'}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(StickyCallbackDemo);
