import * as React from 'react';
import type { IItemActionsHandler } from 'Controls/baseList';
import type {
    TShadowVisibility,
    TRowSeparatorSize,
    TColumnSeparatorSize,
    TGroupViewMode,
} from 'Controls/display';
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
    IBaseColumnConfig,
    IColspanProps,
    IRowspanProps,
    TItem,
    TColumnKey,
    THorizontalMarginSize,
} from 'Controls/_grid/gridReact/CommonInterface';
import type { IColumnSeparatorSizeConfig } from 'Controls/grid';

type Pixels = `${number}px`;
type Percents = `${number}%`;
type Fractures = `${number}fr`;
type Constants = 'auto' | 'min-content' | 'max-content';
type Units = Constants | Pixels | Percents | Fractures;
export type TColumnWidth = Units | `minmax(${Units}, ${Units})`;

export { TColumnKey };

/**
 * Тип для функции, возвращающая параметры ячейки
 * Принимает item: {@link Types/entity:Item} и должна возвращать {@link Controls/grid:ICellProps}
 * @typedef {Function} Controls/grid:TGetCellPropsCallback
 */
export type TGetCellPropsCallback = (item: TItem) => ICellProps;

/**
 * Тип для функции, возвращающая параметры ячейки в nodeFooter
 */
export type TGetCellNodeFooterPropsCallback = (item: TItem) => INodeFooterCellProps;

export type TRowSeparatorStyle = 'bold' | '';

export type { TRowSeparatorSize, TColumnSeparatorSize };

export type TCellType = 'ladder' | 'checkbox' | 'base';

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
 * Опции для задания ячейкам левого и правого отступа.
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
 * Опции ячейки, которые настраивает прикладник
 * @public
 */
export interface ICellProps
    extends IFontProps,
        IBackgroundProps,
        ICursorProps,
        IAlignProps,
        IBorderProps,
        ITextOverflowProps,
        ITooltipProps,
        ITagProps,
        IBorderRadiusProps {
    className?: string;
    /**
     * Отступы внутри ячейки
     * @remark Используется для настройки левого и правого отступа.
     * Для настройки верхнего и нижнего отступа используйте {IRowProps} опции строки.
     */
    padding?: IHorizontalCellPadding;

    /**
     * Текст подсказки при наведении на ячейку
     */
    tooltip?: string;

    /**
     * Доступна ли ячейка для редактирования при режиме редактирования по ячейкам.
     */
    editable?: boolean;

    /*
     * Стиль фона элемента.
     */
    backgroundColorStyle?: TBackgroundStyle;

    fixedZIndex?: number;
}

/**
 * Опции ячейки nodeFooter, которые настраивает прикладник
 * @public
 */
export interface INodeFooterCellProps extends ICellProps {
    minHeight?: 'null' | 'default';
}

/**
 * Конфигурация колонки
 * @interface Controls/_grid/dirtyRender/cell/interface/IColumnConfig
 * @public
 */
export interface IColumnConfig extends IBaseColumnConfig {
    /**
     * Поле, значение которого отрисовывается в этом поле.
     * Если задан render то это поле не нужно задавать.
     */
    displayProperty?: string;

    // region Width

