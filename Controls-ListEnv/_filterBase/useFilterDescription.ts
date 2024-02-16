import * as React from 'react';
import { IFilterItem, setAppliedFrom } from 'Controls/filter';
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
    const storeIds = useMemo(() => {
        return Array.isArray(props.storeId) ? props.storeId : [props.storeId];
    }, [props.storeId]);

    const slicesObj = storeIds.reduce((accum, storeId) => {
        accum[storeId] = useSlice<ListSlice>(storeId);
        return accum;
    }, {});

    const slices = useMemo(() => slicesObj, Object.values(slicesObj));

    useEffect(() => {
        validateSlices(slices, props.storeId);
        validateFilterDescription(slices);
    }, [slices, props.storeId]);

    const fullFilterDescription = getFilterDescription(slices);

    const filterDescription = useMemo(() => {
        return getFilterDescriptionByFilterNames(fullFilterDescription, props.filterNames);
    }, [props.filterNames, props.storeId, slices, fullFilterDescription]);

    const applyFilterDescription = useCallback(
        (
            newFilterDescription: IFilterItem[],
            additionalState: Partial<IListState>,
            appliedFrom: string
        ): void => {
            const descriptionForApply = setAppliedFrom(
                filterDescription,
                newFilterDescription,
                appliedFrom
            );
            Object.values(slices).forEach((filterSlice) => {
                filterSlice.applyFilterDescription(descriptionForApply, additionalState);
            });
        },
        [props.storeId, slices, filterDescription]
    );

    return {
        fullFilterDescription,
        filterDescription,
        applyFilterDescription,
    };
}
