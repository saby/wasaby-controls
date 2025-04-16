import type { IListDataFactoryArguments, IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

const ABSTRACT_LIST_LOADER_MODULE = 'Controls-DataEnv/abstractListLoader';

/**
 * Функция для загрузки минимального числа данных, необходимых для работы списка
 * */
export async function listEnvLoader(
    config: IListDataFactoryArguments,
    fabricId?: string
): Promise<Omit<IListDataFactoryLoadResult, 'filter'>> {
    const { abstractListEnvLoader } = await loadAsync<
        typeof import('Controls-DataEnv/abstractListLoader')
    >(ABSTRACT_LIST_LOADER_MODULE);

    const isLatestInteractorVersion =
        config.isLatestInteractorVersion === undefined ? true : config.isLatestInteractorVersion;

    return abstractListEnvLoader(
        {
            ...config,
            isLatestInteractorVersion,
        },
        fabricId
    );
}
