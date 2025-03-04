import type { IEmptyViewConfig } from 'Controls/gridRender';
import { isArray, isObject, isUndefined } from './predicates';
import { isValidElement } from 'react';
import getError from '../utils/getError';

/**
 * Проверяет правильность конфигурации пустого представления
 */
export function isValidEmptyView(config: unknown): config is IEmptyViewConfig[] {
    if (!isArray(config)) {
        return false;
    }

    const validElements = config.every((element) => {
        return (
            isObject(element) &&
            (isUndefined((element as IEmptyViewConfig).render) ||
                isValidElement((element as IEmptyViewConfig).render))
        );
    });

    if (!validElements) {
        // Ошибка упадет асинхронно.
        getError('WRONG_EMPTY_VIEW_CONFIG');
        return false;
    }

    return true;
}
