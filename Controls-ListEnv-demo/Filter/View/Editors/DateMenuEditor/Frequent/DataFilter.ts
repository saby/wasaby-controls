import { adapter } from 'Types/entity';
import { Base } from 'Controls/dateUtils';

interface IFilter {
    dateRange?: Date[];
    date?: Date[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let date = true;
    let dateRange = true;
    if (queryFilter.date instanceof Array) {
        date = Base.isDatesEqual(item.get('date'), queryFilter.date[0]);
    }
    if (queryFilter.dateRange instanceof Array) {
        dateRange =
            item.get('date') > queryFilter.dateRange[0] &&
            item.get('date') < queryFilter.dateRange[1];
    }
    return date && dateRange;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/DataFilter';

export = filter;
