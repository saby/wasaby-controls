import { IAbstractListDataFactory } from './interface/factory/IAbstractListDataFactory';
import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import { IRouter } from 'Router/router';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

const ABSTRACT_LIST_LOADER_MODULE = 'Controls-DataEnv/abstractListLoader';

/**
 * Функция для загрузки данных списка
 * */
export const abstractLoadData: IAbstractListDataFactory['loadData'] = async (
    dataFactoryArguments,
    _dependenciesResults: {},
    _Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
): Promise<IAbstractListDataFactoryLoadResult> => {
    const { abstractListEnvLoader } = await loadAsync<
        typeof import('Controls-DataEnv/abstractListLoader')
    >(ABSTRACT_LIST_LOADER_MODULE);

    return abstractListEnvLoader(dataFactoryArguments, fabricId);
};
