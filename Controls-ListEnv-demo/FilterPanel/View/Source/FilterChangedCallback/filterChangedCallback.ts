import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    department?: string;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): IFilterItem => {
    const filterItem = { ...filterDescriptionItem };
    if (changedFilters.hasOwnProperty('department')) {
        if (changedFilters.department === 'Разработка') {
            filterItem.editorOptions.additionalTextProperty = 'devCounter';
        } else {
            filterItem.editorOptions.additionalTextProperty = 'counter';
        }
    }
    return filterItem;
};
