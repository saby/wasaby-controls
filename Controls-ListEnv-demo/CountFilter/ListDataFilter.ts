import { adapter } from 'Types/entity';
interface IFilter {
    task?: string;
    responsible?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let isTask = true;
    let isStage = true;
    if (queryFilter.task) {
        isTask = queryFilter.task === item.get('id');
    }
    if (queryFilter.stage) {
        isStage = queryFilter.stage === item.get('stage');
    }
    return isTask && isStage;
}

filter._moduleName = 'Controls-ListEnv-demo/CountFilter/ListDataFilter';

export = filter;
