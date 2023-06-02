import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    department?: string;
    gender?: string;
    owner?: string[];
    isDevelopment?: boolean;
    dateEditor?: Date;
    dateEditorFrom?: Date[];
    dateRangeEditor?: Date[];
    salary?: number[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city =
        queryFilter.city?.includes(item.get('city')) ||
        !queryFilter.city?.length;
    const department =
        queryFilter.department === item.get('department') ||
        !queryFilter.department?.length;
    const gender =
        queryFilter.gender === item.get('gender') ||
        !queryFilter.gender?.length;
    const owner =
        queryFilter.owner?.includes(item.get('owner')) ||
        !queryFilter.owner?.length;
    const isDevelopment =
        queryFilter.isDevelopment === item.get('isDevelopment') ||
        !queryFilter.isDevelopment;
    return (
        city &&
        department &&
        isDevelopment &&
        gender &&
        owner &&
        getDateRangeFilterResult(item, queryFilter) &&
        getSalaryRangeFilterResult(item, queryFilter) &&
        getDateFilterResult(item, queryFilter)
    );
}
function getDateRangeFilterResult(item, queryFilter: IFilter): boolean {
    const itemDate = item.get('date');
    const date =
        queryFilter.dateEditor?.getFullYear() === itemDate ||
        !queryFilter.dateEditor;
    const minDate = queryFilter.dateRangeEditor[0]?.getFullYear();
    const maxDate = queryFilter.dateRangeEditor[1]?.getFullYear();
    return (
        (itemDate >= minDate || !minDate) &&
        (itemDate <= maxDate || !maxDate)
    );
}

function getDateFilterResult(item, queryFilter: IFilter): boolean {
    const itemDate = item.get('date');
    const date =
        queryFilter.dateEditor?.getFullYear() === itemDate ||
        !queryFilter.dateEditor;
    let dateMenuDate = true;
    if (queryFilter.dateEditorFrom) {
        const minMenuDate = queryFilter.dateEditorFrom[0]?.getFullYear();
        const maxMenuDate = queryFilter.dateEditorFrom[1]?.getFullYear();
        dateMenuDate =
            (itemDate >= minMenuDate || !minMenuDate) &&
            (itemDate <= maxMenuDate || !maxMenuDate);
    }
    return date && dateMenuDate;
}

function getSalaryRangeFilterResult(item, queryFilter: IFilter): boolean {
    const itemSalary = item.get('salary');
    const minSalary = queryFilter.salary[0];
    const maxSalary = queryFilter.salary[1];
    return (
        (itemSalary >= minSalary || !minSalary) &&
        (itemSalary <= maxSalary || !maxSalary)
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/DataFilter';

export = filter;
