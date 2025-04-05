import { IAbstractListDataFactory } from './interface/factory/IAbstractListDataFactory';
import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import getError from './utils/getError';
import type { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import type { IAction } from './interface/IAbstractListStateParts/IActionsState';
import { Initializer } from './Initializer';
import { prepareFilterIfNeed } from './loadData/prepareFilter';
import { isBool, isDefined, isString } from './validators/predicates';
import { isValidActions } from './validators/actions';
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
        throw await getError('MISSING_ARGS_IN_LOAD_DATA');
    }

    const {
        viewMode: configViewMode,
        items,
        collectionType,
        markerVisibility = 'hidden',
        nodeProperty,
        markedKey,
        searchValue: configSearchValue,
        searchParam,
    } = dataFactoryArguments;
    const searchValue = Initializer.search.initSearchValue(configSearchValue, searchParam);
    const viewMode = Initializer.core.initViewMode(configViewMode, searchValue);

    const operationsPanelVisible =
        Initializer.operationsPanel.needOpenOperationsPanel(dataFactoryArguments);

    let multiSelectVisibility = dataFactoryArguments.multiSelectVisibility || 'hidden';

    // При включенной ПМО показываем чекбоксы всегда.
    if (
        Initializer.operationsPanel.needOpenOperationsPanel(dataFactoryArguments) &&
        multiSelectVisibility === 'hidden'
    ) {
        multiSelectVisibility = 'visible';
    }

    if (!isBool(dataFactoryArguments.isLatestInteractorVersion)) {
        throw await getError('MISSING_VERSION_IN_LOAD_DATA');
    }
    const isLatestInteractorVersion = dataFactoryArguments.isLatestInteractorVersion;

    const [filterLoadResult] = await Promise.all([
        prepareFilterIfNeed(dataFactoryArguments, fabricId),
        loadColumns(dataFactoryArguments),
        loadListActions(dataFactoryArguments),
        loadEmptyView(dataFactoryArguments),
        getUnloadedDeps(
            {
                nodeProperty,
                isLatestInteractorVersion,
                viewMode,
                items,
                collectionType,
                markerVisibility,
                multiSelectVisibility,
                operationsPanelVisible,
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
    await loadActions([config.listActions, config.itemActions].filter(isDefined));
}

/**
 * Функция для загрузки пустого представления
 * */
async function loadEmptyView(config: IAbstractListDataFactoryArguments): Promise<void> {
    if (isString(config.emptyView)) {
        await load(config.emptyView);
    }
}

/**
 * Функция для загрузки модулей экшенов для панели массовых операций
 * */
async function loadActions(listActionsModulesRaw: (string | IAction[])[]): Promise<void> {
    const listActionsModules: IAction[][] = [];

    for (const value of listActionsModulesRaw) {
        if (isString(value)) {
            const loaded = await load(value);
            if (isValidActions(loaded)) {
                listActionsModules.push(loaded);
            }
        } else {
            listActionsModules.push(value);
        }
    }
    const listActionsSubmodulesPromises: Promise<unknown>[] = [];

    for (const listActions of listActionsModules) {
        // TODO: Необходимо обобщить этот код с hasInteraction.
        //  Нужно получать из метода имена полей, которые содержать
        //  интерактивность, определенную строкой(actionName, commandName, viewCommandName и т.д.),
        //  а затем загружать их.
        const modules = listActions
            .filter((actionCfg) => !!(actionCfg as IAction).actionName)
            .map((actionCfg) => actionCfg.actionName as string);

        listActionsSubmodulesPromises.push(load(modules));
    }

    await Promise.all(listActionsSubmodulesPromises);
}
