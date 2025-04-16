/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import {
    IFooterConfig,
    CellComponent,
    ICellProps,
    IBaseColumnConfig,
    TColumnWidth,
} from 'Controls/gridRender';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';
import {
    THoverMode,
    IDynamicHeaderConfig,
    ISuperHeaderConfig,
    TGetDynamicCellPropsCallback,
} from '../interfaces/IDynamicGridComponent';
import { IRange, IQuantum } from '../interfaces/IEventRenderProps';
import { correctServerSideDateForRender } from 'Controls-Lists/_dynamicGrid/render/utils';
import DynamicGridColumnContextProvider from '../context/DynamicGridColumnContextProvider';
import SelectionIndicatorMemo from 'Controls-Lists/_dynamicGrid/selection/components/SelectionIndicator';
import RowSelectionContextProviderMemo from 'Controls-Lists/_dynamicGrid/selection/selectionContext/rowSelectionContext/RowSelectionContextProvider';
import { SelectionHighlightMemo } from 'Controls-Lists/_dynamicGrid/selection/components/SelectionHighlight';
import { DragSelectionContext } from 'Controls-Lists/_dynamicGrid/selection/dragSelection/dragSelectionContext/DragSelectionContext';
import { GridSelectionContext } from 'Controls-Lists/_dynamicGrid/selection/selectionContext/gridSelectionContext/GridSelectionContext';
import { DYNAMIC_GRID_CELL_BASE_CLASS_NAME } from 'Controls-Lists/_dynamicGrid/shared/constants';

export interface IGetExtraRowDynamicCellClassNameBaseProps {
    value: number | Date;
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode: THoverMode;
    range: IRange;
    quantums?: IQuantum[];
    filtered?: boolean;
}

export interface IGetExtraRowDynamicCellClassNameProps
    extends IGetExtraRowDynamicCellClassNameBaseProps {
    classPrefix: string;
}

export type TExtraRowDynamicCellsClassNameCallback = (
    props: IGetExtraRowDynamicCellClassNameBaseProps
) => string;

interface IExtraRowDynamicCellsProps {
    render: React.ReactElement;
    dynamicColumnsGridData: unknown[];
    extraRowDynamicCellsClassNameCallback: TExtraRowDynamicCellsClassNameCallback;
    extraRowDynamicSubColumns?: IBaseColumnConfig[];
    extraRowDynamicSuperColumns?: ISuperHeaderConfig[];
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode?: THoverMode;
    keyPrefix: string;
    getCellProps?: () => ICellProps;
    hoverBackgroundStyle?: string;
    range: IRange;
    filtered?: boolean;
    dynamicColumnWidth?: TColumnWidth;
    isAdaptive?: boolean;
    basicColspan: number;
    quantums?: IQuantum[];
}

export interface IGetPreparedExtraRowDynamicColumnBaseProps extends IBaseDynamicColumnProps {
    extraRowDynamicColumn: IDynamicHeaderConfig | IFooterConfig;
    extraRowDynamicSubColumns?: IBaseColumnConfig[];
    extraRowDynamicSuperColumns?: ISuperHeaderConfig[];
    dynamicColumnsGridData: unknown[];
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode?: THoverMode;
    range: IRange;
    quantums?: IQuantum[];
    dynamicColumnWidth?: TColumnWidth;
}

export interface IGetPreparedExtraRowDynamicColumnProps
    extends IGetPreparedExtraRowDynamicColumnBaseProps {
    keyPrefix: string;
    hoverClassName?: string;
    cellHoverBackgroundStyle?: string;
    backgroundStyle?: string;
    extraRowDynamicCellsClassNameCallback: TExtraRowDynamicCellsClassNameCallback;
    range: IRange;
    filtered?: boolean;
    basicColspan: number;
    isAdaptive?: boolean;
}

const paddingNull = {
    paddingLeft: null,
    paddingRight: null,
    paddingTop: null,
    paddingBottom: null,
};

