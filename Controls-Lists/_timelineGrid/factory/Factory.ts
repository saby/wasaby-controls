/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import type { IRouter } from 'Router/router';
import { IDataFactory, List as ListFactory } from 'Controls/dataFactory';
import { ICrud } from 'Types/source';
import { format as EntityFormat } from 'Types/entity';
import { TFilter } from 'Controls/interface';

import type {
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
    IRange,
} from './ITimelineGridDataFactoryArguments';
import {
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import slice from './Slice';

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
        return {
            ...result,
            range,
        };
    });
}

/**
 * Фабрика данных Таймлайн таблицы.
 * @class Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory
 * @public
 */

/**
 * @name Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory#slice
 * @cfg {Controls-Lists/_timelineGrid/factory/Slice/TimelineGridSlice} Слайс Таймлайн таблицы.
 */

/**
 * Метод загрузки данных для Таймлайн таблицы.
 * @function Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory#loadData
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments} config Аргументы фабрики данных Таймлайн таблицы.
 */
export type ITimelineGridDataFactory = IDataFactory<unknown, ITimelineGridDataFactoryArguments>;

const timelineGridDataFactory: ITimelineGridDataFactory = {
    loadData,
    slice,
};

export default timelineGridDataFactory;
