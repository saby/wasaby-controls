import { IAbstractListDataFactory } from './interface/factory/IAbstractListDataFactory';
import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';

import { getUnloadedDeps, UI_DEPENDENCIES } from 'Controls-DataEnv/staticLoader';

export const abstractLoadData: IAbstractListDataFactory['loadData'] = async (
    dataFactoryArguments = {}
): Promise<IAbstractListDataFactoryLoadResult> => {
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
