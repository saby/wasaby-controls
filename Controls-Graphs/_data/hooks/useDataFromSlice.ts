import { useSlice, useConnectedValue } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { RecordSet } from 'Types/collection';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

interface IGraphDataContext {
    value: RecordSet<ISingleItem>;
}
interface IGraphDataSlice extends Slice<{ items: RecordSet<ISingleItem> }> {}

const getDataFromName = (
    context: IGraphDataContext,
    series: ISingleSeriesItem[]
): ISingleItem[] | null => {
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
                    if (
                        key === 'valueProperty' ||
                        key === 'xValueProperty' ||
                        key === 'displayProperty' ||
                        key === 'colorProperty'
                    ) {
                        const currentSerieField = serie[key] as string;
                        dataElem[currentSerieField] = item.get(currentSerieField);
                    }
                }
            });
            data.push(dataElem);
        });
    }
    return data;
};

const getDataFromSlice = (
    slice: IGraphDataSlice,
    series: ISingleSeriesItem[]
): ISingleItem[] | null => {
    const data: ISingleItem[] = [];
    if (!slice?.state?.items || !series?.length) {
        return null;
    }
    const items = slice.state.items;
    items?.each((item) => {
        const dataElem: ISingleItem = {};
        series.forEach((serie) => {
            for (const key of Object.keys(serie)) {
                const currentSerieField = serie[key as keyof typeof serie] as string;
                dataElem[currentSerieField] = item.get(currentSerieField);
            }
        });
        data.push(dataElem);
    });
    return data;
};

export const useDataFromSlice = (
    storeId: string = '',
    series: ISingleSeriesItem[] = [],
    name: string[] = []
) => {
    const storeIdSlice = useSlice(storeId as string) as IGraphDataSlice;
    const nameContext = useConnectedValue(name) as IGraphDataContext;
    const nameSlice = useSlice(name?.join?.('_')) as IGraphDataSlice;
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
    return {
        series,
        data: [],
    };
};
