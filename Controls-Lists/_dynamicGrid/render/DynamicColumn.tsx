import * as React from 'react';
import { factory } from 'Types/chain';
import { IColumnConfig, useRenderData as useGridRenderData } from 'Controls/gridReact';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import {
    datesEqualByQuantum,
    getPositionInPeriod,
    TColumnDataDensity,
    TQuantumType,
} from './utils';
import {
    RowSelectionContextProvider,
    IRowSelectionContextProviderProps,
} from '../selection/rowContext/RowSelectionContextProvider';
import { SelectionCheckbox } from '../selection/SelectionCheckbox';
import { SelectionIndicator } from '../selection/SelectionIndicator';
import { IItemsRange } from 'Controls/baseList';
import { GAP_SIZES_MAP } from '../constants';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';

const CLASS_DYNAMIC_DATA_CELL = 'ControlsLists-dynamicGrid__dynamicDataCell';

interface IDynamicCellsProps {
    render: React.ReactElement;
    dataProperty: string;
    displayProperty: string;
    dynamicColumnsGridData: unknown[];
    visibleRange: IItemsRange;
    columnDataDensity: TColumnDataDensity;
}

export const DynamicCells = React.memo(function MemoizedDynamicColumn(
    props: IDynamicCellsProps
): React.ReactElement {
    const { render, dataProperty, dynamicColumnsGridData, columnDataDensity } = props;
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
                            {render && columnDataDensity !== 'empty'
                                ? React.cloneElement(render, renderProps)
                                : null}
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
    columnWidth: number;
}

interface IGetPreparedDynamicColumnProps extends IBaseDynamicColumnProps {
    dataProperty: string;
    columnIndex: number;
    dynamicColumnsGridData: unknown[];
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    quantum: string;
    columnDataDensity: TColumnDataDensity;
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
                    let startContentCropped = false;
                    let endContentCropped = false;
                    let columnStartIndex = -1;
                    let columnEndIndex = -1;

                    // Событие не попало в отрисованный диапазон ячеек
                    if (
                        startDate > dynamicColumnsGridData[dynamicColumnsGridData.length - 1] ||
                        endDate < dynamicColumnsGridData[0]
                    ) {
                        return null;
                    }

                    // Если дата начала раньше, чем дата в первой ячейке, считаем ячейкой начала первую
                    if (startDate < dynamicColumnsGridData[0]) {
                        endCropped = true;
                        columnStartIndex = 0;
                    }

                    // Если дата конца позже, чем дата в последней ячейке, считаем ячейкой конца первую
                    if (endDate > dynamicColumnsGridData[dynamicColumnsGridData.length - 1]) {
                        startCropped = true;
                        columnEndIndex = dynamicColumnsGridData.length;
                    }

                    if (columnStartIndex === -1) {
                        columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
                            return datesEqualByQuantum(
                                startDate,
                                d as Date,
                                props.quantum as TQuantumType
                            );
                        });
                    }
                    if (columnEndIndex === -1) {
                        columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
                            return datesEqualByQuantum(
                                endDate,
                                d as Date,
                                props.quantum as TQuantumType
                            );
                        });
                    }

                    let contentStartIndex = columnStartIndex;
                    let contentEndIndex = columnEndIndex;
                    let contentVisible = true;

                    // Событие не попало в видимую часть таймлайна
                    if (props.endIndex < contentStartIndex || props.startIndex > contentEndIndex) {
                        contentVisible = false;
                    }

                    // Обрезаем контент по границам видимой части
                    if (props.endIndex < contentEndIndex) {
                        endContentCropped = true;
                        contentEndIndex = props.endIndex;
                    }
                    if (props.startIndex > contentStartIndex) {
                        startContentCropped = true;
                        contentStartIndex = props.startIndex;
                    }
                    const span = columnEndIndex - columnStartIndex + 1;
                    const contentSpan = contentEndIndex - contentStartIndex + 1;

                    // Отступами слева и справа выравниваем границы события
                    const startOffset = getPositionInPeriod(
                        startDate,
                        props.quantum as TQuantumType
                    );
                    const endOffset = getPositionInPeriod(endDate, props.quantum as TQuantumType);
                    const marginLeft = startCropped ? '0' : `calc(100% / ${span} * ${startOffset})`;
                    const marginRight = endCropped
                        ? '0'
                        : `calc(100% / ${span} * ${1 - endOffset})`;

                    // Ширина видимой части события, доступная для отрисовки контента
                    const width = contentVisible
                        ? props.columnWidth *
                          (contentSpan -
                              (startContentCropped ? 0 : startOffset) -
                              (endContentCropped ? 0 : 1 - endOffset))
                        : 0;

                    // Считаем отступ до начала видимой части события
                    const offsetSpan =
                        contentStartIndex > columnStartIndex
                            ? contentStartIndex - columnStartIndex
                            : 0;
                    const contentOffset =
                        contentVisible && offsetSpan
                            ? props.columnWidth *
                              (offsetSpan - (startContentCropped ? startOffset : 0))
                            : 0;

                    const renderProps = {
                        item,
                        event,
                        width,
                        contentOffset,
                    };
                    return (
                        <div
                            data-key={event.getKey()}
                            key={value.getKey()}
                            className={CLASS_DYNAMIC_DATA_CELL}
                            style={{
                                marginLeft,
                                marginRight,
                                gridColumnStart: columnStartIndex + 1,
                                gridColumnEnd: columnStartIndex + span + 1,
                                gridRow: 1,
                                pointerEvents: 'none',
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
    const { dataProperty, children } = props;
    const { item } = useGridRenderData([dataProperty]);
    const itemKey = item.getKey();

    return (
        <RowSelectionContextProvider
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
        eventRender,
        eventsProperty,
        eventStartProperty,
        eventEndProperty,
        columnsSpacing,
        quantum,
        columnDataDensity,
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
                quantum={quantum as TQuantumType}
            >
                <>
                    <DynamicCells
                        render={dynamicColumn.render}
                        displayProperty={dynamicColumn.displayProperty}
                        dataProperty={dataProperty}
                        dynamicColumnsGridData={dynamicColumnsGridData}
                        columnDataDensity={columnDataDensity}
                    />
                    {eventsProperty ? (
                        <EventsCells
                            render={eventRender}
                            endIndex={visibleRange.endIndex}
                            startIndex={visibleRange.startIndex}
                            eventsProperty={eventsProperty}
                            eventStartProperty={eventStartProperty}
                            eventEndProperty={eventEndProperty}
                            columnWidth={
                                parseInt(dynamicColumn.width, 10) + GAP_SIZES_MAP[columnsSpacing]
                            }
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
