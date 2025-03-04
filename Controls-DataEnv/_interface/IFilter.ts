import { QueryWhereExpression } from 'Types/source';

/**
 * Описание объекта фильтра
 */
export type TFilter = QueryWhereExpression<unknown>;

/**
 * Параметры конфигурации фильтра
 * */
export interface IFilterOptions {
    filter?: TFilter;
    onFilterChanged?: (filter: TFilter) => void;
}
