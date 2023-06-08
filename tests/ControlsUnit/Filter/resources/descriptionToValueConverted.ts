import { IFilterItem } from 'Controls/filter';

export default ({ value }: IFilterItem): object => {
    return {
        test1FromProvider: value[0],
        test2FromProvider: value[1],
    };
};
