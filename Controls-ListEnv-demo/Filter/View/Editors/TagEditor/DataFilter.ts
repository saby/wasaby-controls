import { adapter, Model } from 'Types/entity';

interface IFilter {
    tags?: Model;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return !queryFilter.tags || queryFilter.tags.get('id') === item.get('tag');
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/ChipsEditor/DataFilter';

export = filter;
