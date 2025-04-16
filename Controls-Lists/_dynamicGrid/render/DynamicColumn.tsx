/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import {
    CellComponent,
    IColumnConfig,
    useItemData as useGridItemData,
    TGetRowPropsCallback,
    TColumnKey,
    TColumnWidth,
} from 'Controls/gridRender';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import DynamicGridColumnContextProvider from '../context/DynamicGridColumnContextProvider';
import { getDataQa } from './utils';
import { TQuantumType, TColumnKeys, TColumnDataDensity } from '../shared/types';
import SelectionIndicatorMemo from '../selection/components/SelectionIndicator';
import { SelectionHighlightMemo } from 'Controls-Lists/_dynamicGrid/selection/components/SelectionHighlight';
import { DragSelectionContext } from '../selection/dragSelection/dragSelectionContext/DragSelectionContext';
import RowSelectionContextProviderMemo from '../selection/selectionContext/rowSelectionContext/RowSelectionContextProvider';
import {
    TGetDynamicCellPropsCallback,
    THoverMode,
    IDynamicCellsProps,
} from '../interfaces/IDynamicGridComponent';
import { TGetEventRenderPropsCallback } from '../interfaces/IEventRenderProps';
import { getColumnGapSize } from '../utils';
import { DYNAMIC_GRID_CELL_BASE_CLASS_NAME } from 'Controls-Lists/_dynamicGrid/shared/constants';
import { GridSelectionContext } from 'Controls-Lists/_dynamicGrid/selection/selectionContext/gridSelectionContext/GridSelectionContext';
import { EventsCells } from 'Controls-Lists/_dynamicGrid/render/EventsCells';
import { useDynamicEditCell } from 'Controls-Lists/_dynamicGrid/hooks/renderHooks';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';

export const CLASS_DYNAMIC_DATA_CELL = 'ControlsLists-dynamicGrid__dynamicDataCell';

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
    /**
     * Ключ подколонки при их наличии
     * @cfg {String}
     * @field Controls-Lists/_dynamicGrid/render/DynamicColumn/IDynamicCellRenderProps#subColumnKey
     */
    subColumnKey?: TColumnKey;
}

function CellRender({
    columnKey,
    dynamicColumnIndex,
    dynamicCellEditorRender,
    value,
    render,
    renderProps,
    cellProps,
    columnDataDensity,
    dynamicCellClassName,
    mouseMoveHandler,
    startColspanIndex,
}) {
    // TODO: Здесь появится еще проверка на string и null, когда даты вынесутся из dynamicGrid.
    //  Пока такое не требуется.
    const attributes = {
        'column-key': columnKey,
        'data-qa': getDataQa('cell', value) + ` ${cellProps.backgroundStyle}`,
    };

    const { editingColumnIndex, editing, columnIndex } = useDynamicEditCell(dynamicColumnIndex);

    let cellRender;
    let hoverBackgroundStyle = null;

    cellRender = (
        <>
            {render && columnDataDensity !== 'empty' && React.cloneElement(render, renderProps)}
            {columnDataDensity !== 'empty' && (
                <SelectionHighlightMemo
                    columnKey={columnKey}
                    borderRadius={{
                        bottomLeft: cellProps.bottomLeftBorderRadius,
                        bottomRight: cellProps.bottomRightBorderRadius,
                        topLeft: cellProps.topLeftBorderRadius,
                        topRight: cellProps.topRightBorderRadius,
                    }}
                />
            )}
        </>
    );

    if (cellProps.editable !== false && dynamicCellEditorRender) {
        dynamicCellClassName += ' js-ControlsLists-dynamicGrid__dynamicDataCell-editable';
        if (editingColumnIndex === columnIndex && editing) {
            cellRender = React.cloneElement(dynamicCellEditorRender, renderProps);
        } else {
            hoverBackgroundStyle = 'list_singleCellEditable';
        }
    }

    // todo Сделать получение значений для рендера через хук
    return (
        <CellComponent
            {...cellProps}
            attributes={attributes}
            tagClassName="ControlsLists-dynamicGrid__tag"
            hoverMode="cell"
            borderMode="cell"
            valign={cellProps.valign !== undefined ? cellProps.valign : 'baseline'}
            baseline={cellProps.baseline !== undefined ? cellProps.baseline : 'default'}
            paddingLeft={cellProps.padding?.left}
            paddingRight={cellProps.padding?.right}
            hoverBackgroundStyle={hoverBackgroundStyle}
            className={dynamicCellClassName}
            startColspanIndex={startColspanIndex}
            startRowspanIndex={1}
            endRowspanIndex={cellProps.maxRow}
            render={cellRender}
            onMouseMove={mouseMoveHandler}
        />
    );
}