function getExtraColumnCommonParams(
    key: string,
    value?: number | Date,
    keyPrefix: string = '',
    backgroundStyle?: string
) {
    let columnKey = key;
    const renderValues = {} as { date?: Date; value?: number };
    let selectionKey;

    if (value instanceof Date) {
        renderValues.date = value;
        columnKey += keyPrefix + value.getTime();
        selectionKey = value.toUTCString();
    } else {
        renderValues.value = value as number;
        columnKey += keyPrefix + value;
        selectionKey = `${value}`;
    }

    const attributes = {
        'column-key': selectionKey,
    };

    return { columnKey, renderValues, selectionKey, attributes };
}

// TODO Очень много дублирующего кода в ExtraRowDynamicCells, сам метод 232 строки
//  Надо разбить на компоненты и вынести общее.
function ExtraRowDynamicCells(props: IExtraRowDynamicCellsProps) {
    const {
        render,
        dynamicColumnsGridData,
        basicColspan,
        extraRowDynamicSubColumns,
        extraRowDynamicSuperColumns,
        extraRowDynamicCellsClassNameCallback,
        columnsSpacing,
        quantum,
        quantums,
        dataDensity,
        hoverMode,
        keyPrefix,
        hoverBackgroundStyle,
        range,
        filtered,
        dynamicColumnWidth,
        isAdaptive,
    } = props;

    const dsContext = React.useContext(DragSelectionContext);
    const gridContext = React.useContext(GridSelectionContext);

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

    // TODO костыль добавлен, потому что из-за actualDragCtx.startDrag
    //  перерисовывается весь таймлайн вместе с SelectionHighlight,
    //  и mouseUp + click просто никогда не срабатывает.
    // region crutch
    const preventStates = React.useRef({ shouldPreventClick: false });
    const onColumnClick = React.useCallback((e) => {
        // Стопать событие, если надо обработать клик по уголоку
        if (preventStates.current.shouldPreventClick) {
            e.stopPropagation();
        }
    }, []);
    const onColumnMouseDown = React.useCallback((e) => {
        preventStates.current.shouldPreventClick = false;
    }, []);
    const preventClickCallback = React.useCallback((value: boolean) => {
        preventStates.current.shouldPreventClick = value;
    });
    // endregion crutch

    const cells: JSX.Element[] = [];
    const superRowsCount = extraRowDynamicSuperColumns?.length || 0;
    if (extraRowDynamicSuperColumns) {
        const maxCellColspan = basicColspan * dynamicColumnsGridData.length + 1;
        extraRowDynamicSuperColumns.forEach(
            ({ colspanCallback, render, getCellProps, key }, rowIndex) => {
                let currentColumn = 0;
                const cellProps = getCellProps?.() || {};
                const backgroundStyle =
                    cellProps?.backgroundStyle ||
                    (isAdaptive ? 'unaccented_adaptive' : 'unaccented');
                const cursor = cellProps?.cursor || 'pointer';
                dynamicColumnsGridData.forEach((value: number | Date, index) => {
                    if (index < currentColumn) {
                        return;
                    }
                    let colspan = colspanCallback(value) || 1;
                    if (colspan === 'end') {
                        colspan = maxCellColspan;
                    }
                    currentColumn += colspan;
                    const { columnKey, renderValues, attributes } = getExtraColumnCommonParams(
                        key,
                        value,
                        keyPrefix,
                        cellProps?.backgroundStyle
                    );

                    const ContentRender = React.cloneElement(render, {
                        renderValues,
                    });

                    cells.push(
                        <DynamicGridColumnContextProvider
                            columnIndex={index}
                            columnWidth={dynamicColumnWidth}
                            key={columnKey}
                        >
                            <CellComponent
                                attributes={attributes}
                                key={columnKey}
                                render={ContentRender}
                                startRowspanIndex={rowIndex + 1}
                                startColspanIndex={index * basicColspan + 1}
                                endColspanIndex={Math.min(
                                    index * basicColspan + colspan * basicColspan + 1,
                                    maxCellColspan
                                )}
                                backgroundColorStyle={backgroundStyle}
                                cursor={cursor}
                                hoverBackgroundStyle={hoverBackgroundStyle}
                                valign="center"
                                {...paddingNull}
                                {...cellProps}
                                onMouseDown={onColumnMouseDown}
                                onMouseMove={mouseMoveHandler}
                                onClick={onColumnClick}
                            />
                        </DynamicGridColumnContextProvider>
                    );
                });
            }
        );
    }

    const cellProps = props.getCellProps?.();
    const backgroundStyle =
        cellProps?.backgroundStyle || (isAdaptive ? 'unaccented_adaptive' : 'unaccented');
    const cursor = cellProps?.cursor || 'pointer';

    dynamicColumnsGridData.forEach((value: number | Date, index) => {
        const { columnKey, renderValues, selectionKey, attributes } = getExtraColumnCommonParams(
            '',
            value,
            keyPrefix,
            backgroundStyle
        );
        const isNeedOpacity = calcNeedOpacity(value, range, quantum);

        const ContentRender = (
            <>
                {React.cloneElement(render, {
                    renderValues,
                    isNeedOpacity,
                })}
                <SelectionHighlightMemo
                    columnKey={selectionKey}
                    preventClickCallback={preventClickCallback}
                    borderRadius={{
                        bottomLeft: cellProps?.bottomLeftBorderRadius,
                        bottomRight: cellProps?.bottomRightBorderRadius,
                        topLeft: cellProps?.topLeftBorderRadius,
                        topRight: cellProps?.topRightBorderRadius,
                    }}
                />
            </>
        );

        cells.push(
            <DynamicGridColumnContextProvider
                columnIndex={index}
                key={columnKey}
                columnWidth={dynamicColumnWidth}
            >
                <CellComponent
                    attributes={attributes}
                    key={columnKey}
                    className={extraRowDynamicCellsClassNameCallback({
                        value,
                        columnsSpacing,
                        quantum,
                        quantums,
                        dataDensity,
                        hoverMode,
                        range,
                        filtered,
                    })}
                    render={ContentRender}
                    startRowspanIndex={superRowsCount + 1}
                    startColspanIndex={index * basicColspan + 1}
                    endColspanIndex={index * basicColspan + basicColspan + 1}
                    backgroundColorStyle={backgroundStyle}
                    cursor={cursor}
                    hoverBackgroundStyle={hoverBackgroundStyle}
                    {...paddingNull}
                    valign="center"
                    onMouseDown={onColumnMouseDown}
                    onMouseMove={mouseMoveHandler}
                    onClick={onColumnClick}
                />
            </DynamicGridColumnContextProvider>
        );
    });

    if (extraRowDynamicSubColumns?.length) {
        dynamicColumnsGridData.forEach((value: number | Date, index) => {
            const {
                columnKey: key,
                renderValues,
                attributes,
            } = getExtraColumnCommonParams('', value, keyPrefix, cellProps?.backgroundStyle);
            extraRowDynamicSubColumns.forEach((subColumn, subIndex) => {
                const cellProps = subColumn.getCellProps?.() || {};
                const backgroundStyle =
                    cellProps?.backgroundStyle ||
                    (isAdaptive ? 'unaccented_adaptive' : 'unaccented');
                const cursor = cellProps?.cursor || 'pointer';

                const ContentRender = React.cloneElement(subColumn.render, {
                    renderValues,
                });
                cells.push(
                    <DynamicGridColumnContextProvider
                        key={key + subColumn.key}
                        columnIndex={index}
                        columnWidth={dynamicColumnWidth}
                    >
                        <CellComponent
                            attributes={attributes}
                            key={key + subColumn.key}
                            render={ContentRender}
                            startRowspanIndex={superRowsCount + 2}
                            startColspanIndex={index * basicColspan + subIndex + 1}
                            backgroundColorStyle={backgroundStyle}
                            cursor={cursor}
                            hoverBackgroundStyle={hoverBackgroundStyle}
                            valign="center"
                            halign="center"
                            {...paddingNull}
                            {...cellProps}
                            onMouseDown={onColumnMouseDown}
                            onMouseMove={mouseMoveHandler}
                            onClick={onColumnClick}
                        />
                    </DynamicGridColumnContextProvider>
                );
            });
        });
    }

    return cells;
}

