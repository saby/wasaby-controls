import { IFilterItem } from 'Controls/filter';
import { period as dateRangeFormatter, PeriodConfigurationType } from 'Types/formatter';
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
    const isPeriodItem = typeof value === 'string';
    const hasSelectedValueInAvailablePeriodItems =
        isPeriodItem && filterItem.editorOptions?.items?.getRecordById(value);

    if (filterItem?.type === 'dateRange' && isPeriodItem) {
        const minRange = filterItem.editorOptions?.minRange as string;
        resultFilterItem.value = prepareDateResetValues(value, minRange, type);
    }
    // Для случая, когда фильтр по периоду сквозной между несколькими дэшбордами (на структуре настроен один historyId)
    // И пользователь на одном дэшборде настроил, что период есть (например "За вчера"), а на втором дэшборе нет,
    // надо конвертировать "За вчера" в конкретную дату
    if (
        (value === 'month' ||
            value === 'quarter' ||
            value === 'halfyear' ||
            value === 'year' ||
            (value === 'yesterday' && !hasSelectedValueInAvailablePeriodItems)) &&
        newFilter?.date &&
        newFilter?.dateTo &&
        type !== 'last'
    ) {
        const isCurrentYear =
            (newFilter.date || newFilter.dateTo)?.getFullYear() === new Date().getFullYear();
        resultFilterItem.textValue = dateRangeFormatter(newFilter.date, newFilter.dateTo, {
            configuration: isCurrentYear
                ? PeriodConfigurationType.WithoutYear
                : PeriodConfigurationType.Default,
        });
    }

    return resultFilterItem;
}
