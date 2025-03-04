import type { TFilter } from 'Controls-DataEnv/interface';
import type { filter } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия для установки нового фильтра.
 * @function
 * @param {TFilter} filter Фильтр
 * @return filter.TSetFilterAction
 */
export const setFilter = (filter: TFilter): filter.TSetFilterAction =>
    aCreator('setFilter', {
        filter,
    });

/**
 * Конструктор действия для открытия окон фильтров.
 * @function
 * @return filter.TOpenFilterDetailPanelAction
 */
export const openFilterDetailPanel = (): filter.TOpenFilterDetailPanelAction =>
    aCreator('openFilterDetailPanel');

/**
 * Конструктор действия для закрытия окон фильтров.
 * @function
 * @return filter.TCloseFilterDetailPanelAction
 */
export const closeFilterDetailPanel = (): filter.TCloseFilterDetailPanelAction =>
    aCreator('closeFilterDetailPanel');
