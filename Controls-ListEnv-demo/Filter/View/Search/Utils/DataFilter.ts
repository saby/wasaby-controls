import { adapter } from 'Types/entity';
import * as memorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';

interface IFilter {
    city?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return memorySourceFilter({
        city: null,
    })(item, queryFilter);
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Search/Utils/DataFilter';

export = filter;
