import * as React from 'react';

import 'Controls/gridReact';
import { TGetRowPropsCallback } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getColumns, getItems } from './Data';
import { Model } from 'Types/entity';

interface IDemoProps {
    stickyResults?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

function ResultsDemo(props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [items, setItems] = React.useState(getItems());
    const [columns, setColumns] = React.useState(getColumns());
    const [hoveredCellInfo, setHoveredCellInfo] = React.useState('');

    function onHoveredCellChanged(item: Model, itemContainer, columnIndex: number): void {
        setHoveredCellInfo(item ? 'key: ' + item.getKey() + '; cell: ' + columnIndex : 'null');
    }

    return (
        <div ref={ref}>
            <div className="controlsDemo-toolbar-panel">
                Ховер на колонке c id⇒{hoveredCellInfo}
            </div>
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    onHoveredCellChanged={onHoveredCellChanged}
                    customEvents={['onHoveredCellChanged']}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