export const DynamicCells = React.memo(function MemoizedDynamicColumn(
    props: IDynamicCellsProps
): React.ReactElement {
    const {
        subColumns,
        render,
        dataProperty,
        dynamicColumnsGridData,
        columnDataDensity,
        getCellProps,
        hoverMode,
        dynamicColumnWidth,
        dynamicCellEditorRender,
        task88221034408419,
    } = props;
    const { renderValues, item } = useGridItemData([dataProperty]);
    const dynamicColumnsData = renderValues[dataProperty];
    const dsContext = React.useContext(DragSelectionContext);
    const gridContext = React.useContext(GridSelectionContext);
    const dynamicCellClassName = `${CLASS_DYNAMIC_DATA_CELL}${
        hoverMode === 'cross' ? ' ControlsLists-dynamicGrid__cell-crosshair' : ''
    }`;

    const mouseMoveHandler = React.useCallback(
        (e) => {
            if (dsContext) {
                dsContext.contextRefForHandlersOnly.current.moveDrag(e);
            }
            if (
                e?.nativeEvent?.target?.closest?.(`.${DYNAMIC_GRID_CELL_BASE_CLASS_NAME}`) &&
                !gridContext.isSelectionInitialized
            ) {
                gridContext.initializeSelection();
            }
        },
        [dsContext, gridContext]
    );

    if (!dynamicColumnsData && !(task88221034408419 && item === 'search-separator')) {
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
                    if (subColumns && subColumns.length) {
                        return subColumns.map((column, subIndex) => {
                            const key = cellKey + subIndex;
                            const cellProps = column.getCellProps
                                ? column.getCellProps(item, date)
                                : {};
                            // TODO: Здесь появится еще проверка на string и null, когда даты вынесутся из dynamicGrid.
                            //  Пока такое не требуется.
                            const columnKey =
                                (date instanceof Date ? date.toUTCString() : date) + column.key;

                            const renderProps: IDynamicCellRenderProps = {
                                item,
                                date,
                                columnData,
                                subColumnKey: column.key,
                            };

                            return (
                                <DynamicGridColumnContextProvider
                                    columnIndex={index}
                                    columnWidth={dynamicColumnWidth}
                                    renderData={dynamicColumnsData}
                                    key={key}
                                >
                                    <CellRender
                                        key={key}
                                        columnKey={columnKey}
                                        dynamicColumnIndex={index * subColumns.length + subIndex}
                                        value={date}
                                        columnDataDensity={columnDataDensity}
                                        dynamicCellClassName={dynamicCellClassName}
                                        mouseMoveHandler={mouseMoveHandler}
                                        dynamicCellEditorRender={dynamicCellEditorRender}
                                        render={column.render}
                                        renderProps={renderProps}
                                        cellProps={cellProps}
                                        startColspanIndex={index * subColumns.length + subIndex + 1}
                                    />
                                </DynamicGridColumnContextProvider>
                            );
                        });
                    } else {
                        const cellProps = getCellProps ? getCellProps(item, date) : {};
                        // TODO: Здесь появится еще проверка на string и null, когда даты вынесутся из dynamicGrid.
                        //  Пока такое не требуется.
                        const columnKey = date instanceof Date ? date.toUTCString() : date;
                        return (
                            <DynamicGridColumnContextProvider
                                columnIndex={index}
                                columnWidth={dynamicColumnWidth}
                                renderData={dynamicColumnsData}
                                key={cellKey}
                            >
                                <CellRender
                                    key={cellKey}
                                    columnKey={columnKey}
                                    dynamicColumnIndex={index}
                                    value={date}
                                    dynamicCellEditorRender={dynamicCellEditorRender}
                                    render={render}
                                    columnDataDensity={columnDataDensity}
                                    dynamicCellClassName={dynamicCellClassName}
                                    mouseMoveHandler={mouseMoveHandler}
                                    renderProps={renderProps}
                                    cellProps={cellProps}
                                    startColspanIndex={index + 1}
                                />
                            </DynamicGridColumnContextProvider>
                        );
                    }
                })
                .value()}
        </>
    );
});

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
    dynamicColumnWidth?: TColumnWidth;
}

