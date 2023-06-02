import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    department?: string;
    gender?: string;
    radioGender?: string;
    isDevelopment?: boolean;
    dateEditor?: Date;
    owner?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city =
        queryFilter.city?.includes(item.get('city')) ||
        !queryFilter.city?.length;
    const owner =
        queryFilter.owner?.includes(item.get('owner')) ||
        !queryFilter.owner?.length;
    const department =
        queryFilter.department === item.get('department') ||
        !queryFilter.department?.length;
    const gender =
        queryFilter.gender === item.get('gender') ||
        !queryFilter.gender?.length;
    const isDevelopment =
        queryFilter.isDevelopment === item.get('isDevelopment') ||
        !queryFilter.isDevelopment;
    const itemDate = item.get('date');
    const date =
        queryFilter.dateEditor?.getFullYear() === itemDate ||
        !queryFilter.dateEditor;
    return (
        city &&
        department &&
        isDevelopment &&
        owner &&
        gender &&
        date
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/Filter/View/ViewMode/Extended/DataFilter';

export = filter;
