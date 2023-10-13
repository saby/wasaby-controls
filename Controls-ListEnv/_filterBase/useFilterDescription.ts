import * as React from 'react';
import { IFilterItem } from 'Controls/filter';
import { ListSlice, IListState } from 'Controls/dataFactory';
import { Logger } from 'UI/Utils';
import { object } from 'Types/util';
import { useSlice } from 'Controls-DataEnv/context';

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

function getFilterDescription(slices: TSlices): IFilterItem[] {
    return Object.values(slices)[0].state.filterDescription;
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

function validateFilterDescription(slices: TSlices): void {
    if (!object.clonePlain(getFilterDescription(slices))) {
        Logger.warn(
            'На странице используется контрол фильтра,' +
                ' но в загрузчике не передана опция filterDescription'
        );
    }
}

const { useMemo, useEffect, useCallback } = React;

/**
 * Хук для получения описания фильтров.
 * @private
 */
export function useFilterDescription(props: IUseFilterDescriptionOptions): IUseFilterDescription {
    const slices = {};
    const storeIds = Array.isArray(props.storeId) ? props.storeId : [props.storeId];

    storeIds.forEach((storeId) => {
        slices[storeId] = useSlice<ListSlice>(storeId);
    });

    useEffect(() => {
        validateSlices(slices, props.storeId);
        validateFilterDescription(slices);
    }, [slices, props.storeId]);

    const fullFilterDescription = useMemo(() => {
        return getFilterDescription(slices);
    }, [props.storeId, slices]);

    const filterDescription = useMemo(() => {
        const fullDescription = getFilterDescription(slices);
        return getFilterDescriptionByFilterNames(fullDescription, props.filterNames);
    }, [props.filterNames, props.storeId, slices]);

    const applyFilterDescription = useCallback(
        (newFilterDescription: IFilterItem[], additionalState: Partial<IListState>): void => {
            Object.values(slices).forEach((filterSlice: ListSlice) => {
                filterSlice.applyFilterDescription(newFilterDescription, additionalState);
            });
        },
        [props.storeId, slices]
    );

    return {
        fullFilterDescription,
        filterDescription,
        applyFilterDescription,
    };
}
