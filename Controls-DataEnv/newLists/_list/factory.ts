import { IListDataFactory } from './interface/factory/IListDataFactory';
import { default as loadData } from './loadData';
import { ListSlice as slice } from './ListSlice';
import getContextConfig from './getContextConfig';

/**
 * Фабрика данных списка.
 * Является дженериком. Принимает параметр State - тип состояния слайса
 */
const listDataFactory: IListDataFactory = {
    loadData,
    slice,
    getContextConfig,
};

export default listDataFactory;
