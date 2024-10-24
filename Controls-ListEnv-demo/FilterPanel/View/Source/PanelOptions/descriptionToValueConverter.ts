import { IFilterItem } from 'Controls/filter';

export default function descriptionToValueConverter({ value }: IFilterItem): object | boolean {
    if (value === null) {
        return false;
    } else {
        return {
            cityId: value,
        };
    }
}
