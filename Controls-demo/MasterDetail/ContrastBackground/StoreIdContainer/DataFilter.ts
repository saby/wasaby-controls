import { Model } from 'Types/entity';
interface IFilter {
    name?: string;
}

function filter(item: Model, queryFilter: IFilter): boolean {
    const resetValue = 'Выручка';
    return (
        queryFilter.name === item.get('name') ||
        queryFilter.name === item.get('parent') ||
        queryFilter.name === resetValue ||
        !queryFilter.name
    );
}

filter._moduleName = 'Controls-demo/MasterDetail/ContrastBackground/StoreIdContainer/DataFilter';

export = filter;
