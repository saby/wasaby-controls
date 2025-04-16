import { adapter } from 'Types/entity';
interface IFilter {
    startDate: Date;
    endDate: Date;
}

function checkDate(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemDate = item.get('date');
    const minDate = queryFilter.startDate?.getFullYear();
    const maxDate = queryFilter.endDate?.getFullYear();

    return (itemDate >= minDate || !minDate) && (itemDate <= maxDate || !maxDate);
}
checkDate._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/DataFilter';

export = checkDate;
