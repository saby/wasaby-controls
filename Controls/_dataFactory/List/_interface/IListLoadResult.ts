/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { ISortingOptions, TFilter, TKey, TItemsOrder } from 'Controls/interface';
import type { ErrorViewConfig } from 'Controls/error';
/**
 * Интерфейс возвращаемого значения метода загрузки списочных данных.
 * @interface Controls/_dataFactory/List/_interface/IListLoadResult
 * @implements Controls/interface:ISorting
 * @public
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#filterDescription
 * @cfg {Array.<Controls/filter:IFilterItem>} Элементы структуры фильтров.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#expandedItems
 * @cfg {Array<String | Number>} Ключи развернутых записей в списке.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#items
 * @cfg {RecordSet} Данные списка
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#filter
 * @cfg {Object} Фильтр списка
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#collapsedGroups
 * @cfg {Array<string, number>} Ключи свернутых групп
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#itemsOrder
 * @cfg {Array<string, number>} Ключи свернутых групп
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListLoadResult#itemsOrder
 * @cfg {Controls/interface:TItemsOrder} Определяет, будет ли отображение списка инвертировано
 * @variant default По умолчанию.
 * @variant reverse Инвертировать.
 */

export interface IListLoadResult extends ISortingOptions {
    items: RecordSet;
    filterDescription?: IFilterItem[];
    filterButtonSource?: IFilterItem[];
    expandedItems?: TKey[];
    collapsedGroups?: string[];
    storedColumnsWidths?: Record<string, string>;
    filter: TFilter;
    error?: Error;
    errorViewConfig?: ErrorViewConfig;
    viewMode?: string;
    root?: TKey;
    itemsOrder?: TItemsOrder;
}
