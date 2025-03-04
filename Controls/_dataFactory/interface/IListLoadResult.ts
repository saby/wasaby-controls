/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListDataFactoryLoadResult } from 'Controls-DataEnv/currentList';
/**
 * Интерфейс возвращаемого значения метода загрузки списочных данных.
 * @interface Controls/_dataFactory/List/_interface/IListLoadResult
 * @implements Controls/interface:ISorting
 * @public
 * @deprecated Вместо этого типа необходимо использовать IListDataFactoryLoadResult
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
 * @cfg {Controls/interface/TItemsOrder} Определяет, будет ли отображение списка инвертировано
 */

export interface IListLoadResult extends IListDataFactoryLoadResult {}
