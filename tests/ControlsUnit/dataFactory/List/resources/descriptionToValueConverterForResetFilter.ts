import { IFilterItem } from 'Controls/filter';

export default ({ value }: IFilterItem): object => {
    return {
        filterField3: value[0],
        filterField4: value[1],
    };
};
