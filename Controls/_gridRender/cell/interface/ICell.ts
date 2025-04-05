import * as React from 'react';
import type { IItemActionsHandler } from 'Controls/baseList';
import type { TShadowVisibility, TGroupViewMode } from 'Controls/display';
import {
    IFontProps,
    IBackgroundProps,
    IAlignProps,
    ICursorProps,
    IGridPaddingProps,
    TGridHPaddingSize,
    IMarkerProps,
    IActionsProps,
    IBorderProps,
    ITextOverflowProps,
    ITooltipProps,
    ITagProps,
    IStickyProps,
    TRoundBorderSize,
    TBackgroundStyle,
} from 'Controls/interface';
import {
    IColspanProps,
    THorizontalMarginSize,
} from 'Controls/_gridRender/interface/CommonInterface';
import { IBaseColumnConfig } from 'Controls/_gridRender/cell/interface/IBaseColumnConfig';
import { ICellProps } from 'Controls/_gridRender/cell/interface/ICellProps';
import type { IFooterColumn } from 'Controls/gridDisplay';

export type TRowSeparatorStyle = 'bold' | '';

/**
 * Варианты значений для опции rowSeparatorSize
 * @variant s тонкие разделители
 * @variant l толстые разделители
 * @variant null без разделителей
 */
export type TRowSeparatorSize = 's' | 'l' | 'null';

/**
 * Варианты значений для опции columnSeparatorSize
 * @typedef TColumnSeparatorSize
 * @variant s тонкие разделители
 * @variant null без разделителей
 */
export type TColumnSeparatorSize = 's' | 'null';

export type TCellType = 'ladder' | 'checkbox' | 'base';

export interface ICellTypeProps {
    cellType?: TCellType;
}

/**
 * Опции для задания ячейкам левого и правого отступа.
 * @public
 */
export interface IHorizontalCellPadding {
    /**
     * Отступ от левой границы ячейки.
     */
    left?: TGridHPaddingSize;

    /**
     * Отступ от правой границы ячейки.
     */
    right?: TGridHPaddingSize;
}

/**
 * Опции для задания ячейкам верхнего и нижнего разделителя.
 * @private
 */
export interface IVerticalSeparatorsConfig {
    /**
     * Размер верхнего разделителя ячейки
     */
    topSeparatorSize?: TRowSeparatorSize;

    /**
     * Размер нижнего разделителя ячейки
     */
    bottomSeparatorSize?: TRowSeparatorSize;

    /**
     * Стиль верхнего разделителя ячейки
     */
    topSeparatorStyle?: TRowSeparatorStyle;

    /**
     * Стиль нижнего разделителя ячейки
     */
    bottomSeparatorStyle?: TRowSeparatorStyle;
}

/**
 * Опции для задания ячейкам левого и правого разделителя.
 * @private
 */
export interface IHorizontalSeparatorsConfig {
    /**
     * Размер левого разделителя ячейки
     */
    leftSeparatorSize?: TColumnSeparatorSize;

    /**
     * Размер правого разделителя ячейки
     */
    rightSeparatorSize?: TColumnSeparatorSize;
}

/**
 * Опции для задания ячейкам скруглений
 * @private
 */
export interface IBorderRadiusProps {
    /**
     * Радиус скругления левого верхнего угла ячейки
     */
    topLeftBorderRadius?: TRoundBorderSize | 'master';
    /**
     * Радиус скругления правого верхнего угла ячейки
     */
    topRightBorderRadius?: TRoundBorderSize | 'master';
    /**
     * Радиус скругления правого нижнего угла ячейки
     */
    bottomRightBorderRadius?: TRoundBorderSize | 'master';
    /**
     * Радиус скругления левого нижнего угла ячейки
     */
    bottomLeftBorderRadius?: TRoundBorderSize | 'master';
}

/**
 * Опции ячейки nodeFooter, которые настраивает прикладник
 * @public
 */
export interface INodeFooterCellProps extends ICellProps {
    minHeight?: 'null' | 'default';
}

