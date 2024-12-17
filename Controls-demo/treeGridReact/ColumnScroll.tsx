import * as React from 'react';
import 'Controls/gridColumnScroll';

import { Container as ScrollContainer } from 'Controls/scroll';
import { View as TreeGridItemsView } from 'Controls/treeGrid';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { getBaseColumns, getBaseRecordSet } from './Data';
import { Money, Number } from 'Controls/baseDecorator';
import { Model } from 'Types/entity';

const items = getBaseRecordSet();

function SumStateCell(props: { cellNumber: number }) {
    const { renderValues } = useItemData<
        Model<{
            sum: number;
            icons: string[];
        }>
    >(['sum', 'icons']);
    return (
        <div className={'ws-flexbox ws-justify-content-between'} style={{ width: '100%' }}>
            <Number value={props.cellNumber} fontColorStyle={'secondary'} fontWeight={'bold'} /> -
            <Money value={renderValues.sum} fontColorStyle={'secondary'} fontWeight={'bold'} />
        </div>
    );
}

function getColumns(): IColumnConfig[] {
    const baseColumns: IColumnConfig[] = getBaseColumns();
    baseColumns[0].width = '120px';
    baseColumns[1].width = '50px';
    baseColumns[2].width = '150px';
    for (let i = baseColumns.length; i < 50; i++) {
        baseColumns.push({
            key: `sum-state-${i}`,
            width: '100px',
            render: <SumStateCell cellNumber={i + 1} />,
        });
    }
    return baseColumns;
}

const INITIAL_COLUMNS: IColumnConfig[] = getColumns();

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <ScrollContainer
                className="controlsDemo__height500 controlsDemo__width800px"
                content={
                    <TreeGridItemsView
                        items={items}
                        columns={INITIAL_COLUMNS}
                        keyProperty="key"
                        nodeProperty="type"
                        parentProperty="parent"
                        columnScroll={true}
                        columnScrollViewMode="arrows"
                        stickyColumnsCount={3}
                    />
                }
            />
        </div>
    );
});
