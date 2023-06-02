import { adapter } from 'Types/entity';

interface IFilter {
    dateEditorTerm: Date[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    if (queryFilter.dateEditorTerm instanceof Array) {
        return item.get('date') < queryFilter.dateEditorTerm[1];
    } else if (queryFilter.dateEditorTerm) {
        return item.get('date') < queryFilter.dateEditorTerm;
    }
    return queryFilter.dateEditorTerm !== false;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/DateMenuEditor/DataFilter';

export = filter;
