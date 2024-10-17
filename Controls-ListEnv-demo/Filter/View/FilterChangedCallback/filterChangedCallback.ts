import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    gender?: string;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): IFilterItem => {
    const filterItem = { ...filterDescriptionItem };
    if (changedFilters.hasOwnProperty('gender')) {
        if (changedFilters.gender === '1') {
            filterItem.value = ['Kazan'];
        }
    }
    return filterItem;
};
