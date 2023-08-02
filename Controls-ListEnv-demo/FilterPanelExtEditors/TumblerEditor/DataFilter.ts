import { adapter } from 'Types/entity';

interface IFilter {
    gender: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter?.gender === item.get('id') || !queryFilter?.gender;
}

filter._moduleName = 'Controls-ListEnv-demo/FilterPanelExtEditors/TumblerEditor/DataFilter';

export = filter;