    /**
     * Ширина колонки.
     * @remark
     * В качестве значения свойства можно указать пиксели (px), проценты (%), доли (1fr), "auto", "minmax", "max-content" и "min-content".
     * В значении "auto" ширина колонки устанавливается автоматически исходя из типа и содержимого элемента.
     * В значении "minmax(,)" ширина колонки устанавливается автоматически в рамках заданного интервала. Например, "minmax(600px, 1fr)" означает, что минимальная ширина колонки 600px, а максимальная — 1fr.
     * В значении "max-content" ширина колонки устанавливается автоматически в зависимости от самой большой ячейки. Например, если в первой строке ширина ячейки 100px, а во второй строке — 200px, тогда ширина колонки будет определена как 200px.
     * В значении "min-content" для колонки устанавливается наименьшая возможная ширина, при которой не возникает переполнения ячейки. Например, если в первой строке ячейка содержит контент "Первая строка", а во второй — "Содержимое второй строки" и включен перенос по словам, то ширина рассчитается по наиболее широкому непереносимому слову, а это слово "Содержимое" из второй строки.
     * Для браузеров, которые не поддерживают технологию {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}, не работает ширина колонки, указанная в долях, "auto" или "minmax". Для таких браузеров используйте свойство {@link compatibleWidth}.
     * При установке ширины фиксированным колонкам рекомендуется использовать абсолютные величины (px). От конфигурации ширины фиксированных колонок зависит ширина скроллируемой области. Например, при установке ширины фиксированной колонки 1fr её контент может растянуться на всю ширину таблицы, и в результате не останется свободного пространства для скролла.
     * @see compatibleWidth
     */
    width?: TColumnWidth;

    /**
     * Минимальная ширина колонки.
     */
    minWidth?: Pixels;

    /**
     * Максимальная ширина колонки.
     */
    maxWidth?: Pixels;

    /**
     * Ширина колонки в браузерах, не поддерживающих {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}.
     * @remark
     * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
     * @demo Controls-demo/gridNew/Columns/CellNoClickable/Index В демо-примере в конфигурации третьей колонки свойство compatibleWidth установлено в значение 98px.
     * @see width
     */
    compatibleWidth?: Pixels | Percents;

    // endregion Width

    /**
     * Компонент, используемый для отрисовки ячейки в режиме редактирования.
     */
    editorRender?: React.ReactElement;

    /**
     * @cfg {IColumnSeparatorSizeConfig} Ширина разделителей между колонками.
     * @default null
     * @remark
     * Ширину линии-разделителя между двумя колонками можно задать на любой из них (левую или правую соответственно).
     * В случае, если одна и та же граница была определена на двух ячейках, приоритет отдается ячейке, для которой эта граница является левой.
     */
    columnSeparatorSize?: IColumnSeparatorSizeConfig;
}

/**
 * Конфигурация ячейки заголовка
 * @public
 */
export interface IHeaderConfig extends IBaseColumnConfig, IColspanProps, IRowspanProps {
    /**
     * Текст заголовка ячейки
     */
    caption?: string;

    /**
     * Имя поля, по которому выполняется сортировка.
     * @remark
     * Если в конфигурации ячейки задать это свойство, то в заголовке таблицы в конкретной ячейке будет отображаться кнопка для изменения сортировки. Клик по кнопке будет менять порядок сортировки элементов на противоположный. При этом элементы будут отсортированы по полю, имя которого указано в свойстве sortingProperty. Одновременно можно сортировать только по одному полю.
     * @example
     * <pre class="brush: js">
     * _sorting: null,
     * _header: null,
     * _beforeMount: function(){
     *    this._sorting = [
     *       {
     *          price: 'DESC'
     *       },
     *       {
     *          balance: 'ASC'
     *       }
     *    ],
     *    this._header = [
     *       {
     *          title: 'Цена',
     *          sortingProperty: 'price'
     *       },
     *       {
     *          title: 'Остаток',
     *          sortingProperty: 'balance'
     *       }
     *    ];
     * }
     * </pre>
     */
    sortingProperty?: string;
}

/**
 * Конфигурация ячейки результатов
 * @public
 */
export interface IResultConfig extends IBaseColumnConfig, IColspanProps {}

/**
 * Конфигурация ячейки подвала
 * @public
 */
export interface IFooterConfig extends IBaseColumnConfig, IColspanProps {}

/**
 * Конфигурация ячейки подвала узла
 * @public
 */
export interface INodeFooterConfig extends IBaseColumnConfig {
    getCellProps?: TGetCellNodeFooterPropsCallback;
}

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

interface ICellComponentBorderProps extends IBorderProps {
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
        IBorderRadiusProps {
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

    // Тип ячейки
    cellType?: TCellType;
}
