/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListState } from '../_interface/IListState';
import { loadAsync, loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import type { ErrorController, ErrorViewConfig, IProcessConfig } from 'Controls/error';
import { ErrorViewMode } from 'Controls/error';
import { PromiseCanceledError } from 'Types/entity';
import { Logger } from 'UI/Utils';
import type { ProcessedError } from 'ErrorHandling/interface';

const ERROR_MODULE_NAME = 'Controls/error';
type TErrorImport = typeof import('Controls/error');

import { TKey, Direction } from 'Controls/interface';

export type TErrorQueryConfig = {
    root?: TKey;
    loadKey?: TKey;
    direction?: Direction;
    action?: () => void;
};

export function getErrorConfig(
    queryConfig: TErrorQueryConfig,
    error?: Error
): IProcessConfig<ProcessedError> {
    const { direction, root, loadKey } = queryConfig;
    let errorViewMode;

    if (direction && (loadKey === undefined || root === loadKey)) {
        errorViewMode = ErrorViewMode.inlist;
    } else if (loadKey !== undefined && root !== loadKey) {
        errorViewMode = ErrorViewMode.dialog;
    } else {
        errorViewMode = ErrorViewMode.include;
    }

    const resultConfig = {
        mode: errorViewMode,
    };

    if (direction) {
        resultConfig.templateOptions = {
            showInDirection: direction,
            action: queryConfig.action,
        };
    }

    if (error) {
        resultConfig.error = error;
    }

    return resultConfig;
}

export async function processError(
    errorController: ErrorController,
    config: ErrorViewConfig,
    theme?: string
) {
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
    return errorConfig;
}

async function getErrorController(): Promise<ErrorController> {
    if (isLoaded(ERROR_MODULE_NAME)) {
        return new (loadSync<TErrorImport>(ERROR_MODULE_NAME).ErrorController)({});
    } else {
        return loadAsync<TErrorImport>(ERROR_MODULE_NAME).then(
            (errorModule) => new errorModule.ErrorController({})
        );
    }
}

export async function getConfigAfterLoadError(
    config: IListState,
    loadError: Error,
    queryConfig: TErrorQueryConfig
): Promise<IListState> {
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

export default async function getStateAfterLoadError(
    sliceCurrentState: IListState,
    sliceNextState: IListState,
    loadError: Error,
    queryConfig: TErrorQueryConfig
): Promise<IListState> {
    const isCancelablePromiseError = loadError instanceof PromiseCanceledError;

    if (loadError && !isCancelablePromiseError) {
        // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
        // у которого есть обработка ошибок через catch, никто о ней не узнает
        if (!loadError.hasOwnProperty('httpError')) {
            Logger.error('Controls/dataFactory:ListSlice load error', loadError);
        }
        const resultState = await getConfigAfterLoadError(sliceNextState, loadError, queryConfig);
        return resultState;
    } else {
        return {
            ...sliceNextState,
            loading: isCancelablePromiseError ? sliceCurrentState.loading : sliceNextState.loading,
        };
    }
}
