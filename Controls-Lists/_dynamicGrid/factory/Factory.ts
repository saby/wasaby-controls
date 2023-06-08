import DynamicGridSlice from './Slice';
import type { IRouter } from 'Router/router';
import { List as ListFactory } from 'Controls/dataFactory';
import { format as EntityFormat } from 'Types/entity';
import type { IDynamicGridDataFactoryArguments } from './IDynamicGridFactory';
import { prepareDynamicColumnsFilter, prepareDynamicColumnsFilterRecord } from './utils';

function loadData(
    dataFactoryArguments: IDynamicGridDataFactoryArguments,
    dependenciesResults: Record<string, unknown>,
    Router: IRouter
) {
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;
    const dynamicColumnsFilter = prepareDynamicColumnsFilter({
        columnsNavigation: dataFactoryArguments.columnsNavigation,
    });
    const filter = {
        ...dataFactoryArguments.filter,
        [field]: prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            dataFactoryArguments.source.getAdapter(),
            EntityFormat.IntegerField
        ),
    };
    const loadDynamicColumnsDataArguments = {
        ...dataFactoryArguments,
        source: dataFactoryArguments.source,
        filter,
    };

    return ListFactory.loadData(loadDynamicColumnsDataArguments, dependenciesResults, Router, true);
}

export default {
    loadData,
    slice: DynamicGridSlice,
};
