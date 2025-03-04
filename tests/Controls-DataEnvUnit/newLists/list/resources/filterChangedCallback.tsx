import { IFilterItem } from 'Controls/filter';

export default (filterItem: IFilterItem): IFilterItem => {
    filterItem.editorOptions.filter.fromCallback = true;
    return filterItem;
};
