import { adapter } from 'Types/entity';

interface IFilter {
    capital: number;
    country: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let capitalFilter = true;
    if (queryFilter.capital) {
        capitalFilter = queryFilter.capital === item.get('id');
    }
    let countryFilter = true;
    if (queryFilter.country?.length) {
        countryFilter = queryFilter.country.includes(item.get('country'));
    }
    return capitalFilter && countryFilter;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/DataFilter';

export = filter;
