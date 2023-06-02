import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    salary?: number[];
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): boolean => {
    return !(changedFilters.salary[0] || changedFilters.salary[1]);
};
