import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    ISourceOptions,
    IDraggableOptions,
    ISortingOptions,
    TVisibility,
} from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';

import {
    IResultConfig,
    IFooterConfig,
    TRowSeparatorSize,
    TColumnSeparatorSize,
} from 'Controls/_gridRender/cell/interface/ICell';
import { IHeaderConfig } from 'Controls/_gridRender/cell/interface/IHeaderConfig';
import { IColumnConfig } from 'Controls/_gridRender/cell/interface/IColumnConfig';
import { TGetRowPropsCallback } from 'Controls/_gridRender/row/interface/IRowComponent';
import * as React from 'react';
import { IEmptyViewConfig } from 'Controls/_gridRender/cell/interface/ICell';
import { IEmptyViewProps } from 'Controls/_gridRender/row/interface/IEmpty';
import { TGetGroupPropsCallback } from 'Controls/_gridRender/interface/Group';

export type TItem = Model;

export type THorizontalMarginSize = 'xs' | 'null';

export interface IItemsContainerPadding {
    left?: THorizontalMarginSize;
    right?: THorizontalMarginSize;
}

export interface IDecorationStyleProps {
    // Режим декорирования. Замена "style", т.к. "style" - зарезервировано под передачу стилей
    decorationStyle?: 'master' | 'default';
}

/**
 * Интерфейс параметров объединения колонок
 * @public
 */
export interface IColspanProps {
    /**
     * Порядковый номер колонки, на которой начинается ячейка.
     * @cfg
     * @see endColumn
     */
    startColumn?: number;

    /**
     * Порядковый номер колонки, на которой заканчивается ячейка.
     * @cfg
     * @see startColumn
     */
    endColumn?: number;
}

/**
 * Интерфейс параметров объединения строк
 * @public
 */
export interface IRowspanProps {
    /**
     * Порядковый номер строки, на которой начинается ячейка.
     * @cfg
     * @see endRow
     */
    startRow?: number;

    /**
     * Порядковый номер строки, на которой заканчивается ячейка.
     * @cfg
     * @see startRow
     */
    endRow?: number;
}

/**
 * Размещение строки итогов
 * @typedef TResultsPosition
 * @variant top Сверху, под строкой заголовков
 * @variant bottom Внизу, над строкой подвала
 */
export type TResultsPosition = 'top' | 'bottom';

/**
 * Допустимые значения для опции {@link resultsVisibility}.
 * @typedef TResultsVisibility
 * @variant hasdata Отображается при наличии более 1 элемента в таблице.
 * @variant visible Отображается всегда, вне зависимости от количества элементов в таблице.
 * @variant hidden Строка итогов скрыта.
 */
export type TResultsVisibility = 'hasdata' | 'visible' | 'hidden';

/**
 * Интерфейс конфигурации таблицы со строкой итогов
 * @public
 */
export interface IGridResultsProps {
    /**
     * Конфигурация ячеек {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}
     * @cfg
     * @see resultsPosition
     * @see resultsVisibility
     */
    results?: IResultConfig[];

    /**
     * Позиция отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}.
     * @cfg
     * @default undefined
     * @demo Controls-demo/gridNew/Results/ResultsPosition/Index
     * @remark
     * В значении undefined строка итогов скрыта.
     * @result
     * @see results
     * @see resultsVisibility
     */
    resultsPosition?: TResultsPosition;

    /**
     * Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов} при наличии или отсутствии элементов.
     * @cfg
     * @demo Controls-demo/gridNew/Results/FromMeta/Index
     * @remark
     * Для отображения строки итогов необходимо задать значение в опции {@link resultsPosition}.
     * @default hasdata
     * @see results
     * @see resultsPosition
     */
    resultsVisibility?: TResultsVisibility;
}

/**
 * Опции таблицы с новым быстрым рендером на реакте.
 * @public
 */
