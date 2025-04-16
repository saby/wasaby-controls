import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    cityDropdown?: string;
    department?: string;
    gender?: string;
    genderDropdown?: string;
    radioGender?: string;
    isDevelopment?: boolean;
    dateEditor?: Date;
    dateRangeEditor?: Date[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city = queryFilter.city?.includes(item.get('city')) || !queryFilter.city?.length;
    const cityDropdown =
        queryFilter.cityDropdown?.includes(item.get('city')) || !queryFilter.cityDropdown?.length;
    const department =
        queryFilter.department === item.get('department') || !queryFilter.department?.length;
    const gender = queryFilter.gender === item.get('gender') || !queryFilter.gender?.length;
    const radioGender =
        queryFilter.radioGender === item.get('gender') || !queryFilter.radioGender?.length;
    const isDevelopment =
        queryFilter.isDevelopment === item.get('isDevelopment') || !queryFilter.isDevelopment;
    const itemDate = item.get('date');
    const date = queryFilter.dateEditor?.getFullYear() === itemDate || !queryFilter.dateEditor;
    const minDate = queryFilter.dateRangeEditor[0]?.getFullYear();
    const maxDate = queryFilter.dateRangeEditor[1]?.getFullYear();
    const dateRange = (itemDate >= minDate || !minDate) && (itemDate <= maxDate || !maxDate);
    return (
        city &&
        department &&
        isDevelopment &&
        gender &&
        date &&
        dateRange &&
        radioGender &&
        cityDropdown
    );
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/ViewMode/Basic/DataFilter';

export = filter;
