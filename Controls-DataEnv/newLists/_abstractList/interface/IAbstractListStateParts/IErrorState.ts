import type { ErrorViewConfig } from 'ErrorHandling/interface';
import type { TKey } from 'Controls-DataEnv/interface';
import type { ErrorController } from 'Controls/error';

/**
 * Тип конфигурации ошибки
 */
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
     * Инстанс ошибки, произошедшей во время загрузки данных списка
     */
    error?: Error;

    /**
     * Класс для обработки ошибки.
     * Данное состояние следует определять, если нужно изменить способ отображения ошибки (диалог, вместо контента или во всю страницу) или добавить свои обработчики ошибок.
     */
    errorController?: ErrorController;

    /**
     * Конфигурация для визуального отображения ошибки
     */
    errorViewConfig?: ErrorViewConfig;

    /**
     * Конфигурация ошибки
     */
    errorConfig?: IErrorConfig;
}
