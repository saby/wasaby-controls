import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    cityDropdown?: string;
    departmentLookup?: string;
    department?: string;
    gender?: string;
    genderDropdown?: string;
    radioGender?: string;
    isDevelopment?: boolean;
    dateEditor?: Date;
    dateEditorFrom?: Date[];
    dateRangeEditor?: Date[];
    salary?: number[];
    owner?: string[];
    departmentInput?: string;
}

function checkDepartment(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const department =
        queryFilter.department === item.get('department') || !queryFilter.department?.length;
    const departmentLookup =
        queryFilter.departmentLookup === item.get('department') ||
        !queryFilter.departmentLookup?.length;
    return department && departmentLookup;
}

function checkGender(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const gender = queryFilter.gender === item.get('gender') || !queryFilter.gender?.length;
    const genderDropdown =
        queryFilter.genderDropdown === item.get('gender') || !queryFilter.genderDropdown?.length;
    const radioGender =
        queryFilter.radioGender === item.get('gender') || !queryFilter.radioGender?.length;
    return (gender || genderDropdown) && radioGender;
}

function checkDate(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemDate = item.get('date');
    const date = queryFilter.dateEditor?.getFullYear() === itemDate || !queryFilter.dateEditor;
    const minDate = queryFilter.dateRangeEditor[0]?.getFullYear();
    const maxDate = queryFilter.dateRangeEditor[1]?.getFullYear();
    const dateRange = (itemDate >= minDate || !minDate) && (itemDate <= maxDate || !maxDate);
    let dateMenuDate = true;
    if (queryFilter.dateEditorFrom && queryFilter.dateEditorFrom instanceof Array) {
        const minMenuDate = queryFilter.dateEditorFrom[0]?.getFullYear();
        const maxMenuDate = queryFilter.dateEditorFrom[1]?.getFullYear();
        dateMenuDate =
            (itemDate >= minMenuDate || !minMenuDate) && (itemDate <= maxMenuDate || !maxMenuDate);
    }
    return date && dateRange && dateMenuDate;
}

function checkSalary(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemSalary = item.get('salary');
    const minSalary = queryFilter.salary[0];
    const maxSalary = queryFilter.salary[1];
    return (itemSalary >= minSalary || !minSalary) && (itemSalary <= maxSalary || !maxSalary);
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city = queryFilter.city?.includes(item.get('city')) || !queryFilter.city?.length;
    const cityDropdown =
        queryFilter.cityDropdown?.includes(item.get('city')) || !queryFilter.cityDropdown?.length;
    const owner = queryFilter.owner?.includes(item.get('owner')) || !queryFilter.owner?.length;
    const isDevelopment =
        queryFilter.isDevelopment === item.get('isDevelopment') || !queryFilter.isDevelopment;

    const inputDepartment =
        item.get('department').toLowerCase().includes(queryFilter.departmentInput.toLowerCase()) ||
        !queryFilter.departmentInput;
    const isFiltered =
        checkSalary(item, queryFilter) &&
        checkDate(item, queryFilter) &&
        checkGender(item, queryFilter) &&
        checkDepartment(item, queryFilter);
    return isFiltered && city && isDevelopment && owner && cityDropdown && inputDepartment;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/DataFilter';

export = filter;
