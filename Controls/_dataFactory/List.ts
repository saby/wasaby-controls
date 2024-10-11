/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListDataFactory } from './List/_interface/IListDataFactory';
import loadData from './List/loadData';
import slice from './List/Slice';

/**
 * Фабрика данных списка.
 * Является дженериком. Принимает параметр State - тип состояния слайса
 * @class Controls/_dataFactory/List/_interface/IListDataFactory
 * @public
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactory#slice
 * @cfg {Controls/_dataFactory/List/Slice} Слайс списка.
 */

/**
 * Метод загрузки данных для списка.
 * @function Controls/_dataFactory/List/_interface/IListDataFactory#loadData
 * @param {Controls/_dataFactory/List/_interface/IListDataFactoryArguments} config Аргументы фабрики данных списка.
 */
const listDataFactory: IListDataFactory = {
    loadData,
    slice,
};

export default listDataFactory;
