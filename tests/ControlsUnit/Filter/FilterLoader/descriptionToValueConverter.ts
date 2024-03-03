import { IFilterItem } from 'Controls/filter';

export default ({ value }: IFilterItem): object => {
    return String(value);
};
