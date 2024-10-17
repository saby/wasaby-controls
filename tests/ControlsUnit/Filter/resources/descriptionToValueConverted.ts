import { IFilterItem, DESCRIPTION_CONVERTER_DELETE_VALUE } from 'Controls/filter';

export default ({ value }: IFilterItem): object => {
    if (!value) {
        return {
            test1FromProvider: 'emptyValue1',
            test2FromProvider: 'emptyValue2',
        };
    }
    if (value === 'deleteTest') {
        return DESCRIPTION_CONVERTER_DELETE_VALUE;
    }
    return {
        test1FromProvider: value[0],
        test2FromProvider: value[1],
    };
};
