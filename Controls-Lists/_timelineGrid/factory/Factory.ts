import TimelineGridSlice from './Slice';
import type { IRouter } from 'Router/router';
import { List as ListFactory } from 'Controls/dataFactory';
import { format as EntityFormat } from 'Types/entity';

import type {
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
} from './ITimelineGridFactory';
import {
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';

function loadData(
    dataFactoryArguments: ITimelineGridDataFactoryArguments,
    dependenciesResults: Record<string, unknown>,
    Router: IRouter
) {
    const columnsNavigation = dataFactoryArguments.columnsNavigation;
    const { field } = columnsNavigation.sourceConfig;

    const dynamicColumnsFilter: ITimelineColumnsFilter =
        prepareDynamicColumnsFilter(columnsNavigation);
    const filter = {
        ...dataFactoryArguments.filter,
        [field]: prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            dataFactoryArguments.source.getAdapter(),
            EntityFormat.DateTimeField
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
    slice: TimelineGridSlice,
};
