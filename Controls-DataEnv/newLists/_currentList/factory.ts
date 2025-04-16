import { factory as listDataFactory } from 'Controls-DataEnv/list';
import { CurrentListSlice as slice } from './CurrentListSlice';
import loadData from './loadData';
import { IListDataFactory } from './interface/factory/IListDataFactory';

/**
 * Фабрика данных текущего списка, содержащего операции с коллекциями
 * Является дженериком. Принимает параметр State - тип состояния слайса
 * @public
 */
const currentListDataFactory: IListDataFactory = {
    ...listDataFactory,
    loadData,
    slice,
};

export default currentListDataFactory;
