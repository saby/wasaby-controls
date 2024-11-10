/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { IColumnConfig, ICellProps, TColumnWidth, TGetRowPropsCallback } from 'Controls/gridReact';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode, IDynamicColumnConfig } from '../interfaces/IDynamicGridComponent';

export interface IBaseDynamicColumnProps {
    dynamicColumn: IDynamicColumnConfig;
    dynamicColumnsCount: number;
    columnsSpacing: TOffsetSize;
    getCellProps?: Function;
}

export interface IGetBaseDynamicColumnProps extends IBaseDynamicColumnProps {
    render: React.ReactElement;
    key: string;
    getRowProps?: TGetRowPropsCallback;
    width?: TColumnWidth;
    className?: string;
    hoverMode?: THoverMode;
    dataProperty: string;
}
interface IRowWrapperRender {
    render: React.ReactElement;
    dataProperty: string;
    getRowProps?: TGetRowPropsCallback;
    wrapperClassName?: string;
    wrapperStyle?: object;
}
export function RowWrapperRender(props: IRowWrapperRender): React.ReactElement {
    return (
        <div className={props.wrapperClassName} style={props.wrapperStyle}>
            {props.render}
        </div>
    );
}

/**
 * Функция генерации колонки основного Grid, предназначенной для вывода динамических колонок.
 * Шаблон данной колонки представляет собой Grid-layout, выводящий внутри себя набор динамических колонок
 * отрисовываемой строки.
 * @param props
 */
export function getBaseDynamicColumn(props: IGetBaseDynamicColumnProps): IColumnConfig {
    const {
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        render,
        width,
        key,
        className,
        getRowProps,
        dataProperty,
    } = props;
    let columnsCountWithSubColumns = dynamicColumnsCount;
    let subColumnsCount = 1;
    if (dynamicColumn.subColumns) {
        columnsCountWithSubColumns *= dynamicColumn.subColumns.length;
        subColumnsCount = dynamicColumn.subColumns.length;
    }
    const wrapperStyle = {
        gridTemplateColumns: `repeat(${columnsCountWithSubColumns}, calc(var(--dynamic-column_width) / ${subColumnsCount}))`,
    };
    let wrapperClassName =
        'ControlsLists-dynamicGrid__dynamicCellsWrapper' +
        ' js-ControlsLists-dynamicGrid__dynamicCellsWrapper';
    if (columnsSpacing) {
        wrapperClassName += ` ControlsLists-dynamicGrid__dynamicCellsWrapper_columns-spacing_${columnsSpacing}`;
    }
    if (className) {
        wrapperClassName += ` ${className}`;
    }
    return {
        ...dynamicColumn,
        width,
        key,
        render: React.createElement(RowWrapperRender, {
            wrapperClassName,
            wrapperStyle,
            render,
            getRowProps,
            dataProperty,
        }),
        getCellProps: (item): ICellProps => {
            // Внимание! Это CellProps большой ячейки внутри которой уже рендерится сетка.
            // Не надо путать getCellProps для тех и для других, они не доолжны пересекаться.
            // Запрашиваем пользовательские пропсы для ячейки.
            const cellProps = props.getCellProps?.(item);
            // Отступы отключаются, чтобы они не суммировались с отступами внутренних ячеек
            return {
                ...cellProps,
                padding: {
                    left: 'null',
                    right: 'null',
                },
                valign: 'center',
            };
        },
    };
}
