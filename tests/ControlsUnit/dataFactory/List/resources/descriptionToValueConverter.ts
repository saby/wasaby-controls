import { IFilterItem } from 'Controls/filter';

export default ({ value }: IFilterItem): object => {
    return {
        filterField1: value[0],
        filterField2: value[1],
    };
};
