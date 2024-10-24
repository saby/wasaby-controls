/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListMobileDataFactory } from './ListMobile/_interface/IListMobileDataFactory';

import loadData from './ListMobile/loadData';
import slice from './ListMobile/Slice';

/**
 * Фабрика данных списка.
 * @class Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactory
 * @public
 */

/**
 * @name Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactory#slice
 * @cfg {Controls-Lists/_dataFactory/ListMobile/Slice} Слайс списка.
 */

/**
 * Метод загрузки данных для списка.
 * @function Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactory#loadData
 * @param {Controls/_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments} config Аргументы фабрики данных списка.
 */
const listDataFactory: IListMobileDataFactory = {
    loadData,
    slice,
};

export default listDataFactory;
