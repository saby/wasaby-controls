import { adapter } from 'Types/entity';

interface IFilter {
    departmentInput?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return (
        item.get('department').toLowerCase().includes(queryFilter.departmentInput.toLowerCase()) ||
        !queryFilter.departmentInput
    );
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/InputEditor/DataFilter';

export = filter;
