import {
    IListDataFactory,
    IListDataFactoryLoadResult,
} from './List/_interface/IListDataFactory';
import loadData from './List/loadData';
import slice from './List/Slice';

/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
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
