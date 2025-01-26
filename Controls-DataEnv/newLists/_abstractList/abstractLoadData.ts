import { IAbstractListDataFactory } from './interface/factory/IAbstractListDataFactory';
import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import * as ErrorDescriptors from './ErrorDescriptors';

import { getUnloadedDeps, UI_DEPENDENCIES } from 'Controls-DataEnv/staticLoader';

/**
 * Функция для загрузки данных списка
 * */
export const abstractLoadData: IAbstractListDataFactory['loadData'] = async (
    dataFactoryArguments
): Promise<IAbstractListDataFactoryLoadResult> => {
    if (!dataFactoryArguments) {
        throw ErrorDescriptors.MISSING_ARGS_IN_LOAD_DATA();
    }

    const { viewMode } = dataFactoryArguments;

    const isLatestInteractorVersion =
        typeof dataFactoryArguments.isLatestInteractorVersion === 'boolean'
            ? dataFactoryArguments.isLatestInteractorVersion
            : true;

    await getUnloadedDeps({ isLatestInteractorVersion, viewMode }, UI_DEPENDENCIES, true);

    return {
        isLatestInteractorVersion,
    };
};
