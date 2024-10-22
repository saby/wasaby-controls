import { IFilterItem } from 'Controls/filter';

export default function ({ name }: IFilterItem, filter: object, changedFilters: object): boolean {
    return !(filter.hiddenItem[0] === 'test' && name === 'hiddenItem' && filter.serviceField);
}
