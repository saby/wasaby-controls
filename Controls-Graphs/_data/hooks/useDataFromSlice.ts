import { useSlice, useConnectedValue } from 'Controls-DataEnv/context';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export const LINEAR_CHART_DATA: ISingleItem[] = [
    {
        id: 1,
        name: 'First',
        count: 10000,
        percent: 50000,
        total: 25000,
    },
    {
        id: 2,
        name: 'Second',
        count: 20000,
        percent: 40000,
        total: 45000,
    },
    {
        id: 3,
        name: 'Third',
        count: 30000,
        percent: 30000,
        total: 10000,
    },
    {
        id: 4,
        name: 'Fourth',
        count: 40000,
        percent: 20000,
        total: 8000,
    },
    {
        id: 5,
        name: 'Fifth',
        count: 50000,
        percent: 10000,
        total: 15000,
    },
];

export const LINEAR_CHART_SERIES_CONFIG: ISingleSeriesItem[] = [
    {
        valueProperty: 'count',
        colorIndex: 2,
        name: 'Количество',
    },
    {
        valueProperty: 'percent',
        colorIndex: 4,
        name: 'Процент',
    },
    {
        valueProperty: 'total',
        colorIndex: 6,
        name: 'Всего',
    },
];

const graphConfig = {
    data: LINEAR_CHART_DATA,
    series: LINEAR_CHART_SERIES_CONFIG,
};

const getDataFromName = (context, series): ISingleItem[] | null => {
    if (!context.value) {
        return null;
    }
    const value = context.value;
    const data: ISingleItem[] = [];
    if (!!series?.length) {
        value?.forEach((item) => {
            const dataElem: ISingleItem = {};
            series.forEach((serie) => {
                for (const key of Object.keys(serie)) {
                    dataElem[serie[key]] = item.get(serie[key]);
                }
            });
            data.push(dataElem);
        });
    }
    return data;
};

const getDataFromSlice = (slice, series): ISingleItem[] | null => {
    const data: ISingleItem[] = [];
    if (!slice?.state?.items || !series?.length) return null;
    const items = slice.state.items;
    items?.each((item) => {
        const dataElem: ISingleItem = {};
        series.forEach((serie) => {
            for (const key of Object.keys(serie)) {
                dataElem[serie[key]] = item.get(serie[key]);
            }
        });
        data.push(dataElem);
    });
    return data;
};

export const useDataFromSlice = (
    storeId?: string,
    series?: ISingleSeriesItem[],
    name?: unknown
) => {
    const storeIdSlice = useSlice(storeId as string);
    const nameContext = useConnectedValue(name);
    const nameSlice = useSlice(name?.join?.('_'));
    const dataFromStoreIdSlice = getDataFromSlice(storeIdSlice, series);
    const dataFromNameSlice = getDataFromSlice(nameSlice, series);
    const dataFromNameContext = getDataFromName(nameContext, series);
    if (dataFromStoreIdSlice !== null) {
        return {
            series,
            data: dataFromStoreIdSlice,
        };
    }
    if (dataFromNameSlice !== null) {
        return {
            series,
            data: dataFromNameSlice,
        };
    }
    if (dataFromNameContext !== null) {
        return {
            series,
            data: dataFromNameContext,
        };
    }
    return graphConfig;
};
