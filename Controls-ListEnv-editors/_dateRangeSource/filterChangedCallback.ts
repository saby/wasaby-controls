import { IFilterItem } from 'Controls/filter';
import { Utils } from 'Controls/dateRange';
import { prepareDateResetValues } from './FilterSource';

/**
 * Метод, вызываемый при изменении значения фильтра
 * @param {IFilterItem} filterItem Настройка элемента фильтра
 * @param {Object} newFilter Новое значение фильтра
 * @returns {IFilterItem | void}
 */
export function filterChangedCallback(
    filterItem: IFilterItem,
    newFilter: object
): IFilterItem | void {
    const value = filterItem?.value;
    const resultFilterItem = {
        ...filterItem,
    };
    const type = filterItem.editorOptions?.type;

    if (filterItem?.type === 'dateRange' && typeof value === 'string') {
        const minRange = filterItem.editorOptions?.minRange as string;
        resultFilterItem.value = prepareDateResetValues(value, minRange, type);
    }
    if (
        (value === 'month' || value === 'quarter' || value === 'halfyear' || value === 'year') &&
        newFilter?.date &&
        newFilter?.dateTo &&
        type !== 'last'
    ) {
        resultFilterItem.textValue = Utils.formatDateRangeCaption(newFilter.date, newFilter.dateTo);
    }

    return resultFilterItem;
}
