/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Направление сортировки
 * @typedef {String} Controls/_interface/ISorting/TSortingValue
 * @variant ASC По возрастанию
 * @variant DESC По убыванию
 */
export type TSortingValue = 'ASC' | 'DESC';

/**
 * Тип объекта для опции {@link Controls/_interface/ISorting#sorting}
 * @typedef {Record.<String,TSortingValue>} Controls/_interface/ISorting/TSorting
 * @variant Record<string,TSortingValue> Ключ - название поля сортировки, значение - {@link Controls/interface/TSortingValue.typedef направление сортировки}.
 */
export type TSorting = Record<string, TSortingValue>;
export type TSortingOptionValue = TSorting[] | TSorting;

export interface ISortingOptions {
    sorting?: any;
}

/**
 * Интерфейс для контролов, реализующих сортировку.
 * @public
 */
export default interface ISorting {
    readonly '[Controls/_interface/ISorting]': boolean;
}

/**
 * @name Controls/_interface/ISorting#sorting
 * @cfg {Array.<Controls/_interface/ISorting/TSorting.typedef>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 * @remark
 * Допустимы значения направления сортировки ASC/DESC.
 *
 * * В таблицах можно изменять сортировку нажатием кнопки сортировки в конкретной ячейке заголовкв таблицы. Для этого нужно в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ конфигурации ячейки шапки} задать свойство {@link Controls/grid:IHeaderCell#sortingProperty sortingProperty}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/sorting/ здесь}
 *
 * * При отсутствии заголовков в реестре можно воспользоваться кнопкой открытия меню сортировки. Для этого нужно добавить на страницу и настроить контрол {@link Controls/sorting:Selector}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/table/ здесь}
 *
 * Выбранную сортировку можно сохранять. Для этого используют опцию {@link Controls/grid:IPropStorage#propStorageId propStorageId}.
 * @demo Controls-demo/treeGridNew/Sorting/Index
 * @example
 * <pre class="brush: js; highlight: [2,4]">
 * // TypeScript
 * protected _sorting: {[p: string]: 'ASC' | 'DESC'}[] = [],
 * protected _beforeMount(): void {
 *    this._sorting = [{ price: 'DESC' }];
 *    this._columns = [{displayProperty: 'name'}, { displayProperty: 'price'}, {displayProperty: 'balance'}]
 * }
 * </pre>
 *
 * И связать опцию sorting со свойством контрола.
 *
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.grid:View
 *    source="{{_viewSource}}"
 *    columns="{{_columns}}"
 *    bind:sorting="_sorting" />
 * </pre>
 * @see Controls/sorting:Selector
 */
