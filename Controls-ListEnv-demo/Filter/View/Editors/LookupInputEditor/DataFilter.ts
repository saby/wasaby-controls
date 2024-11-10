import { adapter } from 'Types/entity';

interface IFilter {
    owner: string;
    title: string;
    id: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.owner?.includes(item.get('id')) || !queryFilter.owner?.length;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/DataFilter';

export = filter;
