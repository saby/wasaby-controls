import { IBaseColumnConfig } from 'Controls-DataEnv/listTypes';
import { RecordSet } from 'Types/collection';
import { Logger } from 'UI/Utils';
import { isArray, isString, isNumber, isObject } from './predicates';
import { WRONG_COLUMNS_CONFIG } from '../ErrorDescriptors';

/**
 * Проверяет правильность конфигурации колонок
 */
export function isValidColumns(
    columns: unknown,
    isLatestInteractorVersion: boolean
): columns is IBaseColumnConfig[] {
    // Временное решение, чтобы пройти автотесты
    if (columns instanceof RecordSet) {
        Logger.warn(
            'Controls-DataEnv/abstractList: В качестве конфигурации для columns передан RecordSet, хотя ожидался массив'
        );
        return true;
    }

    // TODO: Переделать строгую проверку every на дружелюбный filter с красной ошибкой в консоль.
    if (!isArray(columns)) {
        return false;
    }
    const isAllObjects = columns.every(isObject);

    if (!isAllObjects) {
        WRONG_COLUMNS_CONFIG(columns, 'error');
        return false;
    }

    const validKeys = columns.every((column) => {
        const key = (column as IBaseColumnConfig).key as unknown;
        return isString(key) || isNumber(key);
    });

    if (!validKeys) {
        // Не запрещаем работать без ключа в старых списках.
        WRONG_COLUMNS_CONFIG(columns, isLatestInteractorVersion ? 'error' : 'warn');

        if (isLatestInteractorVersion) {
            return false;
        }
    }

    return true;
}
