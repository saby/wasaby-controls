import * as React from 'react';

import { EdgeState } from 'Controls/columnScrollReact';

import { TInternalProps } from 'UICore/Executor';
import { getArgs, SyntheticEvent } from 'UI/Events';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { ItemsEntity } from 'Controls/dragnDrop';
import { ISelectionObject } from 'Controls/interface';

import { getSource } from '../resources/BillsOrdersData';
import DateNumberCell from './CellRenders/DateNumberCell';
import MainDataCell from './CellRenders/MainDataCell';
import SumStateCell from './CellRenders/SumStateCell';
import { useColumnScrollGridPropsEditor } from '../Dev/Editors/GridColumnScrollEditor';

import { Logger } from 'UI/Utils';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';

const SOURCE: Memory = getSource();

function Index(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const grid = React.useRef();
    let items: RecordSet;
    const dataLoadCallback = React.useCallback((_items: RecordSet) => {
        items = _items;
    }, [items]);
    const { gridColumnScrollPropsEditor, gridColumnScrollProps } =
        useColumnScrollGridPropsEditor(
            {
                columnScrollViewMode: 'arrows',
                stickyColumnsCount: 2,
            },
            grid
        );

    const getRowProps = React.useCallback<TGetRowPropsCallback>((item) => {
        return {
            actionsClassName: 'controls-itemActionsV_position_topRight',
        };
    }, []);

    const onEdgesStateChanged = React.useCallback(
        (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => {
            Logger.info(
                `leftEdgeState=${leftEdgeState}, rightEdgeState=${rightEdgeState}`
            );
        },
        []
    );

    const header = React.useMemo<IColumnConfig[]>(() => {
        const fixedColumns = [
            {
                key: 'header-date-number',
                caption: 'Дата',
            },
            {
                key: 'header-main-data',
                caption: 'Организация',
            },
        ];

        const scrollableColumns = [];

        for (let i = 0; i < 43; i++) {
            scrollableColumns.push({
                key: `sum-state-${i}`,
                caption: `№${i + 3}`,
            });
        }

        return fixedColumns.concat(scrollableColumns);
    }, []);

    const columns = React.useMemo<IColumnConfig[]>(() => {
        const fixedColumns = [
            {
                key: 'date-number',
                width: '85px',
                render: <DateNumberCell />,
                getCellProps: (_item) => {
                    return { halign: 'right' };
                },
            },
            {
                key: 'main-data',
                width: '250px',
                render: <MainDataCell />,
            },
        ];

        const scrollableColumns = [];

        for (let i = 0; i < 43; i++) {
            scrollableColumns.push({
                key: `sum-state-${i}`,
                render: <SumStateCell cellNumber={i + 3} />,
            });
        }

        return fixedColumns.concat(scrollableColumns);
    }, []);

    // region eventHandlers

    const onDragStart = React.useCallback((event: SyntheticEvent) => {
        const [_, movedKeys] = getArgs(event);
        const firstItem = items.getRecordById(movedKeys[0]);

        return new ItemsEntity({
            items: movedKeys,
            title: `${firstItem.get('capital')} (${firstItem.get('country')})`
        });
    }, [items]);

    const onDragEnd = React.useCallback((event: SyntheticEvent) => {
        const [_, entity, target, position] = getArgs(event);
        const selection: ISelectionObject = {
            selected: entity.getItems(),
            excluded: []
        };
        grid.current?.moveItems(selection, target.getKey(), position);
    }, [items]);

    // endregion eventHandlers

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <style>{'.controls-VScrollbar_horizontal { top: 0; }'}</style>

            {gridColumnScrollPropsEditor}

            <ScrollContainer
                className="controlsDemo__height500 controlsDemo__width800px"
                content={
                    <GridView
                        ref={grid}
                        header={header}
                        columns={columns}
                        source={SOURCE}
                        columnScroll={true}
                        onEdgesStateChanged={onEdgesStateChanged}
                        multiSelectVisibility={'visible'}
                        getRowProps={getRowProps}
                        dataLoadCallback={dataLoadCallback}
                        itemsDragNDrop={true}
                        dragScrolling={true}
                        onCustomdragStart={onDragStart}
                        onCustomdragEnd={onDragEnd}
                        customEvents={['onCustomdragStart', 'onCustomdragEnd']}
                        {...gridColumnScrollProps}
                    />
                }
            />
        </div>
    );
}

export default React.forwardRef(Index);
