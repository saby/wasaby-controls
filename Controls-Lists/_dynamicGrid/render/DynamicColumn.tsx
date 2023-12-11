import * as React from 'react';
import { factory } from 'Types/chain';
import {
    CellComponent,
    IColumnConfig,
    useItemData as useGridItemData,
    TGetCellPropsCallback,
    TGetRowPropsCallback,
} from 'Controls/gridReact';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { getDataQa, getPositionInPeriod } from './utils';
import { TQuantumType, TColumnKeys, TColumnDataDensity } from '../shared/types';
import { datesEqualByQuantum } from '../shared/utils/datesEqualByQuantum';
import SelectionCheckboxMemo from '../selection/components/SelectionCheckbox';
import SelectionIndicatorMemo from '../selection/components/SelectionIndicator';
import SelectionResizerMemo from '../selection/dragSelection/components/SelectionResizer';
import { DragSelectionContext } from '../selection/dragSelection/dragSelectionContext/DragSelectionContext';
import RowSelectionContextProviderMemo from '../selection/selectionContext/rowSelectionContext/RowSelectionContextProvider';
import { THoverMode } from '../interfaces/IDynamicGridComponent';
import { IItemsRange } from 'Controls/baseList';
import { getColumnGapSize } from '../utils';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';

export const CLASS_DYNAMIC_DATA_CELL = 'ControlsLists-dynamicGrid__dynamicDataCell';
export const CLASS_EVENT_CELL = 'ControlsLists-dynamicGrid__eventCell';

interface IDynamicCellsProps {
    render: React.ReactElement;
    getCellProps: TGetCellPropsCallback;
    dataProperty: string;
    displayProperty: string;
    dynamicColumnsGridData: TColumnKeys;
    visibleRange: IItemsRange;
    rangeCorrection: number;
    columnDataDensity: TColumnDataDensity;
    hoverMode: THoverMode;
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
    const dynamicCellClassName = `${CLASS_DYNAMIC_DATA_CELL} ${
        hoverMode !== undefined
            ? `ControlsLists-dynamicGrid__dynamicDataCell_${hoverMode}`
            : 'ControlsLists-dynamicGrid__dynamicDataCell_cross'
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
                    const renderProps = {
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
}

export const EventsCells = React.memo(function MemoizedEventsCells(
    props: IEventsConfig & IDynamicCellsProps & { quantum: TQuantumType }
): React.ReactElement {
    const { render, dataProperty, dynamicColumnsGridData } = props;
    const { item } = useGridItemData([dataProperty]);

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
                    const correctedStartIndex = Math.max(
                        Math.min(
                            props.startIndex + props.rangeCorrection,
                            dynamicColumnsGridData.length - 1
                        ),
                        0
                    );
                    const correctedEndIndex = Math.max(
                        Math.min(
                            props.endIndex + props.rangeCorrection,
                            dynamicColumnsGridData.length - 1
                        ),
                        0
                    );
                    let startCropped = false;
                    let endCropped = false;
                    let startContentCropped = false;
                    let endContentCropped = false;
                    let columnStartIndex = -1;
                    let columnEndIndex = -1;

                    // Событие не попало в отрисованный диапазон ячеек или продолжительностью 0с
                    if (
                        startDate > dynamicColumnsGridData[dynamicColumnsGridData.length - 1] ||
                        endDate < dynamicColumnsGridData[0]
                    ) {
                        return null;
                    }

                    // Если дата начала раньше, чем дата в первой ячейке, считаем ячейкой начала первую
                    if (startDate < dynamicColumnsGridData[0]) {
                        startCropped = true;
                        columnStartIndex = 0;
                    }

                    // Если дата конца позже, чем дата в последней ячейке, считаем ячейкой конца первую
                    if (endDate > dynamicColumnsGridData[dynamicColumnsGridData.length - 1]) {
                        endCropped = true;
                        columnEndIndex = dynamicColumnsGridData.length;
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

                    let contentStartIndex = columnStartIndex;
                    let contentEndIndex = columnEndIndex;
                    let contentVisible = true;

                    // Событие не попало в видимую часть таймлайна
                    if (
                        correctedEndIndex < contentStartIndex ||
                        correctedStartIndex > contentEndIndex
                    ) {
                        contentVisible = false;
                    }

                    // Обрезаем контент по границам видимой части
                    if (correctedEndIndex < contentEndIndex) {
                        endContentCropped = true;
                        contentEndIndex = correctedEndIndex;
                    }
                    if (correctedStartIndex > contentStartIndex) {
                        startContentCropped = true;
                        contentStartIndex = correctedStartIndex;
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
                        : `calc(100% / ${span} * ${1 - endOffset} + ${
                              endOffset ? 0 : props.columnSpacing / span
                          }px)`;

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
                    const left =
                        props.columnWidth * (columnStartIndex - correctedStartIndex + startOffset);
                    const right =
                        props.columnWidth * (correctedEndIndex - columnEndIndex + 1 - endOffset);
                    const renderProps = {
                        events,
                        item,
                        event,
                        width,
                        contentOffset,
                        left,
                        right,
                    };
                    const cellRender = React.cloneElement(render, renderProps);
                    const attributes = {
                        'data-key': event.getKey(),
                    };
                    return (
                        <CellComponent
                            key={value.getKey()}
                            className={CLASS_EVENT_CELL}
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
        visibleRange,
        rangeCorrection,
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
                            endIndex={visibleRange.endIndex}
                            startIndex={visibleRange.startIndex}
                            rangeCorrection={rangeCorrection}
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
                        />
                    ) : null}

                    <SelectionIndicatorMemo />
                </>
            </RowSelectionContextProviderWrapper>
        ),
        getCellProps: props.getCellProps,
    });
}
