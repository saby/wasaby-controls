import * as React from 'react';
import { IHeaderConfig, IFooterConfig, CellComponent } from 'Controls/gridReact';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode } from '../interfaces/IDynamicGridComponent';

export type IExtraRowDynamicCellsColspanCallback<TColumnKey = unknown> = (
    columnKey: TColumnKey,
    index: number
) => number;

export interface IGetExtraRowDynamicCellClassNameBaseProps {
    value: number | Date;
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode: THoverMode;
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
    extraRowDynamicCellsColspanCallback?: IExtraRowDynamicCellsColspanCallback;
    extraRowDynamicCellsClassNameCallback: TExtraRowDynamicCellsClassNameCallback;
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode?: THoverMode;
    keyPrefix: string;
    hoverBackgroundStyle?: string;
}

export interface IGetPreparedExtraRowDynamicColumnBaseProps extends IBaseDynamicColumnProps {
    extraRowDynamicColumn: IHeaderConfig | IFooterConfig;
    extraRowDynamicCellsColspanCallback?: IExtraRowDynamicCellsColspanCallback;
    dynamicColumnsGridData: unknown[];
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode?: THoverMode;
}

export interface IGetPreparedExtraRowDynamicColumnProps
    extends IGetPreparedExtraRowDynamicColumnBaseProps {
    keyPrefix: string;
    hoverClassName?: string;
    cellHoverBackgroundStyle?: string;
    extraRowDynamicCellsClassNameCallback: TExtraRowDynamicCellsClassNameCallback;
}

function ExtraRowDynamicCells(props: IExtraRowDynamicCellsProps) {
    const {
        render,
        dynamicColumnsGridData,
        extraRowDynamicCellsColspanCallback,
        extraRowDynamicCellsClassNameCallback,
        columnsSpacing,
        quantum,
        dataDensity,
        hoverMode,
        keyPrefix,
        hoverBackgroundStyle,
    } = props;

    const cells = [];

    let colspanSize = 1;
    dynamicColumnsGridData.forEach((value: number | Date, index) => {
        // Пропускаем заколспаненные ячейки
        if (colspanSize > 1) {
            colspanSize--;
            return;
        }

        let key;
        const renderValues = {} as { date?: Date; value?: number };

        if (value instanceof Date) {
            renderValues.date = value;
            key = keyPrefix + value.getTime();
        } else {
            renderValues.value = value as number;
            key = keyPrefix + value;
        }

        const ContentRender = React.cloneElement(render, {
            renderValues,
        });

        colspanSize = extraRowDynamicCellsColspanCallback
            ? extraRowDynamicCellsColspanCallback(value, index)
            : 1;

        const colspanStart = index + 1;
        const colspanEnd = colspanStart + colspanSize;

        cells.push(
            <CellComponent
                key={key}
                className={extraRowDynamicCellsClassNameCallback({
                    value,
                    columnsSpacing,
                    quantum,
                    dataDensity,
                    hoverMode,
                })}
                render={ContentRender}
                paddingLeft={null}
                paddingRight={null}
                paddingTop={null}
                paddingBottom={null}
                startColspanIndex={colspanStart}
                endColspanIndex={colspanEnd}
                startRowspanIndex={1}
                backgroundStyle="unaccented"
                hoverBackgroundStyle={hoverBackgroundStyle}
                valign="center"
            />
        );
    });

    return cells;
}

export const ExtraRowDynamicCellsMemo = React.memo(ExtraRowDynamicCells);

export function getPreparedExtraRowDynamicColumnProps(
    props: IGetPreparedExtraRowDynamicColumnProps
) {
    const {
        extraRowDynamicColumn,
        extraRowDynamicCellsColspanCallback,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        quantum,
        dataDensity,
        hoverMode,
        keyPrefix,
        hoverClassName,
        cellHoverBackgroundStyle,
        extraRowDynamicCellsClassNameCallback,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: extraRowDynamicColumn.getCellProps,
        key: keyPrefix,
        className: hoverClassName,
        render: (
            <ExtraRowDynamicCellsMemo
                render={extraRowDynamicColumn.render}
                dynamicColumnsGridData={dynamicColumnsGridData}
                extraRowDynamicCellsColspanCallback={extraRowDynamicCellsColspanCallback}
                extraRowDynamicCellsClassNameCallback={extraRowDynamicCellsClassNameCallback}
                columnsSpacing={columnsSpacing}
                quantum={quantum}
                dataDensity={dataDensity}
                hoverMode={hoverMode}
                keyPrefix={keyPrefix}
                hoverBackgroundStyle={cellHoverBackgroundStyle}
            />
        ),
    });
}

export function getExtraRowDynamicCellClassName(
    props: IGetExtraRowDynamicCellClassNameProps
): string {
    const { value, hoverMode, classPrefix } = props;

    return `${classPrefix} js-${classPrefix} ${getExtraRowCellUniqueClass(
        value,
        classPrefix
    )} ${classPrefix}_${hoverMode}`;
}

export function getExtraRowCellUniqueClass(value: number | Date, classPrefix: string): string {
    if (value instanceof Date) {
        const h = value.getHours();
        const d = value.getDate();
        const m = value.getMonth();
        const y = value.getFullYear();

        return `js-${classPrefix}_${d}-${m}-${y}_${h}-00`;
    }
    return `js-${classPrefix}_${value}`;
}
