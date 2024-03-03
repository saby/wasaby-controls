import { adapter } from 'Types/entity';

interface IFilter {
    booleanEditor?: boolean;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemValue = item.get('booleanEditor');
    const filterValue = queryFilter.booleanEditor;
    return !filterValue || !itemValue;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/DataFilter';

export = filter;
