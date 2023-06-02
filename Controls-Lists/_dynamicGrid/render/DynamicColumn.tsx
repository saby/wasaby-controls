import * as React from 'react';
import { factory } from 'Types/chain';
import { IColumnConfig, useRenderData as useGridRenderData } from 'Controls/gridReact';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { datesEqualByQuantum, getPositionInPeriod, TQuantumType } from './utils';
import {
    RowSelectionContextProvider,
    IRowSelectionContextProviderProps,
} from '../selection/rowContext/RowSelectionContextProvider';
import { SelectionCheckbox } from '../selection/SelectionCheckbox';
import { SelectionIndicator } from '../selection/SelectionIndicator';
import {IItemsRange} from 'Controls/baseList';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';

const CLASS_DYNAMIC_DATA_CELL = 'ControlsLists-dynamicGrid__dynamicDataCell';

interface IDynamicCellsProps {
    render: React.ReactElement;
    dataProperty: string;
    displayProperty: string;
    dynamicColumnsGridData: unknown[];
    visibleRange: IItemsRange;
}

export const DynamicCells = React.memo(function MemoizedDynamicColumn(
    props: IDynamicCellsProps
): React.ReactElement {
    const { render, dataProperty, dynamicColumnsGridData } = props;
    const { renderValues, item } = useGridRenderData([dataProperty]);
    const dynamicColumnsData = renderValues[dataProperty];

    if (!dynamicColumnsData) {
        return null;
    }

    return (
        <>
            {factory(dynamicColumnsGridData)
                .map((value, index: number) => {
                    const date = dynamicColumnsGridData[index] as Date;
                    const columnData = dynamicColumnsData
                        ? dynamicColumnsData.getRecordById(date)
                        : null;
                    const renderProps = {
                        item,
                        date,
                        columnData,
                    };
                    const columnKey = date.getTime();
                    // todo Сделать получение значений для рендера через хук
                    return (
                        <div
                            key={columnKey}
                            className={CLASS_DYNAMIC_DATA_CELL}
                            style={{
                                gridColumn: index + 1,
                                gridRow: 1,
                            }}
                        >
                            {React.cloneElement(render, renderProps)}
                            <div className="ControlsLists-dynamicGrid__selectionCheckbox__wrapper">
                                <SelectionCheckbox columnKey={columnKey} />
                            </div>
                        </div>
                    );
                })
                .value()}
        </>
    );
});

export interface IEventsConfig {
    render: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    endIndex: number;
    startIndex: number;
    columnWidth: string;
}

interface IGetPreparedDynamicColumnProps extends IBaseDynamicColumnProps {
    dataProperty: string;
    columnIndex: number;
    dynamicColumnsGridData: unknown[];
    eventsConfig?: IEventsConfig;
    quantum: string;
}

