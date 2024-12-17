/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { IFooterConfig, CellComponent, ICellProps, IBaseColumnConfig } from 'Controls/gridReact';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';
import {
    THoverMode,
    IDynamicHeaderConfig,
    ISuperHeaderConfig,
} from '../interfaces/IDynamicGridComponent';
import { IRange, IQuantum } from '../interfaces/IEventRenderProps';
import { correctServerSideDateForRender } from 'Controls-Lists/_dynamicGrid/render/utils';
import DynamicGridColumnContextProvider from '../context/DynamicGridColumnContextProvider';

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
}
const paddingNull = {
    paddingLeft: null,
    paddingRight: null,
    paddingTop: null,
    paddingBottom: null,
};

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
    } = props;

    const cells: JSX.Element[] = [];
    const superRowsCount = extraRowDynamicSuperColumns?.length || 0;
    if (extraRowDynamicSuperColumns) {
        const maxCellColspan = basicColspan * dynamicColumnsGridData.length + 1;
        extraRowDynamicSuperColumns.forEach(
            ({ colspanCallback, render, getCellProps, key }, rowIndex) => {
                let currentColumn = 0;
                const cellProps = getCellProps?.() || {};
                const backgroundStyle = cellProps?.backgroundStyle || 'unaccented';
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
                    let columnKey = key;
                    const renderValues = {} as { date?: Date; value?: number };

                    if (value instanceof Date) {
                        renderValues.date = value;
                        columnKey += keyPrefix + value.getTime();
                    } else {
                        renderValues.value = value as number;
                        columnKey += keyPrefix + value;
                    }

                    const ContentRender = React.cloneElement(render, {
                        renderValues,
                    });

                    cells.push(
                        <DynamicGridColumnContextProvider columnIndex={index} key={columnKey}>
                            <CellComponent
                                key={columnKey}
                                render={ContentRender}
                                startRowspanIndex={rowIndex + 1}
                                startColspanIndex={index * basicColspan + 1}
                                endColspanIndex={Math.min(
                                    index * basicColspan + colspan * basicColspan + 1,
                                    maxCellColspan
                                )}
                                backgroundStyle={backgroundStyle}
                                cursor={cursor}
                                hoverBackgroundStyle={hoverBackgroundStyle}
                                valign="center"
                                {...paddingNull}
                                {...cellProps}
                            />
                        </DynamicGridColumnContextProvider>
                    );
                });
            }
        );
    }

    const cellProps = props.getCellProps?.();
    const backgroundStyle = cellProps?.backgroundStyle || 'unaccented';
    const cursor = cellProps?.cursor || 'pointer';

    dynamicColumnsGridData.forEach((value: number | Date, index) => {
        let key;
        const renderValues = {} as { date?: Date; value?: number };

        if (value instanceof Date) {
            renderValues.date = value;
            key = keyPrefix + value.getTime();
        } else {
            renderValues.value = value as number;
            key = keyPrefix + value;
        }

        const isNeedOpacity = calcNeedOpacity(value, range, quantum);

        const ContentRender = React.cloneElement(render, {
            renderValues,
            isNeedOpacity,
        });

        cells.push(
            <DynamicGridColumnContextProvider columnIndex={index} key={key}>
                <CellComponent
                    key={key}
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
                    backgroundStyle={backgroundStyle}
                    cursor={cursor}
                    hoverBackgroundStyle={hoverBackgroundStyle}
                    {...paddingNull}
                    valign="center"
                />
            </DynamicGridColumnContextProvider>
        );
    });

    if (extraRowDynamicSubColumns?.length) {
        dynamicColumnsGridData.forEach((value: number | Date, index) => {
            let key = '';
            const renderValues = {} as { date?: Date; value?: number };

            if (value instanceof Date) {
                renderValues.date = value;
                key += keyPrefix + value.getTime();
            } else {
                renderValues.value = value as number;
                key += keyPrefix + value;
            }
            extraRowDynamicSubColumns.forEach((subColumn, subIndex) => {
                const cellProps = subColumn.getCellProps?.() || {};
                const backgroundStyle = cellProps?.backgroundStyle || 'unaccented';
                const cursor = cellProps?.cursor || 'pointer';

                const ContentRender = React.cloneElement(subColumn.render, {
                    renderValues,
                });
                cells.push(
                    <DynamicGridColumnContextProvider key={key + subColumn.key} columnIndex={index}>
                        <CellComponent
                            key={key + subColumn.key}
                            render={ContentRender}
                            startRowspanIndex={superRowsCount + 2}
                            startColspanIndex={index * basicColspan + subIndex + 1}
                            backgroundStyle={backgroundStyle}
                            cursor={cursor}
                            hoverBackgroundStyle={hoverBackgroundStyle}
                            valign="center"
                            halign="center"
                            {...paddingNull}
                            {...cellProps}
                        />
                    </DynamicGridColumnContextProvider>
                );
            });
        });
    }

    return cells;
}

export const ExtraRowDynamicCellsMemo = React.memo(ExtraRowDynamicCells);

export function getPreparedExtraRowDynamicColumnProps(
    props: IGetPreparedExtraRowDynamicColumnProps
) {
    const {
        extraRowDynamicColumn,
        extraRowDynamicSubColumns,
        extraRowDynamicSuperColumns,
        dynamicColumn,
        dynamicColumnsCount,
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
    } = props;

    const basicColspan = dynamicColumn.subColumns ? dynamicColumn.subColumns.length : 1;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps,
        key: keyPrefix,
        className: hoverClassName,
        render: (
            <ExtraRowDynamicCellsMemo
                render={extraRowDynamicColumn.render}
                getCellProps={extraRowDynamicColumn.getCellProps}
                dynamicColumnsGridData={dynamicColumnsGridData}
                extraRowDynamicSubColumns={extraRowDynamicSubColumns}
                extraRowDynamicSuperColumns={extraRowDynamicSuperColumns}
                extraRowDynamicCellsClassNameCallback={extraRowDynamicCellsClassNameCallback}
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
            />
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
