import * as React from 'react';
import { IColumnConfig, ICellProps, TColumnWidth } from 'Controls/gridReact';
import { TOffsetSize } from 'Controls/interface';

export interface IBaseDynamicColumnProps {
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
    columnsSpacing: TOffsetSize;
    getCellProps?: Function;
}

export interface IGetBaseDynamicColumnProps extends IBaseDynamicColumnProps {
    render: React.ReactElement;
    key: string;
    width?: TColumnWidth;
    className?: string;
}

/**
 * Функция генерации колонки основного Grid, предназначенной для вывода динамических колонок.
 * Шаблон данной колонки представляет собой Grid-layout, выводящий внутри себя набор динамических колонок
 * отрисовываемой строки.
 * @param props
 */
export function getBaseDynamicColumn(props: IGetBaseDynamicColumnProps): IColumnConfig {
    const { dynamicColumn, dynamicColumnsCount, columnsSpacing, render, width, key, className } = props;
    const wrapperStyle = {
        gridTemplateColumns: `repeat(${dynamicColumnsCount}, var(--dynamic-column_width))`,
        '--dynamic-column_width': dynamicColumn.width,
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
        render: (
            <div className={wrapperClassName} style={wrapperStyle}>
                {render}
            </div>
        ),
        getCellProps: (item): ICellProps => {
            // Запрашивает пользовательские пропсы для ячейки
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
