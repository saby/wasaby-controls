import { adapter } from 'Types/entity';

interface IFilter {
    radioGender: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return !queryFilter?.radioGender || queryFilter?.radioGender.includes(item.get('id'));
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/CheckboxGroupEditor/DataFilter';

export = filter;
