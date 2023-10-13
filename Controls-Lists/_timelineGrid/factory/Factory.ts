import TimelineGridSlice from './Slice';
import type { IRouter } from 'Router/router';
import { List as ListFactory } from 'Controls/dataFactory';
import { ICrud } from 'Types/source';
import { format as EntityFormat } from 'Types/entity';
import { TFilter } from 'Controls/interface';

import type {
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
} from './ITimelineGridFactory';
import {
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import { IRange } from './ITimelineGridFactory';

function prepareFilter(
    filter: TFilter,
    source: ICrud,
    range: IRange,
    dynamicColumnsFilterField: string
) {
    const dynamicColumnsFilter: ITimelineColumnsFilter = prepareDynamicColumnsFilter(
        range,
        'bothways'
    );
    return {
        ...filter,
        [dynamicColumnsFilterField]: prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            source.getAdapter(),
            EntityFormat.DateTimeField
        ),
    };
}

async function loadData(
    dataFactoryArguments: ITimelineGridDataFactoryArguments,
    dependenciesResults: Record<string, unknown>,
    Router: IRouter
) {
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;

    const restoredRange = await RangeHistoryUtils.restore(dataFactoryArguments.rangeHistoryId);
    const range = restoredRange || dataFactoryArguments.range;

    const filter = prepareFilter(
        dataFactoryArguments.filter,
        dataFactoryArguments.source,
        range,
        field
    );
    const loadDynamicColumnsDataArguments = {
        ...dataFactoryArguments,
        source: dataFactoryArguments.source,
        filter,
        deepScrollLoad: true,
    };
    return ListFactory.loadData(
        loadDynamicColumnsDataArguments,
        dependenciesResults,
        Router,
        true
    ).then((result) => {
        return { ...result, range };
    });
}

export default {
    loadData,
    slice: TimelineGridSlice,
};
