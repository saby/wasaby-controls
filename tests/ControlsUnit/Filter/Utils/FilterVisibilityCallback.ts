import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    testValue?: number;
}

interface IFilter {
    hideEditor?: boolean;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: IFilter,
    changedFilters: IChangedFilters
): boolean => {
    if (changedFilters.testValue === 1 || filter.hideEditor) {
        return false;
    }
};
