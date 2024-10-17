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
    getQuantumScaleMap,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import slice, { defaultQuantums } from './Slice';
import { getNextQuantum, getQuantum, IQuantum } from 'Controls-Lists/_timelineGrid/utils';

function prepareFilter(
    filter: TFilter,
    source: ICrud,
    range: IRange,
    dynamicColumnsFilterField: string,
    quantums?: IQuantum[],
    quantumScale?: number
) {
    const dynamicColumnsFilter: ITimelineColumnsFilter = prepareDynamicColumnsFilter(
        range,
        'bothways',
        undefined,
        undefined,
        quantums,
        quantumScale
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
    Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
) {
    const { field } = dataFactoryArguments.columnsNavigation.sourceConfig;

    const historyData = await RangeHistoryUtils.restoreAll(dataFactoryArguments.rangeHistoryId);
    const range = historyData.range || dataFactoryArguments.range;

    const quantums = dataFactoryArguments.quantums || defaultQuantums;
    const quantum = getQuantum(range, quantums);
    const nextQuantum = getNextQuantum(quantum, quantums, 'increase');
    const quantumScaleMap = historyData.quantumScaleMap || getQuantumScaleMap(quantums);
    const quantumScale = quantumScaleMap[nextQuantum] || 1;

    const filter = prepareFilter(
        dataFactoryArguments.filter,
        dataFactoryArguments.source,
        range,
        field,
        quantums,
        quantumScale
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
            quantumScaleMap,
            quantumScale,
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
