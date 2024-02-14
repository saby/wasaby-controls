import * as React from 'react';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import {
    CellComponent,
    IColumnConfig,
    useItemData as useGridItemData,
    TGetRowPropsCallback,
    TColumnKey,
} from 'Controls/gridReact';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { getDataQa, getPositionInPeriod, getEndDate, getStartDate } from './utils';
import { TQuantumType, TColumnKeys, TColumnDataDensity } from '../shared/types';
import { datesEqualByQuantum } from '../shared/utils/datesEqualByQuantum';
import SelectionCheckboxMemo from '../selection/components/SelectionCheckbox';
import SelectionIndicatorMemo from '../selection/components/SelectionIndicator';
import SelectionResizerMemo from '../selection/dragSelection/components/SelectionResizer';
import { DragSelectionContext } from '../selection/dragSelection/dragSelectionContext/DragSelectionContext';
import RowSelectionContextProviderMemo from '../selection/selectionContext/rowSelectionContext/RowSelectionContextProvider';
import { TGetDynamicCellPropsCallback, THoverMode } from '../interfaces/IDynamicGridComponent';
import { IEventRenderProps, TGetEventRenderPropsCallback } from '../interfaces/IEventRenderProps';
import { IItemsRange } from 'Controls/baseList';
import { getColumnGapSize } from '../utils';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';

export const CLASS_DYNAMIC_DATA_CELL = 'ControlsLists-dynamicGrid__dynamicDataCell';
export const CLASS_EVENT_CELL = 'ControlsLists-dynamicGrid__eventCell';

interface IDynamicCellsProps {
    render: React.ReactElement;
    getCellProps: TGetDynamicCellPropsCallback;
    dataProperty: string;
    displayProperty: string;
    dynamicColumnsGridData: TColumnKeys;
    visibleRange: IItemsRange;
    columnDataDensity: TColumnDataDensity;
    hoverMode: THoverMode;
}

/**
 * Интерфейс Рендера ячейки динамической колонки
 * @interface Controls-Lists/_dynamicGrid/render/DynamicColumn/IDynamicCellRenderProps
 * @template T Тип ключа динамической ячейки
 * @template TData Тип данных динамической ячейки
 * @public
 */
export interface IDynamicCellRenderProps<T = TColumnKey, TData = string> {
    /**
     * Запись списка
     */
    item: Model;
    /**
     * Ключ ячейки динамической колонки
     * @cfg {String}
     * @field Controls-Lists/_dynamicGrid/render/DynamicColumn/IDynamicCellRenderProps#date
     */
    date: T;
    /**
     * Данные ячейки динамической колонки
     * @cfg {String}
     * @field Controls-Lists/_dynamicGrid/render/DynamicColumn/IDynamicCellRenderProps#columnData
     */
    columnData: TData;
}

