import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    amount?: number[];
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): boolean => {
    return !changedFilters.amount?.length;
};
