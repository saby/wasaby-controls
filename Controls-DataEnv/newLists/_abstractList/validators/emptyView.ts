import type { IEmptyViewConfig } from 'Controls/gridRender';
import type { TemplateFunction } from 'UI/Base';
import { isArray, isObject, isUndefined, isFunction } from './predicates';
import { isValidElement } from 'react';
import getError from '../utils/getError';
import type { TCollectionType } from 'Controls-DataEnv/abstractList';

/**
 * Проверяет правильность конфигурации пустого представления
 */
export function isValidEmptyView(
    config: unknown,
    collectionType?: TCollectionType
): config is IEmptyViewConfig[] | TemplateFunction {
    if (collectionType && !(collectionType === 'Grid' || collectionType === 'TreeGrid')) {
        return isFunction(config);
    }

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
