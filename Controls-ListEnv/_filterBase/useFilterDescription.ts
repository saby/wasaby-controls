import * as React from 'react';
import { IFilterItem } from 'Controls/filter';
import { ListSlice, IListState } from 'Controls/dataFactory';
import { Logger } from 'UI/Utils';
import { object } from 'Types/util';
import { DataContext } from 'Controls-DataEnv/context';
import { IContextOptionsValue } from 'Controls/context';

export interface IUseFilterDescriptionOptions {
    storeId?: string | string[];
    filterNames?: string[];
}

export interface IUseFilterDescription {
    fullFilterDescription: IFilterItem[];
    filterDescription: IFilterItem[];
    applyFilterDescription: Function;
}

type TSlices = Record<string, ListSlice>;

function getFilterSlices(context: IContextOptionsValue, storeId: string): TSlices {
    const id = !Array.isArray(storeId) ? [storeId] : storeId;
    return context?.getStoreData<TSlices>(id);
}

function getFilterDescriptionByFilterNames(
    filterDescription: IFilterItem[],
    filterNames: string[]
): IFilterItem[] {
    if (filterNames) {
        return filterDescription.filter(({ name }) => {
            return (filterNames as string[]).includes(name);
        });
    } else {
        return filterDescription;
    }
}

function getFilterDescription(context: IContextOptionsValue, storeId: string): IFilterItem[] {
    const slices = getFilterSlices(context, storeId);
    return Object.values(slices)[0].filterDescription;
}

function validateSlices(slices: TSlices | unknown, storeId: string | string[]) {
    if (!storeId) {
        throw new Error('Controls-ListEnv/filter не указана опция storeId у контрола фильтра');
    }

    if (!slices) {
        throw new Error(`Controls-ListEnv/filter не найден слайс по storeId: ${storeId}`);
    }

    Object.values(slices).forEach((filterSlice) => {
        if (storeId && filterSlice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    });
}

function validateFilterDescription(context: IContextOptionsValue, storeId: string): void {
    if (!object.clonePlain(getFilterDescription(context, storeId))) {
        Logger.warn(
            'На странице используется контрол фильтра,' +
                ' но в загрузчике не передана опция filterDescription'
        );
    }
}

const { useContext, useMemo, useEffect, useCallback } = React;

/**
 * Хук для получения описания фильтров.
 * @private
 */
export function useFilterDescription(props: IUseFilterDescriptionOptions): IUseFilterDescription {
    const context = useContext(DataContext);

    useEffect(() => {
        validateSlices(getFilterSlices(context, props.storeId), props.storeId);
        validateFilterDescription(context, props.storeId);
    }, [props.storeId]);

    const fullFilterDescription = useMemo(() => {
        return getFilterDescription(context, props.storeId);
    }, [props.storeId, context]);

    const filterDescription = useMemo(() => {
        const fullDescription = getFilterDescription(context, props.storeId);
        return getFilterDescriptionByFilterNames(fullDescription, props.filterNames);
    }, [props.filterNames, props.storeId, context]);

    const applyFilterDescription = useCallback(
        (newFilterDescription: IFilterItem[], additionalState: Partial<IListState>): void => {
            Object.values(getFilterSlices(context, props.storeId)).forEach((filterSlice) => {
                filterSlice.applyFilterDescription(newFilterDescription, additionalState);
            });
        },
        [props.storeId, context]
    );

    return {
        fullFilterDescription,
        filterDescription,
        applyFilterDescription,
    };
}
