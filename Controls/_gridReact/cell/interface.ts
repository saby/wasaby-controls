import * as React from 'react';
import type { IItemActionsHandler } from 'Controls/baseList';
import type { TShadowVisibility } from 'Controls/display';
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
    ITagProps,} from 'Controls/interface';
import { TItem } from 'Controls/_gridReact/CommonInterface';

type Pixels = `${number}px`;
type Percents = `${number}%`;
type Fractures = `${number}fr`;
type Units = Pixels | Percents | Fractures;
export type TColumnWidth =
    | Units
    | 'auto'
    | `minmax(${Units}, ${Units})`
    | 'min-content'
    | 'max-content';

export type TGetCellPropsCallback = (item: TItem) => ICellProps;

/**
 * Опции для задания ячейкам левого и правого отступа.
 * @public
 */
export interface IHorizontalCellPadding {
    /**
     * Отступ от левой границы ячейки.
     */
    left: TGridHPaddingSize;

    /**
     * Отступ от правой границы ячейки.
     */
    right: TGridHPaddingSize;
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
        ITextOverflowProps,
        ITooltipProps,
        ITagProps {
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
   // TODO columnSeparatorSize, result, stickyProperty, displayType, editable, editorTemplate
}

/**
 * Конфигурация колонки
 * @public
 */
export interface IColumnConfig {
    /**
     * Уникиальный идентификатор каждой колонки.
     */
    key?: string | number;

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
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     */
    render?: React.ReactElement;

    /**
     * Компонент, используемый для отрисовки ячейки в режиме редактирования.
     */
    editorRender?: React.ReactElement;

    /**
     * Коллбэк, который возвращает настройки ячеек.
     * @remark Коллбэк и его результат должны быть мемоизированы.
     * Пересоздаваться по ссылке они должны только при наличии реальных изменений.
     */
    getCellProps?: TGetCellPropsCallback;
}

/**
 * Конфигурация колонки
 * @public
 */
export interface IHeaderConfig extends IAlignProps, ITextOverflowProps {
    /**
     * Уникиальный идентификатор каждой колонки.
     */
    key?: string;

    /**
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     */
    render?: React.ReactElement;

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

    /**
     * Порядковый номер строки, на которой начинается ячейка.
     * @see endRow
     */
    startRow?: number;

    /**
     * Порядковый номер строки, на которой заканчивается ячейка.
     * @see startRow
     */
    endRow?: number;

    /**
     * Порядковый номер колонки, на которой начинается ячейка.
     * @see endColumn
     */
    startColumn?: number;

    /**
     * Порядковый номер колонки, на которой заканчивается ячейка.
     * @see startColumn
     */
    endColumn?: number;
}

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
        IBorderProps,
        IFontProps,
        ICursorProps,
        ITooltipProps,
        ITextOverflowProps,
        ITagProps {
    /**
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     */
    render: React.ReactElement;

    className?: string;
    minHeightClassName?: string;

    isFirstCell: boolean;
    isLastCell: boolean;

    actionHandlers?: IItemActionsHandler;

    startColspanIndex?: number;
    endColspanIndex?: number;

    startRowspanIndex?: number;
    endRowspanIndex?: number;

    // Должен быть интерфейс IShadowProps, но у нас есть свое значение dragging
    shadowVisibility: TShadowVisibility;

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
}
