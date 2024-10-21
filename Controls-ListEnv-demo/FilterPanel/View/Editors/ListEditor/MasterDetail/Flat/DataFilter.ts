import { adapter } from 'Types/entity';
interface IFilter {
    document?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const resetValue = {
        document: 'Все документы',
    };
    return (
        queryFilter.document === item.get('document') ||
        queryFilter.document === resetValue.document
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/Flat/DataFilter';

export = filter;
