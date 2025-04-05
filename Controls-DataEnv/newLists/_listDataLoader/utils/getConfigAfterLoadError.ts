/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import type { ErrorController, ErrorViewConfig, IProcessConfig } from 'Controls/error';
import { PromiseCanceledError } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import type { Direction } from 'Controls-DataEnv/listTypes';
import type { TLoadDataResult } from '../listDataLoader';
import type { IListState } from '../../_list/interface/IListState';

const ERROR_MODULE_NAME = 'Controls/error';
type TErrorImport = typeof import('Controls/error');

/**
 * @typedef {Enum} ErrorViewMode
 * @description Способы отображения шаблона с сообщением об ошибке.
 * @variant dialog В диалоговом окне.
 * @variant page Во всю страницу.
 * @variant include В области компонента (вместо содержимого).
 */
export enum ErrorViewMode {
    dialog = 'dialog',
    page = 'page',
    include = 'include',
    inlist = 'inlist',
}

/**
 * Конфигурация ошибки загрузки
 * @private
 * */
export type TErrorQueryConfig = {
    root?: TKey;
    loadKey?: TKey;
    direction?: Direction;
    action?: () => void;
};

/**
 * Расширение конфигурации ошибки
 * */
export type IProcessConfigWithTemplate = IProcessConfig & {
    templateOptions?: Record<string, unknown>;
};

/**
 * Получение конфигурации ошибки по выброшенной ошибке
 * */
export function getErrorConfig(
    queryConfig: TErrorQueryConfig,
    error: Error
): IProcessConfigWithTemplate {
    const { direction, root, loadKey } = queryConfig;
    let errorViewMode;

    if (direction && (loadKey === undefined || root === loadKey)) {
        errorViewMode = ErrorViewMode.inlist;
    } else if (loadKey !== undefined && root !== loadKey) {
        errorViewMode = ErrorViewMode.dialog;
    } else {
        errorViewMode = ErrorViewMode.include;
    }

    const resultConfig: IProcessConfigWithTemplate = {
        mode: errorViewMode,
        error,
    };

    if (direction) {
        resultConfig.templateOptions = {
            showInDirection: direction,
            action: queryConfig.action,
        };
    }

    return resultConfig;
}

/**
 * Конвертация ошибки из контроллера
 * */
export async function processError(
    errorController: ErrorController,
    config: IProcessConfigWithTemplate,
    theme?: string
): Promise<ErrorViewConfig | undefined> {
    const errorConfig = await errorController.process({
        error: config.error,
        theme,
        mode: config.mode || ErrorViewMode.include,
    });

    if (config.templateOptions && errorConfig) {
        errorConfig.options = {
            ...errorConfig.options,
            ...config.templateOptions,
        };
    }
    return errorConfig as ErrorViewConfig | undefined;
}

/**
 * Загрузка контроллера ошибки
 * */
async function getErrorController(): Promise<ErrorController> {
    if (isLoaded(ERROR_MODULE_NAME)) {
        return new (loadSync<TErrorImport>(ERROR_MODULE_NAME).ErrorController)({});
    } else {
        return loadAsync<TErrorImport>(ERROR_MODULE_NAME).then(
            (errorModule) => new errorModule.ErrorController({})
        );
    }
}

/**
 * Получение развернутой ошибки
 * */
export async function getConfigAfterLoadError<
    T extends IListState | TLoadDataResult = IListState | TLoadDataResult,
    E extends IListState | TLoadDataResult = T extends IListState ? IListState : TLoadDataResult,
>(config: E, loadError: Error, queryConfig: TErrorQueryConfig): Promise<E> {
    const isCancelablePromiseError = loadError instanceof PromiseCanceledError;
    const resultConfig = { ...config };

    if (loadError && !isCancelablePromiseError) {
        if (!resultConfig.errorController) {
            resultConfig.errorController = await getErrorController();
        }
        resultConfig.error = loadError;

        const processErrorConfig = getErrorConfig(
            {
                ...queryConfig,
                root: resultConfig.root,
            },
            loadError
        );
        resultConfig.errorViewConfig = await processError(
            resultConfig.errorController,
            processErrorConfig
        );
        resultConfig.loading = false;
    }

    return resultConfig;
}
