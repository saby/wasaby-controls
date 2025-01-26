/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    abstractLoadData,
    IAbstractListDataFactoryLoadResult,
} from 'Controls-DataEnv/abstractList';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { IRouter } from 'Router/router';
import type {
    NewSourceController,
    ISourceControllerOptions,
    ISourceControllerLoadResult,
} from 'Controls/dataSource';
import { IListDataFactoryArguments } from './interface/factory/IListDataFactoryArguments';
import { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';
import { getConfigAfterLoadError } from './loadData/getConfigAfterLoadError';
import { IListSavedState } from './interface/IListSavedState';
import { USER } from 'ParametersWebAPI/Scope';
import { TItemsOrder } from 'Controls-DataEnv/newLists/_listTypes/TItemsOrder';
import { Logger } from 'UI/Utils';

/**
 * Функция загрузки конфигурации списочного слайса с предварительной валидацией
 * */
export default async function loadData(
    config: IListDataFactoryArguments,
    _dependenciesResults: {},
    _Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    // Можно удалить после выпуска 25.1100. Удалю когда буду переписывать на утилиты
    if (!config.filterDescription && config.filterButtonSource) {
        config.filterDescription = config.filterButtonSource;
        Logger.error(
            'Controls/dataFactory:List: Свойство filterButtonSource устарело. Вместо него необходимо использовать filterDescription'
        );
    }
    const abstractLoadDataResult = await abstractLoadData(
        {
            ...config,
            isLatestInteractorVersion:
                config.isLatestInteractorVersion === undefined
                    ? true
                    : config.isLatestInteractorVersion,
        },
        _dependenciesResults,
        _Router,
        _clearResult,
        fabricId
    );
    const sourceController = getSourceController({
        ...config,
        ...abstractLoadDataResult,
        loadTimeout: config.loadDataTimeout,
        storeId: config.listConfigStoreId || fabricId,
    });
    const loadDataPromise = sourceController.loadData();
    const propStorageId = config.propStorageId;
    let loadParamsPromise;

    if (propStorageId) {
        loadParamsPromise = Promise.all([
            loadItemsOrder(propStorageId),
            loadStoredColumnsWidth(propStorageId),
        ]);
    }

    return Promise.all([loadDataPromise, loadParamsPromise]).then(
        async ([dataResult, loadParamsResult]) => {
            return {
                ...(await getLoadResult(
                    config,
                    dataResult,
                    loadParamsResult,
                    abstractLoadDataResult,
                    _clearResult
                )),
                sourceController,
            };
        }
    );
}
/**
 * Функция загрузки сохраненного состояния списка
 * */
export function getListState(listConfigStoreId: string): IListSavedState | undefined {
    const dataSourceLib = loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
    return dataSourceLib.getControllerState(listConfigStoreId) as IListSavedState | undefined;
}

/**
 * Функция добавления состояния из контроллера в основной состояние
 * */
async function getLoadResult(
    config: IListDataFactoryArguments,
    dataResult: ISourceControllerLoadResult,
    loadParamsResult:
        | [TItemsOrder | undefined, { storedColumnsWidths?: Record<string, string> }]
        | undefined,
    abstractLoadDataResult: IAbstractListDataFactoryLoadResult,
    _clearResult: boolean = false
): Promise<IListDataFactoryLoadResult> {
    const loadResult = {
        type: 'list',
        ...dataResult,
        itemsOrder: loadParamsResult?.[0],
        storedColumnsWidths:
            loadParamsResult?.[1].storedColumnsWidths || config.storedColumnsWidths,
        isLatestInteractorVersion: abstractLoadDataResult.isLatestInteractorVersion,
    };
    let result;

    if (!_clearResult) {
        result = {
            ...config,
            ...loadResult,
        };
        delete result.sliceExtraValues;
        delete result.loaderExtraValues;
    } else {
        result = loadResult;
    }

    if (result.error) {
        return getConfigAfterLoadError(result, result.error, {
            root: config.root,
        });
    } else {
        return Promise.resolve(result);
    }
}

function loadItemsOrder(propStorageId: string): Promise<TItemsOrder | undefined> {
    const itemsOrderUserParamId = propStorageId + '-itemsOrder';
    return USER.load([itemsOrderUserParamId]).then((userParams) => {
        return userParams.get(itemsOrderUserParamId) as TItemsOrder | undefined;
    });
}

function loadStoredColumnsWidth<T extends string[] = string[]>(
    propStorageId: string
): Promise<Record<T[number], unknown>> {
    return loadAsync<typeof import('Controls/Application/SettingsController')>(
        'Controls/Application/SettingsController'
    ).then((result) => result.loadSavedConfig(propStorageId, ['storedColumnsWidths']));
}

/**
 * Функция загрузки сохраненного состояния списка
 * */
export function getSourceController(
    options: ISourceControllerOptions & { sourceController?: NewSourceController }
): NewSourceController {
    let sourceController;

    if (options.sourceController) {
        sourceController = options.sourceController;
        sourceController.updateOptions(options);
    } else {
        const controllerClass =
            loadSync<typeof import('Controls/dataSource')>(
                'Controls/dataSource'
            ).NewSourceController;
        sourceController = new controllerClass(options);
    }

    return sourceController;
}
