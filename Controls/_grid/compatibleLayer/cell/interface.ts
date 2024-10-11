import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import {
    IFontSizeOptions,
    IFontWeightOptions,
    IFontColorStyleOptions,
    TTagStyle,
} from 'Controls/interface';
import { GridRow, GridDataCell, TCellHorizontalAlign } from 'Controls/baseGrid';
import { TCursor } from 'Controls/baseList';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';

export interface ICompatibleCellComponentProps
    extends TInternalProps,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions {
    column: GridDataCell;
    item: GridRow;

    children?: React.ReactElement;
    contentTemplate: React.ReactElement;
    beforeContentTemplate: React.Component | React.FunctionComponent;
    afterContentTemplate: React.Component | React.FunctionComponent;

    tagStyle: TTagStyle;

    itemActionsTemplate: React.Component | React.FunctionComponent;
    itemActionsClass: string;

    ladderWrapper: React.Component | React.FunctionComponent;
    multiSelectTemplate: React.Component | React.FunctionComponent;

    hoverBackgroundStyle: string;
    backgroundColorStyle: string;
    highlightOnHover: boolean;
    editable: boolean;
    cursor: TCursor;
    align: TCellHorizontalAlign;

    onTagClick: (event: React.BaseSyntheticEvent, item: GridRow, columnIndex: number) => void;
    onTagHover: (event: React.BaseSyntheticEvent, item: GridRow, columnIndex: number) => void;

    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onClick?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    onKeyDown?: Function;
    className?: string;
    dataName?: string;
}

// Свойства wasaby-совместимого шаблона ячейки грида
export interface ICompatibleCellComponentPropsConverterProps<T extends ICellComponentProps>
    extends ICompatibleCellComponentProps {
    // Функция, возвращающая пропсы, которые будут переданы в компонент ячейки,
    // и продублированы с незначительными изменениями в contentTemplate.
    getCompatibleCellComponentProps: (props: ICompatibleCellComponentProps) => Partial<T>;
    // Функция, возвращающая contentRender для вставки в компонент ячейки.
    getCompatibleCellContentRender?: (
        props: ICompatibleCellComponentPropsConverterProps<ICellComponentProps>,
        compatibleContentRenderProps: Partial<ICellComponentProps>
    ) => React.ReactElement;
    // Ссылка на компонент ячейки
    _$FunctionalCellComponent?: React.FunctionComponent;
}
