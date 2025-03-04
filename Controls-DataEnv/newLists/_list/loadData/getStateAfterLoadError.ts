import { PromiseCanceledError } from 'Types/entity';
import { getConfigAfterLoadError, TErrorQueryConfig } from './getConfigAfterLoadError';
import type { IListState } from '../interface/IListState';
import { getError } from 'Controls-DataEnv/abstractList';

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
            await getError('LOAD_DATA_ERROR', loadError);
        }
        return getConfigAfterLoadError(sliceNextState, loadError, queryConfig);
    } else {
        return {
            ...sliceNextState,
            loading: isCancelablePromiseError ? sliceCurrentState.loading : sliceNextState.loading,
        };
    }
}
