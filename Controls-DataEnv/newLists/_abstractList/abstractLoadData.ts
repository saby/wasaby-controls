import { IAbstractListDataFactory } from './interface/factory/IAbstractListDataFactory';
import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import * as ErrorDescriptors from './ErrorDescriptors';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { IAction } from './interface/IAbstractListStateParts/IActionsState';
import { Initializer } from './Initializer';
import { prepareFilterIfNeed } from './loadData/prepareFilter';
import { isString } from './validators/predicates';
import { getUnloadedDeps, load } from 'Controls-DataEnv/staticLoader';
import { IRouter } from 'Router/router';

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
    if (!dataFactoryArguments) {
        throw ErrorDescriptors.MISSING_ARGS_IN_LOAD_DATA();
    }

    const {
        viewMode,
        items,
        collectionType,
        markerVisibility = 'hidden',
        multiSelectVisibility = 'hidden',
        nodeProperty,
        markedKey,
    } = dataFactoryArguments;

    if (typeof dataFactoryArguments.isLatestInteractorVersion !== 'boolean') {
        throw ErrorDescriptors.MISSING_VERSION_IN_LOAD_DATA();
    }
    const isLatestInteractorVersion = dataFactoryArguments.isLatestInteractorVersion;

    const [filterLoadResult] = await Promise.all([
        prepareFilterIfNeed(dataFactoryArguments, fabricId),
        loadColumns(dataFactoryArguments),
        loadListActions(dataFactoryArguments),
        getUnloadedDeps(
            {
                nodeProperty,
                isLatestInteractorVersion,
                viewMode,
                items,
                collectionType,
                markerVisibility,
                multiSelectVisibility,
                markedKey,
                isDebugging: !!Initializer.core.getDebugCookie(),
            },
            true
        ),
    ]);

    return {
        ...filterLoadResult,
        isLatestInteractorVersion,
    };
};

async function loadColumns(config: IAbstractListDataFactoryArguments): Promise<void> {
    await load([config.header, config.columns].filter(isString));
}

/**
 * Функция для загрузки набора экшенов для панели массовых операций
 * */
async function loadListActions(config: IAbstractListDataFactoryArguments): Promise<void> {
    await loadActions([config.listActions, config.itemActions].filter(isString));
}

/**
 * Функция для загрузки модулей экшенов для панели массовых операций
 * */
async function loadActions(listActionsModulesPaths: string[]): Promise<void> {
    const listActionsModules = await load(listActionsModulesPaths);
    const listActionsSubmodulesPromises: Promise<unknown>[] = [];

    for (const listActions of listActionsModules) {
        if (!listActions) {
            continue;
        }
        if (listActions instanceof Array) {
            const modules = listActions
                .filter((actionCfg) => !!(actionCfg as IAction).actionName)
                .map((actionCfg) => actionCfg.actionName as string);

            listActionsSubmodulesPromises.push(load(modules));
        }
    }

    await Promise.all(listActionsSubmodulesPromises);
}
