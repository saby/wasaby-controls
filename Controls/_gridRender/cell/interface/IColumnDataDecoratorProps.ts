import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IFontProps } from 'Controls/interface';
import type { TOverflow, GridDataCell } from 'Controls/gridDisplay';

export interface IGridColumnDataDecoratorProps<TValue = unknown> extends IColumnDataDecoratorProps {
    value: TValue;
    textOverflow: TOverflow;
    highlightedValue?: string | number | string[];
    displayTypeOptions?: object;
    column?: GridDataCell;
    onMouseMove?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onTouchStart?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;
    className?: string;
}

/**
 * Свойства рендера
 * @public
 */
export interface IColumnDataDecoratorProps extends IFontProps, TInternalProps {
    /**
     * Определяет, следует ли использовать подсветку данных при поиске
     * @cfg
     * @default true
     */
    searchHighlight?: boolean;

    /**
     * Определяет, следует ли использовать разделители группы. Используется для декоратора Number.
     * @cfg
     * @default true
     * @demo Controls-demo/Decorator/Number/UseGrouping/Index
     */
    useGrouping?: boolean;

    /**
     * Определяет, отображать ли нули в конце десятичной части. Используется для декоратора Number, Money
     * @cfg
     * @default false
     * @demo Controls-demo/Decorator/Money/ShowEmptyDecimals/Index
     * @demo Controls-demo/Decorator/Number/ShowEmptyDecimals/Index
     */
    showEmptyDecimals?: boolean;

    /**
     * Количество знаков после запятой. Диапазон от 0 до 20. Используется для декоратора Number
     * @cfg
     * @demo Controls-demo/Decorator/Number/Precision/Index
     */
    precision?: number;

    /**
     * Определяет режим отображения 'только для чтения'. Используется для декоратора Number, Money, Date
     * @cfg
     */
    readOnly?: boolean;

    /**
     * Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
     * @cfg
     */
    tooltip: string;

    /**
     * Вариант подчеркивания hovered | none. Используется для декоратора Number, Money
     * @cfg
     * @default none
     */
    underline?: 'hovered' | 'none';

    /**
     * Определяет, будут ли отображаться только неотрицательные числа.
     * @cfg
     * @default false
     */
    onlyPositive: boolean;
}
