import { adapter } from 'Types/entity';

interface IFilter {
    salary?: number[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemSalary = item.get('salary');
    const minValue = queryFilter.salary[0];
    const maxValue = queryFilter.salary[1];
    return (
        (!minValue || minValue <= itemSalary) &&
        (!maxValue || maxValue >= itemSalary)
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanelExtEditors/NumberRangeEditor/DataFilter';

export = filter;
