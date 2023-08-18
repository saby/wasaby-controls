import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Logger } from 'UI/Utils';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Model } from 'Types/entity';

import { getSourceWithMetaData as getSource } from '../resources/BillsOrdersData';
import MainHeaderCell from './CellRenders/MainHeaderCell';
import DateNumberCell from './CellRenders/DateNumberCell';
import MainDataCell from './CellRenders/MainDataCell';
import SumStateCell from './CellRenders/SumStateCell';
import EditCell from './CellRenders/EditCell';
import ResultCell from './CellRenders/ResultCell';

import { useColumnScrollGridPropsEditor } from '../Dev/Editors/GridColumnScrollEditor';

import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { EdgeState, DebugLogger } from 'Controls/columnScrollReact';
import 'Controls/gridColumnScroll';

const SOURCE: Memory = getSource();
const COLUMNS_COUNT = 50;

const NOT_EDITABLE_ITEMS_KEY = [
    '2626c5cb-a665-4426-b3a6-9b9f8204ad9c',
    '72fb6caa-4211-4a67-aa29-62e4639f000e',
    '51be641a-80bb-46cf-bb93-23a391bf33da',
    '129360bd-63bb-46a5-8643-46c00f8f7e33',
];

function useColumnsFactory(
    fixedColumns: IColumnConfig[],
    scrollableColumnConstructorCallback: (index: number) => IColumnConfig,
    columnsCount: number
) {
    return React.useMemo<IColumnConfig[]>(() => {
        const columns = [...fixedColumns];

        for (let i = fixedColumns.length; i < columnsCount; i++) {
            columns.push(scrollableColumnConstructorCallback(i));
        }

        return columns;
    }, [columnsCount]);
}

const CUSTOM_EVENTS = ['onHoveredCellChanged'];

function Index(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const grid = React.useRef();
    DebugLogger.setDebug(true);

    const [viewportWidth, setViewportWidth] = React.useState<number>(800);

    const { gridColumnScrollPropsEditor, gridColumnScrollProps } = useColumnScrollGridPropsEditor(
        {
            columnScrollViewMode: 'scrollbar',
            stickyColumnsCount: 2,
            endStickyColumnsCount: 0,
            stickyHeader: true,
            columnsCount: COLUMNS_COUNT,
            resultsPosition: 'top',
            resizerVisibility: true,
            rowSeparatorSize: 'null',
            columnSeparatorSize: 'null',
            columnScrollStartPosition: undefined,
            dragScrolling: undefined,
            multiSelectVisibility: 'hidden',
        },
        grid
    );

    const [columnsCount, setColumnsCount] = React.useState(gridColumnScrollProps.columnsCount);

    React.useEffect(() => {
        setColumnsCount(gridColumnScrollProps.columnsCount);
    }, [gridColumnScrollProps.columnsCount]);

    const getRowProps = React.useCallback<TGetRowPropsCallback>((item) => {
        return {
            actionsClassName: 'controls-itemActionsV_position_topRight',
        };
    }, []);

    const onEdgesStateChanged = React.useCallback(
        (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => {
            Logger.info(`leftEdgeState=${leftEdgeState}, rightEdgeState=${rightEdgeState}`);
        },
        []
    );

    const columns = useColumns(columnsCount, gridColumnScrollProps.stickyColumnsCount);
    const header = useHeader(columnsCount);
    const results = useResults(columnsCount);

    const onHoveredCellChanged = React.useCallback(
        (
            item: Model,
            itemContainer: HTMLDivElement | null,
            cellIndex: number
        ) => {
            console.log(item ? 'key: ' + item.getKey() + '; cell: ' + cellIndex : 'null');
        },
        []
    );

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>

            {gridColumnScrollPropsEditor}

            <div>
                Viewport width:
                <input
                    type={'range'}
                    max={1300}
                    min={500}
                    value={viewportWidth}
                    onChange={(e) => setViewportWidth(Number(e.target.value))}
                />
            </div>

            <ScrollContainer
                className="controlsDemo__height500"
                attrs={{
                    style: `width: ${viewportWidth}px;`
                }}
                content={
                    <GridView
                        ref={grid}
                        header={header}
                        results={results}
                        columns={columns}
                        source={SOURCE}
                        columnScroll={true}
                        onEdgesStateChanged={onEdgesStateChanged}
                        getRowProps={getRowProps}
                        onHoveredCellChanged={onHoveredCellChanged}
                        customEvents={CUSTOM_EVENTS}
                        editingConfig={{
                            editOnClick: true,
                            mode: 'cell',
                        }}
                        {...gridColumnScrollProps}
                    />
                }
            />
        </div>
    );
}

const useColumns = (columnsCount: number, stickyColumnsCount: number) => {
    const columns = useColumnsFactory(
        [
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
                width: '260px',
                render: <MainDataCell />,
            },
        ],
        (index: number) => ({
            key: `sum-state-${index}`,
            render: <SumStateCell cellNumber={index} />,
            editorRender: <EditCell property={'sum'} />,
            getCellProps: (_item) => {
                return {
                    editable: NOT_EDITABLE_ITEMS_KEY.indexOf(_item.getKey()) === -1,
                };
            },
        }),
        columnsCount
    );

    return React.useMemo(() => {
        const patchedColumns = [...columns];
        const resizers = {
            1: {
                minWidth: 75,
                maxWidth: 150,
            },
            2: {
                minWidth: 230,
                maxWidth: 500,
            },
            3: {
                minWidth: 60,
                maxWidth: 150,
            },
            4: {
                minWidth: 60,
                maxWidth: 150,
            },
        };
        patchedColumns[2].width = '75px';
        patchedColumns[3].width = '90px';

        patchedColumns[stickyColumnsCount - 1] = {
            ...patchedColumns[stickyColumnsCount - 1],
            ...resizers[stickyColumnsCount],
        };

        return patchedColumns;
    }, [columns, stickyColumnsCount]);
};

const useHeader = (columnsCount: number) =>
    useColumnsFactory(
        [
            {
                key: 'header-date-number',
                caption: 'Дата',
            },
            {
                key: 'header-main-data',
                caption: 'Организация',
                render: <MainHeaderCell />,
            },
        ],
        (index) => ({
            key: `sum-state-${index}`,
            caption: `№${index}`,
        }),
        columnsCount
    );

const useResults = (columnsCount: number) =>
    useColumnsFactory(
        [
            {
                key: 'results-date-number',
                caption: 'Дата',
            },
            {
                key: 'results-main-data',
                caption: 'Организация',
                render: <ResultCell property={'secondFixed'} />,
            },
        ],
        (index) => ({
            key: `sum-state-${index}`,
            render: <ResultCell property={`scrollable_${(index % 3) as 0 | 1 | 2}`} />,
        }),
        columnsCount
    );

export default React.forwardRef(Index);
