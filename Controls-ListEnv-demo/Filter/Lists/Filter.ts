function filter(item, filter: { department: string[] | string; city: string[] | string }): boolean {
    if (filter.department) {
        return Array.isArray(filter.department)
            ? filter.department.includes(item.get('department'))
            : filter.department.toLowerCase() === item.get('department').toLowerCase();
    }
    if (filter.city?.length) {
        return Array.isArray(filter.city)
            ? filter.city.includes(item.get('city'))
            : filter.city.toLowerCase() === item.get('city').toLowerCase();
    }
    return true;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/Lists/Filter';

export = filter;