export const DynamicCells = React.memo(function MemoizedDynamicColumn(
    props: IDynamicCellsProps
): React.ReactElement {
    const {
        render,
        dataProperty,
        dynamicColumnsGridData,
        columnDataDensity,
        getCellProps,
        hoverMode,
    } = props;
    const { renderValues, item } = useGridItemData([dataProperty]);
    const dynamicColumnsData = renderValues[dataProperty];
    const dsContext = React.useContext(DragSelectionContext);
    const dynamicCellClassName = `${CLASS_DYNAMIC_DATA_CELL}${
        hoverMode === 'cross' ? ' ControlsLists-dynamicGrid__cross-vertical-part' : ''
    }`;

    if (!dynamicColumnsData) {
        return null;
    }

    return (
        <>
            {factory(dynamicColumnsGridData)
                .map((value, index: number) => {
                    // В качестве ключа используем index,
                    // чтобы при смене диапазона отображаемых колонок узлы обновлялись, а не ремаунтились.
                    // По производительности это быстрее примерно на 30%.
                    const cellKey = index;

                    const date = dynamicColumnsGridData[index];
                    const columnData = dynamicColumnsData
                        ? dynamicColumnsData.getRecordById(date)
                        : null;
                    const renderProps: IDynamicCellRenderProps = {
                        item,
                        date,
                        columnData,
                    };
                    const cellProps = getCellProps ? getCellProps(item, date) : {};
                    // TODO: Здесь появится еще проверка на string и null, когда даты вынесутся из dynamicGrid.
                    //  Пока такое не требуется.
                    const columnKey = date instanceof Date ? date.toUTCString() : date;
                    const attributes = {
                        'column-key': columnKey,
                        'data-qa': getDataQa('cell', date) + ` ${cellProps.backgroundStyle}`,
                    };
                    const cellRender = (
                        <>
                            {render &&
                                columnDataDensity !== 'empty' &&
                                React.cloneElement(render, renderProps)}
                            {columnDataDensity !== 'empty' && (
                                <SelectionCheckboxMemo
                                    columnKey={columnKey}
                                    className={
                                        'ControlsLists-dynamicGrid__selectionCheckbox ' +
                                        `tw-justify-${
                                            props.columnDataDensity === 'advanced'
                                                ? 'end'
                                                : 'center'
                                        }`
                                    }
                                />
                            )}
                            {columnDataDensity !== 'empty' && (
                                <SelectionResizerMemo columnKey={columnKey} />
                            )}
                        </>
                    );
                    // todo Сделать получение значений для рендера через хук
                    return (
                        <CellComponent
                            {...cellProps}
                            tagClassName={'ControlsLists-dynamicGrid__tag'}
                            hoverMode={'cell'}
                            borderMode={'cell'}
                            paddingLeft={cellProps.padding?.left}
                            paddingRight={cellProps.padding?.right}
                            hoverBackgroundStyle={null}
                            key={cellKey}
                            attributes={attributes}
                            className={dynamicCellClassName}
                            startColspanIndex={index + 1}
                            startRowspanIndex={1}
                            render={cellRender}
                            onMouseMove={(e) => {
                                if (dsContext) {
                                    dsContext.contextRefForHandlersOnly.current.moveDrag(e);
                                }
                            }}
                        />
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
    getEventRenderProps?: TGetEventRenderPropsCallback;
}

interface IGetPreparedDynamicColumnProps extends IBaseDynamicColumnProps {
    dataProperty: string;
    columnIndex: number;
    dynamicColumnsGridData: TColumnKeys;
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    quantum: TQuantumType;
    columnDataDensity: TColumnDataDensity;
    getRowProps: TGetRowPropsCallback;
    hoverMode: THoverMode;
    getEventRenderProps?: TGetEventRenderPropsCallback;
}

export const EventsCells = React.memo(function MemoizedEventsCells(
    props: IEventsConfig & IDynamicCellsProps & { quantum: TQuantumType }
): React.ReactElement {
    const { render, dataProperty, dynamicColumnsGridData } = props;
    const startIndex = dynamicColumnsGridData.findIndex((d) => {
        return datesEqualByQuantum(props.range.start, d as Date, props.quantum);
    });
    const endIndex = dynamicColumnsGridData.findIndex((d) => {
        return datesEqualByQuantum(props.range.end, d as Date, props.quantum);
    });
    const quantumSize = dynamicColumnsGridData[1].getTime() - dynamicColumnsGridData[0].getTime();
    const { item } = useGridItemData([dataProperty]);
    const visibleDateRange = {
        start: getStartDate(new Date(props.range.start), props.quantum),
        end: getEndDate(new Date(props.range.end), props.quantum),
    };
    const events = item.get(props.eventsProperty);
    if (!events || events.getCount() === 0) {
        return null;
    }
    const className = `${CLASS_EVENT_CELL} ${CLASS_EVENT_CELL}_${props.hoverMode}`;

    return (
        <>
            {factory(events)
                .map((value: Model) => {
                    const event = value;
                    let startDate = value.get(props.eventStartProperty);
                    let endDate = value.get(props.eventEndProperty);
                    let startCropped = false;
                    let endCropped = false;
                    let columnStartIndex = -1;
                    let columnEndIndex = -1;

                    const customRenderProps = props.getEventRenderProps?.(event);

                    if (customRenderProps?.viewMode === 'byGrid') {
                        const length = Math.ceil(
                            (endDate.getTime() - startDate.getTime()) / quantumSize
                        );
                        startDate = getStartDate(new Date(startDate), props.quantum);
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + length);
                    }

                    // Событие не 0с длительностью не попало в отрисованный диапазон ячеек
                    if (endDate - startDate > 0) {
                        if (
                            startDate >= visibleDateRange.end ||
                            endDate <= visibleDateRange.start
                        ) {
                            return null;
                        }
                    } else {
                        // Событие 0с длительностью не попало в отрисованный диапазон ячеек (оно может быть на границе)
                        if (
                            startDate > visibleDateRange.end ||
                            endDate < visibleDateRange.start ||
                            endDate - startDate < 0
                        ) {
                            return null;
                        }
                    }

                    // Если дата начала раньше, чем дата в первой ячейке, считаем ячейкой начала первую
                    if (startDate < visibleDateRange.start) {
                        startCropped = true;
                        columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
                            return (
                                datesEqualByQuantum(
                                    visibleDateRange.start,
                                    d as Date,
                                    props.quantum
                                ) || visibleDateRange.start < d
                            );
                        });
                    }

                    // Если дата конца позже, чем дата в последней ячейке, считаем ячейкой конца первую
                    if (endDate > visibleDateRange.end) {
                        endCropped = true;
                        columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
                            return (
                                datesEqualByQuantum(
                                    visibleDateRange.end,
                                    d as Date,
                                    props.quantum as TQuantumType
                                ) || visibleDateRange.end < d
                            );
                        });
                    }

                    if (columnStartIndex === -1) {
                        columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
                            return (
                                datesEqualByQuantum(
                                    startDate,
                                    d as Date,
                                    props.quantum as TQuantumType
                                ) || startDate < d
                            );
                        });
                    }
                    if (columnEndIndex === -1) {
                        columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
                            return (
                                datesEqualByQuantum(
                                    endDate,
                                    d as Date,
                                    props.quantum as TQuantumType
                                ) || endDate < d
                            );
                        });
                    }

                    let startOffset = 0;
                    let endOffset = 0;

                    if (customRenderProps?.viewMode !== 'byGrid') {
                        // Отступами слева и справа выравниваем границы события
                        startOffset = getPositionInPeriod(startDate, props.quantum as TQuantumType);
                        endOffset = getPositionInPeriod(endDate, props.quantum as TQuantumType);
                    }

                    const span = columnEndIndex - columnStartIndex + 1;

                    const marginLeft = startCropped ? '0' : `calc(100% / ${span} * ${startOffset})`;
                    const marginRight = endCropped
                        ? '0'
                        : `calc(100% / ${span} * ${1 - endOffset} + ${
                              endOffset ? 0 : props.columnSpacing / span
                          }px)`;

                    // Ширина видимой части события, доступная для отрисовки контента
                    const width =
                        props.columnWidth *
                        (span -
                            (startCropped ? 0 : startOffset) -
                            (endCropped ? 0 : 1 - endOffset));

                    // Считаем отступ до начала видимой части события (теперь 0, так как не рисуем за границами)
                    const contentOffset = 0;
                    const left = props.columnWidth * (columnStartIndex - startIndex + startOffset);
                    const right = props.columnWidth * (endIndex - columnEndIndex + 1 - endOffset);
                    const renderProps: IEventRenderProps = {
                        events,
                        item,
                        event,
                        width,
                        contentOffset,
                        left,
                        right,
                        startCropped,
                        endCropped,
                    };
                    const cellRender = React.cloneElement(render, renderProps);
                    const attributes = {
                        'data-key': event.getKey(),
                    };
                    return (
                        <CellComponent
                            key={value.getKey()}
                            hoverMode={'cell'}
                            className={className}
                            render={cellRender}
                            attributes={attributes}
                            startColspanIndex={columnStartIndex + 1}
                            endColspanIndex={columnStartIndex + span + 1}
                            startRowspanIndex={1}
                            style={{
                                marginLeft,
                                marginRight,
                                pointerEvents: 'none',
                            }}
                            valign={null}
                            cursor={null}
                            paddingLeft={null}
                            paddingRight={null}
                            hoverBackgroundStyle={null}
                            displayType={null}
                        />
                    );
                })
                .value()}
        </>
    );
});

