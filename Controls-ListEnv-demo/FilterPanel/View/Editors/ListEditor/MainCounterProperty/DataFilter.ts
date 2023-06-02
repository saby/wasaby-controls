import { adapter } from 'Types/entity';

interface IFilter {
    owners: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return (
        queryFilter.owners === item.get('id') ||
        !queryFilter.owners
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MainCounterProperty/DataFilter';

export = filter;
