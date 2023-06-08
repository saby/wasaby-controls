import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    booleanEditor?: boolean;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): boolean => {
    return !changedFilters.booleanEditor;
};
