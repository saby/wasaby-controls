/**
 * @kaizen_zone 7914d1d2-93e3-48b4-b91a-8062f9a41e69
 */
import { ICalculateFilterParams, ICalculatedFilter } from 'Controls/filterOld';
/**
 * Утилита для получения фильтра с историей
 * @class Controls/Utils/getCalculatedFilter
 * @public
 */

/**
 * @typedef {Object} Controls/Utils/getCalculatedFilter/ICalculateFilterParams
 * @description Параметры метода
 * @property {Array<Controls/filter:IFilterItem>} historyItems
 * @property {Array<Controls/filter:IFilterItem>} filterButtonSource
 * @property {String} historyId
 * @property {Object} filter
 */

/**
 * @typedef {Object} Controls/Utils/getCalculatedFilter/ICalculatedFilter
 * @description Параметры метода
 * @property {Array<Controls/filter:IFilterItem>} historyItems
 * @property {Controls/filter:IFilterItem} filterButtonItems
 * @property {Object} filter {@link Controls/list#filter}
 */

/**
 * Получить фильтр и структуру фильтров с учетом истории
 * @param {Controls/Utils/getCalculatedFilter/ICalculateFilterParams.typedef} params
 * @returns Promise<Controls/Utils/getCalculatedFilter/ICalculatedFilter.typedef>
 */
export default function getCalculatedFilter(
    params: ICalculateFilterParams
): Promise<ICalculatedFilter> {
    return import('Controls/filterOld').then((filter) => {
        return filter.ControllerClass.getCalculatedFilter(params);
    });
}