export const ExtraRowDynamicCellsMemo = React.memo(ExtraRowDynamicCells);

const RowSelectionContextProviderWrapper = React.memo(function (props: {
    children: JSX.Element;
    getCellProps: TGetDynamicCellPropsCallback;
}) {
    const borderRadius = {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
    };
    if (props.getCellProps) {
        const cellProps = props.getCellProps('header');
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

    return (
        <RowSelectionContextProviderMemo
            children={props.children}
            itemKey={'header'}
            borderRadius={borderRadius}
        />
    );
});

export function getPreparedExtraRowDynamicColumnProps(
    props: IGetPreparedExtraRowDynamicColumnProps
) {
    const {
        extraRowDynamicColumn,
        extraRowDynamicSubColumns,
        extraRowDynamicSuperColumns,
        dynamicColumn,
        dynamicColumnsGridData,
        columnsSpacing,
        quantum,
        quantums,
        dataDensity,
        hoverMode,
        keyPrefix,
        hoverClassName,
        cellHoverBackgroundStyle,
        getCellProps,
        extraRowDynamicCellsClassNameCallback,
        range,
        filtered,
        dynamicColumnWidth,
        isAdaptive,
    } = props;

    const basicColspan = dynamicColumn.subColumns ? dynamicColumn.subColumns.length : 1;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsGridDataLength: dynamicColumnsGridData.length,
        columnsSpacing,
        dataProperty: undefined,
        getCellProps,
        key: keyPrefix,
        className: hoverClassName,
        render: (
            <RowSelectionContextProviderWrapper getCellProps={extraRowDynamicColumn.getCellProps}>
                <>
                    <ExtraRowDynamicCellsMemo
                        render={extraRowDynamicColumn.render}
                        getCellProps={extraRowDynamicColumn.getCellProps}
                        dynamicColumnsGridData={dynamicColumnsGridData}
                        extraRowDynamicSubColumns={extraRowDynamicSubColumns}
                        extraRowDynamicSuperColumns={extraRowDynamicSuperColumns}
                        extraRowDynamicCellsClassNameCallback={
                            extraRowDynamicCellsClassNameCallback
                        }
                        columnsSpacing={columnsSpacing}
                        basicColspan={basicColspan}
                        quantum={quantum}
                        quantums={quantums}
                        dataDensity={dataDensity}
                        hoverMode={hoverMode}
                        keyPrefix={keyPrefix}
                        hoverBackgroundStyle={cellHoverBackgroundStyle}
                        range={range}
                        filtered={filtered}
                        dynamicColumnWidth={dynamicColumnWidth}
                        isAdaptive={isAdaptive}
                    />
                    <SelectionIndicatorMemo />
                </>
            </RowSelectionContextProviderWrapper>
        ),
    });
}

