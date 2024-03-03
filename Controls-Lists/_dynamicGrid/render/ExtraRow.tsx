import * as React from 'react';
import { IHeaderConfig, IFooterConfig, CellComponent, ICellProps } from 'Controls/gridReact';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode } from '../interfaces/IDynamicGridComponent';
import { IRange, IQuantum } from '../interfaces/IEventRenderProps';
import { correctServerSideDateForRender } from 'Controls-Lists/_dynamicGrid/render/utils';

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
    extraRowDynamicColumn: IHeaderConfig | IFooterConfig;
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
}

function ExtraRowDynamicCells(props: IExtraRowDynamicCellsProps) {
    const {
        render,
        dynamicColumnsGridData,
        extraRowDynamicCellsClassNameCallback,
        columnsSpacing,
        quantum,
        dataDensity,
        hoverMode,
        keyPrefix,
        hoverBackgroundStyle,
        range,
        filtered,
    } = props;

    const cells = [];

    const cellProps = props.getCellProps?.();
    const backgroundStyle = cellProps?.backgroundStyle || 'unaccented';

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

        const ContentRender = React.cloneElement(render, {
            renderValues,
        });

        cells.push(
            <CellComponent
                key={key}
                className={extraRowDynamicCellsClassNameCallback({
                    value,
                    columnsSpacing,
                    quantum,
                    dataDensity,
                    hoverMode,
                    range,
                    filtered,
                })}
                render={ContentRender}
                paddingLeft={null}
                paddingRight={null}
                paddingTop={null}
                paddingBottom={null}
                startRowspanIndex={1}
                backgroundStyle={backgroundStyle}
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
        getCellProps,
        extraRowDynamicCellsClassNameCallback,
        range,
        filtered,
    } = props;

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
                extraRowDynamicCellsClassNameCallback={extraRowDynamicCellsClassNameCallback}
                columnsSpacing={columnsSpacing}
                quantum={quantum}
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
