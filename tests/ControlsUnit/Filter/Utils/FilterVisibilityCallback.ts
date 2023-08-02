import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    testValue?: number;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): boolean => {
    if (changedFilters.testValue === 1) {
        return false;
    }
};
