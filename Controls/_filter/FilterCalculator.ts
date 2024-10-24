/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { TFilter } from 'Controls/interface';
import { isEqual } from 'Types/object';
import { getDates } from 'Controls/_filter/DateUtils';

function needAddValueToFilter({
    viewMode,
    value,
    visibility,
    descriptionToValueConverter,
}: IFilterItem): boolean {
    return !!(
        value !== undefined &&
        (visibility === undefined ||
            visibility ||
            viewMode === 'frequent' ||
            descriptionToValueConverter)
    );
}

function addValueToFilter(
    item: IFilterItem,
    filter: object,
    filterDescription: IFilterItem[]
): void {
    let valueConverter;

    if (
        typeof item.descriptionToValueConverter === 'string' &&
        isLoaded(item.descriptionToValueConverter)
    ) {
        valueConverter = loadSync<() => object | void | false>(item.descriptionToValueConverter);
    } else {
        valueConverter = item.descriptionToValueConverter as Function;
    }

    if (valueConverter) {
        const value = valueConverter(item, filterDescription);

        if (value === false) {
            delete filter[item.name];
        } else {
            Object.assign(filter, value);
        }
    } else if (
        item.editorTemplateName === 'Controls/filterPanelEditors:DateMenu' &&
        !item.editorOptions?.dateMenuItems &&
        !item.editorOptions?.items
    ) {
        filter[item.name] = getDatesByFilterItem(item);
    } else {
        filter[item.name] = item.value;
    }
}

function getDatesByFilterItem(filterItem: IFilterItem): [Date, Date] {
    return getDates(filterItem);
}

/**
 * Получить фильтр по структуре
 * @param {Controls/interface:TFilter} filter
 * @param {Array<Controls/filter:IFilterItem>} filterDescription
 * @returns Object
 * @example
 * <pre>
 *     import {getFilterByFilterDescription} from 'Controls/filter';
 *
 *     const filterDescription = [{
 *        name: '',
 *        value: ['Gerasimov A.M.'],
 *        resetValue: []
 *     }];
 *
 *     const filter = getFilterByFilterDescription({}, filterDescription);
 *     ...
 * </pre>
 */
function getFilterByFilterDescription(
    filter: object = {},
    filterDescription: IFilterItem[] = []
): TFilter {
    const resultFilter = { ...filter };

    filterDescription.forEach((item) => {
        const filterName = item.name || item.id;

        if (needAddValueToFilter(item)) {
            addValueToFilter(item, resultFilter, filterDescription);
        } else {
            delete resultFilter[filterName];
        }
    });

    return resultFilter;
}

function getChangedFilters(currentFilter: TFilter, updatedFilter: TFilter): TFilter {
    const changedFilters = {};
    // changed
    for (const filterName in currentFilter) {
        if (currentFilter.hasOwnProperty(filterName)) {
            if (!isEqual(currentFilter[filterName], updatedFilter[filterName])) {
                changedFilters[filterName] = updatedFilter[filterName];
            }
        }
    }
    // added
    for (const filterName in updatedFilter) {
        if (updatedFilter.hasOwnProperty(filterName) && !currentFilter.hasOwnProperty(filterName)) {
            changedFilters[filterName] = updatedFilter[filterName];
        }
    }
    return changedFilters;
}

export default {
    getFilterByFilterDescription,
    getChangedFilters,
    getDatesByFilterItem,
};