/**
 * Конфигурация ячейки результатов
 * @public
 */
export interface IResultConfig extends IBaseColumnConfig, IColspanProps {
    /**
     * Имя поля в объекте results из метаданных ответа БЛ.
     * Если задан {@link render} и {@link key} то это поле не нужно задавать.
     * @cfg
     */
    displayProperty?: string;
}

/**
 * Конфигурация ячейки подвала
 * @public
 */
export interface IFooterConfig extends IBaseColumnConfig, IFooterColumn, IColspanProps {}

/**
 * Конфигурация ячейки подвала узла
 * @public
 */
export interface INodeFooterConfig extends IBaseColumnConfig<INodeFooterCellProps> {}

/**
 * Конфигурация ячейки заголовка узла
 * @public
 */
export type INodeHeaderConfig = IBaseColumnConfig;

/**
 * Конфигурация ячейки пустого представления
 * @public
 */
export interface IEmptyViewConfig extends IBaseColumnConfig, IColspanProps {}

interface IMouseEventHandlers {
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onMouseOver?: React.MouseEventHandler;
}

export interface ICellComponentBorderProps extends IBorderProps {
    borderMode?: 'row' | 'cell';
}

export type TDisplayType =
    | null
    | 'block'
    | 'inline-block'
    | 'flex'
    | 'inline-flex'
    | 'contents'
    | 'hidden';

/**
 * Интерфейс опций компонента, который отображает ячейку
 * @private
 */
export interface ICellComponentProps
    extends IGridPaddingProps,
        IBackgroundProps,
        IMarkerProps,
        IActionsProps,
        IAlignProps,
        ICellComponentBorderProps,
        IFontProps,
        ICursorProps,
        ITooltipProps,
        ITagProps,
        IStickyProps,
        ITextOverflowProps,
        IMouseEventHandlers,
        IVerticalSeparatorsConfig,
        IHorizontalSeparatorsConfig,
        IBorderRadiusProps,
        ICellTypeProps {
    /**
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     */
    render: React.ReactElement;

    cCountStart?: number;
    cCountEnd?: number;
    className?: string;
    href?: string;
    style?: React.CSSProperties;
    displayType?: TDisplayType;

    minHeightClassName?: string;

    isFirstCell?: boolean;
    isLastCell?: boolean;

    actionHandlers?: IItemActionsHandler;

    startColspanIndex?: number;
    endColspanIndex?: number;

    startRowspanIndex?: number;
    endRowspanIndex?: number;

    // Должен быть интерфейс IShadowProps, но у нас есть свое значение dragging
    shadowVisibility?: TShadowVisibility;

    /**
     * Флаг, означает что ячейка прямо сейчас редактируется
     */
    editing?: boolean;
    /**
     * Флаг, означает что ячейка может редактироваться
     */
    editable?: boolean;
    /**
     * Число записей, которые переносятся через DragNDrop
     */
    draggingItemsCount?: number;
    /**
     * Отрисовывается ли в колонке стрелка редактирования
     */
    showEditArrow?: boolean;

    /**
     * Кастомные аттрибуты, которые вешаются на корневой div
     */
    attributes?: Record<string, unknown>;

    /**
     * Режим ховера - по ячейкам или по всей строке.
     */
    hoverMode?: 'cell' | 'row';

    /**
     * Минимальная высота ячейки
     */
    minHeight?: 'null' | 'default';
    tabIndex?: number;
    subPixelArtifactFix?: boolean;
    pixelRatioBugFix?: boolean;
    groupViewMode?: TGroupViewMode;
    // Вместо этого нужно использовать backgroundColor
    backgroundColorStyle?: TBackgroundStyle;
    dataName?: string;
    dataQa?: string;
    // Даём знать ячейке о том, что запись отмечена маркером
    isMarked?: boolean;
    isDragged?: boolean;
    marginLeft?: THorizontalMarginSize;
    marginRight?: THorizontalMarginSize;
    decorationStyle?: 'master' | 'default';
    contentRenderClassName?: string;

    // compatibility
    highlightOnHover?: boolean;
}