export const EventsCells = React.memo(function MemoizedEventsCells(
    props: IEventsConfig & IDynamicCellsProps & { quantum: string }
): React.ReactElement {
    const { render, dataProperty, dynamicColumnsGridData } = props;
    const { item } = useGridRenderData([dataProperty]);

    const events = item.get(props.eventsProperty);
    if (!events || events.getCount() === 0) {
        return null;
    }

    return (
        <>
            {factory(events)
                .map((value) => {
                    const event = value;
                    const startDate = value.get(props.eventStartProperty);
                    const endDate = value.get(props.eventEndProperty);
                    let startCropped = false;
                    let endCropped = false;
                    let columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
                        return datesEqualByQuantum(
                            startDate,
                            d as Date,
                            props.quantum as TQuantumType
                        );
                    });
                    let columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
                        return datesEqualByQuantum(
                            endDate,
                            d as Date,
                            props.quantum as TQuantumType
                        );
                    });
                    if (columnStartIndex === -1 && columnEndIndex === -1) {
                        return null;
                    }
                    if (columnStartIndex === -1) {
                        columnStartIndex = 0;
                    }
                    if (columnEndIndex === -1) {
                        columnEndIndex = dynamicColumnsGridData.length;
                    }
                    if (
                        props.endIndex < columnStartIndex ||
                        props.startIndex > columnEndIndex
                    ) {
                        return null;
                    }
                    if (props.endIndex < columnEndIndex) {
                        endCropped = true;
                        columnEndIndex = props.endIndex;
                    }
                    if (props.startIndex > columnStartIndex) {
                        startCropped = true;
                        columnStartIndex = props.startIndex;
                    }
                    const span = columnEndIndex - columnStartIndex + 1;
                    const startOffset = getPositionInPeriod(
                        startDate,
                        props.quantum as TQuantumType
                    );
                    const endOffset = getPositionInPeriod(endDate, props.quantum as TQuantumType);
                    const marginLeft = startCropped ? '0' : `calc(100% / ${span} * ${startOffset})`;
                    const marginRight = endCropped
                        ? '0'
                        : `calc(100% / ${span} * ${1 - endOffset})`;
                    const width =
                        parseInt(props.columnWidth, 10) *
                        (span -
                            (startCropped ? 0 : startOffset) -
                            (endCropped ? 0 : 1 - endOffset));
                    const renderProps = {
                        item,
                        event,
                        width,
                    };
                    return (
                        <div
                            key={value.getKey()}
                            className={CLASS_DYNAMIC_DATA_CELL}
                            style={{
                                marginLeft,
                                marginRight,
                                gridColumnStart: columnStartIndex + 1,
                                gridColumnEnd: columnStartIndex + span + 1,
                                gridRow: 1,
                                pointerEvents: 'none'
                            }}
                        >
                            {React.cloneElement(render, renderProps)}
                        </div>
                    );
                })
                .value()}
        </>
    );
});

const RowSelectionContextProviderWrapper = React.memo(function (
    props: Omit<IRowSelectionContextProviderProps, 'itemKey'> & {
        dataProperty: string;
    }
) {
    const { dataProperty, dynamicColumnsGridData, children } = props;
    const { item } = useGridRenderData([dataProperty]);
    const itemKey = item.getKey();

    return (
        <RowSelectionContextProvider
            dynamicColumnsGridData={dynamicColumnsGridData as Date[]}
            children={children}
            itemKey={itemKey}
            quantum={props.quantum}
        />
    );
});

/**
 * Функция генерации колонки основного Grid, предназначенной для вывода динамических колонок.
 * Шаблон данной колонки представляет собой Grid-layout, выводящий внутри себя набор динамических колонок
 * отрисовываемой строки.
 * @param props
 */
export function getPreparedDynamicColumn(props: IGetPreparedDynamicColumnProps): IColumnConfig {
    const {
        dataProperty,
        columnIndex,
        visibleRange,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        eventsConfig,
        columnsSpacing,
        quantum,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: dynamicColumn.getCellProps,
        width: 'max-content',
        key: DYNAMIC_COLUMN_PREFIX + columnIndex,
        render: (
            <RowSelectionContextProviderWrapper
                dataProperty={dataProperty}
                dynamicColumnsGridData={dynamicColumnsGridData as Date[]}
                quantum={quantum as TQuantumType}
            >
                <>
                    <DynamicCells
                        render={dynamicColumn.render}
                        displayProperty={dynamicColumn.displayProperty}
                        dataProperty={dataProperty}
                        dynamicColumnsGridData={dynamicColumnsGridData}
                    />
                    {eventsConfig ? (
                        <EventsCells
                            render={eventsConfig.render}
                            endIndex={visibleRange.endIndex}
                            startIndex={visibleRange.startIndex}
                            eventsProperty={eventsConfig.eventsProperty}
                            eventStartProperty={eventsConfig.eventStartProperty}
                            eventEndProperty={eventsConfig.eventEndProperty}
                            columnWidth={dynamicColumn.width}
                            dataProperty={dataProperty}
                            // Ширина динамических ячеек берется из настроек динамической колонки
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            quantum={quantum}
                        />
                    ) : null}

                    <SelectionIndicator />
                </>
            </RowSelectionContextProviderWrapper>
        ),
    });
}
