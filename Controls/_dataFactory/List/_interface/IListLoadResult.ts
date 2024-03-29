import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { ISortingOptions, TKey, TFilter } from 'Controls/interface';
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

export interface IListLoadResult extends ISortingOptions {
    items: RecordSet;
    filterDescription?: IFilterItem[];
    expandedItems?: TKey[];
    collapsedGroups?: string[];
    storedColumnsWidths?: Record<string, string>;
    filter: TFilter;
    error?: Error;
    viewMode?: string;
    root?: TKey;
}
