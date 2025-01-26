import { adapter } from 'Types/entity';
import * as memorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';

function filter(item: adapter.IRecord, queryFilter): boolean {
    return memorySourceFilter('title')(item, queryFilter);
}

filter._moduleName = 'Controls-ListEnv-demo/Search/Util/DataFilter';

export = filter;
