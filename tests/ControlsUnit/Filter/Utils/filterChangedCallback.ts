import { IFilterItem } from 'Controls/filter';

interface IChangedFilters {
    testValue?: number;
    value?: number;
}

export default (
    filterDescriptionItem: IFilterItem,
    filter: object,
    changedFilters: IChangedFilters
): IFilterItem => {
    if (changedFilters.testValue === 2) {
        return {
            name: 'testName',
            value: 2,
        };
    }
    return {
        name: 'testName',
        value: 3,
    };
};
