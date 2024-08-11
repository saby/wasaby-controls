import { adapter } from 'Types/entity';

interface IFilter {
    radioGender: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter?.radioGender === item.get('id') || !queryFilter?.radioGender;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/DataFilter';

export = filter;