const RowSelectionContextProviderWrapper = React.memo(function (props: {
    dataProperty: string;
    children: JSX.Element;
    getCellProps: TGetDynamicCellPropsCallback;
    dynamicColumnsGridData: TColumnKeys;
    task88221034408419: boolean;
}) {
    const { dataProperty, children } = props;
    const { renderValues, item } = useGridItemData([dataProperty]);
    const dynamicColumnsData = renderValues[dataProperty];
    const borderRadius = {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
    };
    if (dynamicColumnsData && props.getCellProps) {
        const cellProps = props.getCellProps(item, props.dynamicColumnsGridData[0]);
        if (cellProps.topRightBorderRadius) {
            borderRadius.topRight = cellProps.topRightBorderRadius;
        }
        if (cellProps.topLeftBorderRadius) {
            borderRadius.topLeft = cellProps.topLeftBorderRadius;
        }
        if (cellProps.bottomRightBorderRadius) {
            borderRadius.bottomRight = cellProps.bottomRightBorderRadius;
        }
        if (cellProps.bottomLeftBorderRadius) {
            borderRadius.bottomLeft = cellProps.bottomLeftBorderRadius;
        }
    }

    //Для breadCrumbs в качестве item возвращается массив
    let itemKey;
    if (props.task88221034408419 && item === 'search-separator') {
        itemKey = 'search-separator';
    } else {
        itemKey = Array.isArray(item) ? item[item.length - 1].getKey() : item?.getKey?.();
    }

    return (
        <RowSelectionContextProviderMemo
            children={children}
            itemKey={itemKey}
            borderRadius={borderRadius}
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
        range,
        dynamicColumn,
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
        dynamicColumnWidth,
        onEventResized,
        editingConfig,
        onDependencyButtonMouseDown,
        onDependencyButtonClick,
        task88221034408419,
        task88221034654496,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsGridDataLength: dynamicColumnsGridData.length,
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
                getCellProps={dynamicColumn.getCellProps}
                dynamicColumnsGridData={dynamicColumnsGridData}
                task88221034408419={task88221034408419}
            >
                <>
                    <DynamicCells
                        subColumns={dynamicColumn.subColumns}
                        dynamicCellEditorRender={dynamicColumn.editorRender}
                        render={dynamicColumn.render}
                        getCellProps={dynamicColumn.getCellProps}
                        displayProperty={dynamicColumn.displayProperty}
                        dataProperty={dataProperty}
                        dynamicColumnsGridData={dynamicColumnsGridData}
                        columnDataDensity={columnDataDensity}
                        hoverMode={hoverMode}
                        dynamicColumnWidth={dynamicColumnWidth}
                        task88221034408419={task88221034408419}
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
                                parseFloat(dynamicColumnWidth) + getColumnGapSize(columnsSpacing)
                            }
                            dataProperty={dataProperty}
                            // Ширина динамических ячеек берется из настроек динамической колонки
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            quantum={quantum}
                            columnDataDensity={columnDataDensity}
                            hoverMode={hoverMode}
                            onEventResized={onEventResized}
                            onDependencyButtonMouseDown={onDependencyButtonMouseDown}
                            onDependencyButtonClick={onDependencyButtonClick}
                        />
                    ) : null}

                    <SelectionIndicatorMemo />
                </>
            </RowSelectionContextProviderWrapper>
        ),
        getCellProps: props.getCellProps,
        dynamicColumnWidth,
        editingConfig,
        task88221034654496,
    });
}
