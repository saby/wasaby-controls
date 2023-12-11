import * as React from 'react';
import {
    IColumnConfig,
    ICellProps,
    TColumnWidth,
    useItemData as useGridItemData,
    TGetRowPropsCallback,
} from 'Controls/gridReact';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode } from '../interfaces/IDynamicGridComponent';

export interface IBaseDynamicColumnProps {
    dynamicColumn: IColumnConfig;
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
    const { item } = useGridItemData([props.dataProperty]);
    const rowProps = props?.getRowProps?.(item) || {};
    let verticalPaddingClassName = '';
    if (rowProps?.padding?.top) {
        verticalPaddingClassName += ` ControlsLists-dynamicGrid__dynamicCellsWrapper_filled-cross-spacing-top_${rowProps.padding.top}`;
    }
    if (rowProps?.padding?.bottom) {
        verticalPaddingClassName += ` ControlsLists-dynamicGrid__dynamicCellsWrapper_filled-cross-spacing-bottom_${rowProps.padding.bottom}`;
    }
    const rowClassName = props.wrapperClassName + verticalPaddingClassName;
    return (
        <div className={rowClassName} style={props.wrapperStyle}>
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
        hoverMode,
        getRowProps,
        dataProperty,
    } = props;
    const wrapperStyle = {
        gridTemplateColumns: `repeat(${dynamicColumnsCount}, var(--dynamic-column_width))`,
    };
    let wrapperClassName =
        'ControlsLists-dynamicGrid__dynamicCellsWrapper' +
        ' js-ControlsLists-dynamicGrid__dynamicCellsWrapper' +
        ` ControlsLists-dynamicGrid__dynamicCellsWrapper_${hoverMode}`;
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
