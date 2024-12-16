import type { ErrorViewConfig } from 'ErrorHandling/interface';
import type { TKey } from 'Controls-DataEnv/interface';
import type { ErrorController } from 'Controls/error';

export interface IErrorConfig {
    error: Error;
    direction?: 'up' | 'down';
    loadKey?: TKey;
}

/**
 * Интерфейс состояния для работы с ошибками.
 */
export interface IErrorState {
    /**
     *  Инстанс ошибки, произошедшей во время загрузки данных списка.
     */
    error?: Error;
    errorController?: ErrorController;
    errorViewConfig?: ErrorViewConfig;
    errorConfig?: IErrorConfig;
}
