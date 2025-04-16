/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListDataFactoryArguments, IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import { listDataLoader } from './listDataLoader';
import { listEnvLoader } from './listEnvLoader';

/**
 * Функция загрузки конфигурации списочного слайса с предварительной валидацией
 * */
export async function listLoader(
    config: IListDataFactoryArguments,
    clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    const isLatestInteractorVersion =
        config.isLatestInteractorVersion === undefined ? true : config.isLatestInteractorVersion;

    const [loadDataResult] = await Promise.all([
        listDataLoader(config, clearResult, fabricId),
        listEnvLoader(config, fabricId),
    ]);

    return {
        ...loadDataResult,
        isLatestInteractorVersion,
    };
}
