/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
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
    getQuantsReplacementMap,
    prepareTimelineDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import {
    RangeHistoryUtils,
    TQuantsReplacementMap,
} from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import slice, { defaultQuantums } from './Slice';

function prepareLoadingFilter(
    filter: TFilter,
    source: ICrud,
    range: IRange,
    dynamicColumnsFilterField: string,
    quantsReplacementMap?: TQuantsReplacementMap
) {
    const dynamicColumnsFilter: ITimelineColumnsFilter = prepareTimelineDynamicColumnsFilter({
        range,
        direction: 'bothways',
        startPositionToForward: undefined,
        startPositionToBackward: undefined,
        quantsReplacementMap,
    });
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
    Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
) {
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;

    const historyData = await RangeHistoryUtils.restoreAll(dataFactoryArguments.rangeHistoryId);
    const range = historyData.range || dataFactoryArguments.range;

    const quantums = dataFactoryArguments.quantums || defaultQuantums;
    const quantsReplacementMap =
        historyData.quantsReplacementMap || getQuantsReplacementMap(quantums);
    const filter = prepareLoadingFilter(
        dataFactoryArguments.filter,
        dataFactoryArguments.source,
        range,
        field,
        quantsReplacementMap
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
        true,
        fabricId
    ).then((result) => {
        return {
            ...result,
            range: historyData.range,
            needScroll: historyData.needScroll,
            quantsReplacementMap,
        };
    });
}

/**
 * Фабрика данных Таймлайн таблицы.
 * @class Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory
 * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments
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
