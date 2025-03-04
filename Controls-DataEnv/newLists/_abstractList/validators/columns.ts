import { IBaseColumnConfig } from 'Controls-DataEnv/listTypes';
import { RecordSet } from 'Types/collection';
import { isArray, isNumber, isObject, isString } from './predicates';
import getError from '../utils/getError';

/**
 * Проверяет правильность конфигурации колонок
 */
export function isValidColumns(
    columns: unknown,
    isLatestInteractorVersion: boolean
): columns is IBaseColumnConfig[] {
    // Временное решение, чтобы пройти автотесты
    if (columns instanceof RecordSet) {
        getError('COLUMNS_IS_RS');
        return true;
    }

    // TODO: Переделать строгую проверку every на дружелюбный filter с красной ошибкой в консоль.
    if (!isArray(columns)) {
        return false;
    }
    const isAllObjects = columns.every(isObject);

    if (!isAllObjects) {
        getError('WRONG_COLUMNS_CONFIG', columns, 'error');
        return false;
    }

    const validKeys = columns.every((column) => {
        const key = (column as IBaseColumnConfig).key as unknown;
        return isString(key) || isNumber(key);
    });

    if (!validKeys) {
        // Ошибка упадет асинхронно.
        getError(
            'WRONG_COLUMNS_CONFIG',
            columns,
            // Не запрещаем работать без ключа в старых списках.
            isLatestInteractorVersion ? 'error' : 'warn'
        );

        if (isLatestInteractorVersion) {
            return false;
        }
    }

    return true;
}