export function getExtraRowDynamicCellClassName(
    props: IGetExtraRowDynamicCellClassNameProps
): string {
    const { value, classPrefix } = props;

    return `${classPrefix} js-${classPrefix} ${getExtraRowCellUniqueClass(value, classPrefix)}`;
}

/*
 * TODO метод таймлайна
 * Возвращает уникальный CSS класс для ячейки шапки по дате с точностью до секунд.
 * @param value
 * @param classPrefix
 */
export function getExtraRowCellUniqueClass(value: number | Date, classPrefix: string): string {
    if (value instanceof Date) {
        const s = value.getSeconds();
        const m = value.getMinutes();
        const date = correctServerSideDateForRender(value);
        const h = date.getHours();
        const D = date.getDate();
        const M = date.getMonth();
        const Y = date.getFullYear();

        return `js-${classPrefix}_${D}-${M}-${Y}_${h}-${m}-${s}`;
    }
    return `js-${classPrefix}_${value}`;
}

function calcNeedOpacity(value: number | Date, range: IRange, quantum: TQuantumType): boolean {
    if (!(value instanceof Date)) {
        return false;
    }
    const date = correctServerSideDateForRender(value);
    const start = correctServerSideDateForRender(range.start);
    if (quantum === 'day') {
        return start.getMonth() !== date.getMonth();
    }
    if (quantum === 'month') {
        return start.getFullYear() !== date.getFullYear();
    }
    if (quantum === 'hour') {
        return start.getDate() !== date.getDate();
    }
    return false;
}
