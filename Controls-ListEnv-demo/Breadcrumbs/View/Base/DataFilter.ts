import { adapter } from 'Types/entity';

interface IFilter {
    data?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    if (queryFilter['Только узлы']) {
        return item.get('node');
    }

    return true;
}

filter._moduleName = 'Controls-ListEnv-demo/Breadcrumbs/View/Base/DataFilter';

export = filter;
