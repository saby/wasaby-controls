import { IFilterItem } from 'Controls/filter';

export default function ({ value }: IFilterItem) {
    if (value) {
        return {
            startDate: value[0],
            endDate: value[1],
        };
    }
    return { startDate: null, endDate: null };
}
