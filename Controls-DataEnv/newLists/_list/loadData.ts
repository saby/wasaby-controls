/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IRouter } from 'Router/router';
import { IListDataFactoryArguments } from './interface/factory/IListDataFactoryArguments';
import { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

const LIST_LOADER_MODULE = 'Controls-DataEnv/listLoader';

/**
 * Функция загрузки конфигурации списочного слайса с предварительной валидацией
 * */
export default async function loadData(
    config: IListDataFactoryArguments,
    _dependenciesResults: {},
    _Router: IRouter,
    clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    const { listLoader } =
        await loadAsync<typeof import('Controls-DataEnv/listLoader')>(LIST_LOADER_MODULE);

    return listLoader(config, clearResult, fabricId);
}
