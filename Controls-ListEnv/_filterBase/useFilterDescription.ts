import { useMemo, useContext, useCallback } from 'react';
import { IFilterItem } from 'Controls/filter';
import { ListSlice, IListState } from 'Controls/dataFactory';
import { logger } from 'Application/Env';
import { useSlice, DataContext } from 'Controls-DataEnv/context';
import { getWasabyContext } from 'UICore/Contexts';
import 'Controls/filter';

export interface IUseFilterDescriptionOptions {
    storeId: string | string[];
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

function getFilterDescription(slices: TSlices): IFilterItem[] | void {
    return Object.values(slices)[0]?.state?.filterDescription;
}

function logErrorWithDescription(msg: string, storeId: string | string[]) {
    const dataContext = useContext(DataContext);
    const wasabyContext = useContext(getWasabyContext());

    logger.error(`
            ${msg}
            Опция storeId: ${JSON.stringify(storeId)}
            Текущий контекст: ${Object.keys(dataContext)}. 
            Страница: ${
                wasabyContext.Router.maskResolver.calculateUrlParams('page/:pageId').pageId
            }`);
}

function validateSlices(slices: TSlices, storeIds: string[]) {
    if (!storeIds.length) {
        logErrorWithDescription(
            'Controls-ListEnv/filter не указана опция storeId у контрола фильтра',
            storeIds
        );
    }

    if (!slices) {
        logErrorWithDescription('Controls-ListEnv/filter не найден слайс по storeId', storeIds);
    }

    Object.values(slices).forEach((filterSlice) => {
        if (filterSlice['[ICompatibleSlice]']) {
            logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    });
}

function validateFilterDescription(slices: TSlices): void {
    if (!getFilterDescription(slices)) {
        logger.warn(
            'На странице используется контрол фильтра,' +
                ' но в загрузчике не передана опция filterDescription'
        );
    }
}

/**
 * Хук для получения описания фильтров.
 * @private
 */
export function useFilterDescription({
    storeId,
    filterNames,
}: IUseFilterDescriptionOptions): IUseFilterDescription {
    const storeIds = useMemo(() => {
        const ids = Array.isArray(storeId) ? storeId : [storeId];
        return ids.filter((id) => id !== undefined && id !== null);
    }, [storeId]);

    const slicesObj = storeIds.reduce((accum, storeId) => {
        const slice = useSlice<ListSlice>(storeId);

        if (slice) {
            accum[storeId] = slice;
        }
        return accum;
    }, {});

    const slices = useMemo(() => slicesObj, Object.values(slicesObj));

    if (Object.keys(slices).length === 0) {
        logErrorWithDescription(
            `useFilterDescription::В контексте данных не найдены слайсы с именами ${storeIds.join(
                ','
            )}`,
            storeId
        );
    }

    useMemo(() => {
        validateSlices(slices, storeIds);
        validateFilterDescription(slices);
    }, [slices, storeId]);

    const fullFilterDescription = getFilterDescription(slices) || [];

    const filterDescription = useMemo(() => {
        return getFilterDescriptionByFilterNames(fullFilterDescription, filterNames);
    }, [filterNames, storeId, slices, fullFilterDescription]);

    const applyFilterDescription = useCallback(
        (
            newFilterDescription: IFilterItem[],
            additionalState: Partial<IListState>,
            appliedFrom: string
        ): void => {
            Object.values(slices).forEach((filterSlice) => {
                filterSlice.applyFilterDescription(
                    newFilterDescription,
                    additionalState,
                    appliedFrom
                );
            });
        },
        [storeId, slices, filterDescription]
    );

    return {
        fullFilterDescription,
        filterDescription,
        applyFilterDescription,
    };
}
