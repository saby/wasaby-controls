import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип действия для обработки ошибки загрузки
 */
export type THandleLoadErrorAction = TAbstractAction<
    'handleLoadError',
    {
        error: Error;
        direction?: 'up' | 'down';
        loadKey?: TKey;
        action?: () => void;
    }
>;

/**
 * Тип действий функционала "Обработка ошибок загрузки" в списке
 */
export type TAnyHandleLoadErrorAction = THandleLoadErrorAction;
