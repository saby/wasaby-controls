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
            filterItem.editorOptions.filter = {};
        } else if (changedFilters.department === 'Продвижение') {
            filterItem.editorOptions.additionalTextProperty = 'counter';
            filterItem.editorOptions.filter = {};
        } else if (changedFilters.department) {
            filterItem.editorOptions.filter = { emptyFilter: true };
        } else {
            filterItem.editorOptions.filter = {};
            filterItem.editorOptions.additionalTextProperty = 'counter';
        }
    }
    return filterItem;
};
