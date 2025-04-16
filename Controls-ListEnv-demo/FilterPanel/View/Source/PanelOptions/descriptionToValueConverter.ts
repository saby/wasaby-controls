import { IFilterItem, DESCRIPTION_CONVERTER_DELETE_VALUE } from 'Controls/filter';

export default function descriptionToValueConverter({ value }: IFilterItem): object | symbol {
    if (value === null) {
        return DESCRIPTION_CONVERTER_DELETE_VALUE;
    } else {
        return {
            cityId: value,
        };
    }
}
