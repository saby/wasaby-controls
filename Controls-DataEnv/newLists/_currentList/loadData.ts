import { Initializer } from 'Controls-DataEnv/abstractList';
import { loadData as listLoadData } from 'Controls-DataEnv/list';
import { load } from 'Controls-DataEnv/staticLoader';

import { IListDataFactoryArguments } from './interface/factory/IListDataFactoryArguments';
import { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';

import { IRouter } from 'Router/router';

/**
 * Функция загрузки конфигурации списочного слайса с предварительной валидацией
 * */
export default async function loadData(
    config: IListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter,
    clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    const cfg = {
        ...config,
        isLatestInteractorVersion: false,
    };
    const [loadDataResult] = await Promise.all([
        listLoadData(cfg, dependenciesResults, Router, clearResult, fabricId),
        loadOperationsController(cfg),
    ]);

    return {
        ...loadDataResult,
        ...(clearResult
            ? { header: undefined, columns: undefined }
            : Initializer.columns.resolveColumnsStateSync(cfg, false)),
    };
}

function loadOperationsController(config: IListDataFactoryArguments): Promise<void> {
    if (config.operationsController && config.task1186833531) {
        return Promise.resolve();
    }

    return load('Controls/operations');
}
