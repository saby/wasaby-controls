import { validViewMode, type TViewMode } from 'Controls-DataEnv/interface';
import { isString } from '../validators/predicates';
import getError from 'Controls-DataEnv/newLists/_abstractList/utils/getError';

/**
 * Проверяет правильность конфигурации viewMode
 */
export function isValidViewMode(value: unknown, searchValue?: string): value is TViewMode {
    if (!isString(value) || !validViewMode.includes(value as TViewMode)) {
        return false;
    }
    if (searchValue && !(value === 'search' || value === 'searchTile')) {
        getError('WRONG_SEARCH_VIEW_MODE_INIT');
        return false;
    }
    return true;
}
