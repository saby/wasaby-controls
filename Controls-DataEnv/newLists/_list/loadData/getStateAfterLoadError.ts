import { PromiseCanceledError } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { getConfigAfterLoadError, TErrorQueryConfig } from './getConfigAfterLoadError';
import type { IListState } from '../interface/IListState';

/**
 * Получение модифицированного состояния с обработанным состояние ошибки
 * */
export async function getStateAfterLoadError<TState extends IListState = IListState>(
    sliceCurrentState: TState,
    sliceNextState: TState,
    loadError: Error,
    queryConfig: TErrorQueryConfig
): Promise<TState> {
    const isCancelablePromiseError = loadError instanceof PromiseCanceledError;

    if (loadError && !isCancelablePromiseError) {
        // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
        // у которого есть обработка ошибок через catch, никто о ней не узнает
        if (!loadError.hasOwnProperty('httpError')) {
            Logger.error('Controls-DataEnv/list:ListSlice load error', loadError);
        }
        return getConfigAfterLoadError(sliceNextState, loadError, queryConfig);
    } else {
        return {
            ...sliceNextState,
            loading: isCancelablePromiseError ? sliceCurrentState.loading : sliceNextState.loading,
        };
    }
}