const RowSelectionContextProviderWrapper = React.memo(function (props: {
    dataProperty: string;
    children: JSX.Element;
}) {
    const { dataProperty, children } = props;
    const { item } = useGridItemData([dataProperty]);
    const itemKey = item.getKey();

    return <RowSelectionContextProviderMemo children={children} itemKey={itemKey} />;
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
        range,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        eventRender,
        getEventRenderProps,
        eventsProperty,
        eventStartProperty,
        eventEndProperty,
        columnsSpacing,
        quantum,
        columnDataDensity,
        hoverMode,
        getRowProps,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        hoverMode,
        getRowProps,
        dataProperty,
        width: 'auto',
        key: DYNAMIC_COLUMN_PREFIX + columnIndex,
        render: (
            <RowSelectionContextProviderWrapper
                dataProperty={dataProperty}
                quantum={quantum as TQuantumType}
            >
                <>
                    <DynamicCells
                        render={dynamicColumn.render}
                        getCellProps={dynamicColumn.getCellProps}
                        displayProperty={dynamicColumn.displayProperty}
                        dataProperty={dataProperty}
                        dynamicColumnsGridData={dynamicColumnsGridData}
                        columnDataDensity={columnDataDensity}
                        hoverMode={hoverMode}
                    />
                    {eventsProperty ? (
                        <EventsCells
                            render={eventRender}
                            getEventRenderProps={getEventRenderProps}
                            range={range}
                            eventsProperty={eventsProperty}
                            eventStartProperty={eventStartProperty}
                            eventEndProperty={eventEndProperty}
                            columnSpacing={getColumnGapSize(columnsSpacing)}
                            columnWidth={
                                parseFloat(dynamicColumn.width) + getColumnGapSize(columnsSpacing)
                            }
                            dataProperty={dataProperty}
                            // Ширина динамических ячеек берется из настроек динамической колонки
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            quantum={quantum}
                            columnDataDensity={columnDataDensity}
                            hoverMode={hoverMode}
                        />
                    ) : null}

                    <SelectionIndicatorMemo />
                </>
            </RowSelectionContextProviderWrapper>
        ),
        getCellProps: props.getCellProps,
    });
}
