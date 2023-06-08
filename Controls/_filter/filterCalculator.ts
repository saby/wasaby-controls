/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IFilterItem } from 'Controls/filter';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';

function needAddValueToFilter({ viewMode, value, visibility }: IFilterItem): boolean {
    return (
        value !== undefined &&
        (visibility === undefined || visibility === true || viewMode === 'frequent')
    );
}

function addValueToFilter(item: IFilterItem, filter: object): void {
    let valueConverter;

    if (
        typeof item.descriptionToValueConverter === 'string' &&
        isLoaded(item.descriptionToValueConverter)
    ) {
        valueConverter = loadSync(item.descriptionToValueConverter);
    } else {
        valueConverter = item.descriptionToValueConverter;
    }

    if (valueConverter) {
        Object.assign(filter, valueConverter(item));
    } else {
        filter[item.name || item.id] = item.value;
    }
}

/**
 * Получить фильтр по структуре
 * @param {Object} filter
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
export default function getFilterByFilterDescription(
    filter: object,
    filterDescription: IFilterItem[] = []
): object {
    const resultFilter = { ...filter };

    filterDescription.forEach((item) => {
        const filterName = item.name || item.id;

        if (needAddValueToFilter(item)) {
            addValueToFilter(item, resultFilter);
        } else {
            delete resultFilter[filterName];
        }
    });

    return resultFilter;
}