export interface IGridProps
    extends ISourceOptions,
        IDraggableOptions,
        ISortingOptions,
        IItemActionsOptions,
        IGridResultsProps {
    items?: RecordSet;
    /**
     * Конфигурация ячеек {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапки таблицы}.
     * @cfg
     * @demo Controls-demo/gridNew/Header/Default/Index
     * @example
     * Пример 1. Для шапки задан отступ под знаки денег после запятой.
     * <pre class="brush: js;">
     *    import { View as GridView } from 'Controls/grid';
     *    import { IHeaderConfig } from 'Controls/gridRender';
     *    const header: IHeaderConfig[] = [
     *        {
     *            getCellProps() {
     *                return {
     *                    className: 'controls-Grid__cell_spacing_money'
     *                }
     *            }
     *        }
     *    ];
     *    function CustomControl() {
     *        return (
     *            <GridView header={header} columns={columns}/>
     *        );
     *    }
     * </pre>
     * @example
     * Пример 2. Конфигурация многострочной шапки.
     * <pre class="brush: js">
     *    const header: IHeaderConfig = [
     *       {
     *          caption: 'Name',
     *          startRow: 1,
     *          endRow: 3,
     *          startColumn: 1,
     *          endColumn: 2
     *       },
     *       {
     *          caption: 'Price',
     *          startRow: 1,
     *          endRow: 2,
     *          startColumn: 2,
     *          endColumn: 4
     *       },
     *       {
     *          caption: 'Cell',
     *          startRow: 2,
     *          endRow: 3,
     *          startColumn: 2,
     *          endColumn: 3
     *       },
     *       {
     *          caption: 'Residue',
     *          startRow: 2,
     *          endRow: 3,
     *          startColumn: 3,
     *          endColumn: 4
     *       }
     *    ];
     * </pre>
     */
    header?: IHeaderConfig[];
    /**
     * Конфигурация ячеек {@link /doc/platform/developmentapl/interface-development/controls/list/grid/footer/ подвала таблицы}.
     * @cfg
     */
    footer?: IFooterConfig[];
    /**
     * Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/ ячеек таблицы}.
     * @cfg
     * @remark
     * Если при отрисовске контрола данные не отображаются или выводится только их часть, то следует проверить {@link Controls/collection:RecordSet}, полученный от {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
     * Такой RecordSet должен содержать набор полей, которые заданы в конфигурации контрола в опции columns, а также сами данные для каждого поля.
     * @example
     * <pre class="brush: js;">
     *    import { View as GridView } from 'Controls/grid';
     *    import { IColumnConfig } from 'Controls/gridRender';
     *    const columns: IColumnConfig[] = [
     *       {
     *          displayProperty: 'name',
     *          width: '1fr',
     *          render: <CustomNameTemplate/>
     *       },
     *       {
     *          displayProperty: 'balance',
     *          width: 'auto',
     *          getCellProps() {
     *              return {
     *                  halign: 'right',
     *              }
     *          }
     *       }
     *    ];
     *    function CustomControl() {
     *        return <GridView storeId="listData" columns={columns}/>;
     *    }
     * </pre>
     */
    columns: IColumnConfig[];
    /**
     * Конфигурация ячеек {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ пустого представлния}
     * @cfg
     * @see emptyViewProps
     */
    emptyView?: IEmptyViewConfig[];
    /**
     * Объект со свойствами {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ пустого представлния}
     * @cfg
     * @see emptyView
     */
    emptyViewProps?: IEmptyViewProps;
    /**
     * Толщина линии-разделителя строк.
     * @cfg
     * @default null
     * @remark В значении null линия-разделители не отображается.
     * @see columnSeparatorSize
     */
    rowSeparatorSize?: TRowSeparatorSize;
    /**
     * Толщина {@link /doc/platform/developmentapl/interface-development/controls/list/grid/separator/#column линии-разделителя колонок}.
     * @cfg
     * @remark В значении null линия-разделители не отображается.
     * @default null
     * @see rowSeparatorSize
     */
    columnSeparatorSize?: TColumnSeparatorSize;
    /**
     * Функция, возвращающая {@link /doc/platform/developmentapl/interface-development/controls/list/grid/item/ свойства строки}
     * @cfg
     */
    getRowProps?: TGetRowPropsCallback;
    /**
     * Видимость множественного выбора строк
     * @cfg
     */
    multiSelectVisibility?: TVisibility;
    /**
     * Пользовательский рендер для отображения в заголовке группы
     * @cfg
     * @see getGroupProps
     */
    groupRender?: React.ReactElement;
    /**
     * Функция, возвращающая {@link Controls/grid:IGroupProps свойства группы}
     * @cfg
     * @see groupRender
     */
    getGroupProps?: TGetGroupPropsCallback;
}
