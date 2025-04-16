import { useMemo, useContext, useCallback, useRef } from 'react';
import { TFilterDescription } from 'Controls/filter';
import { ListSlice, IListState } from 'Controls/dataFactory';
import { logger } from 'Application/Env';
import { DataContext, useSelector, useSliceActions } from 'Controls-DataEnv/context';
import { getWasabyContext } from 'UICore/Contexts';
import type { IFilterNamesOptions } from 'Controls-ListEnv/filterConnected';
import 'Controls/filter';

export interface IUseFilterDescriptionOptions extends IFilterNamesOptions {
    storeId: string | string[];
}

interface IUseFilterDescriptionState {
    fullFilterDescription: TFilterDescription;
    filterDescription: TFilterDescription;
}

interface IUseFilterDescriptionActions {
    applyFilterDescription: Function;
    closeDetailPanel: Function;
}
export interface IUseFilterDescription
    extends IUseFilterDescriptionState,
        IUseFilterDescriptionActions {}

type TFilterSlices = Record<string, ListSlice>;

function getFilterDescriptionByFilterNames(
    filterDescription: TFilterDescription,
    filterNames?: string[],
    excludedFilterNames?: string[]
): TFilterDescription {
    if (filterNames) {
        return filterDescription.filter(({ name }) => filterNames.includes(name));
    } else if (excludedFilterNames) {
        return filterDescription.filter(({ name }) => !excludedFilterNames.includes(name));
    } else {
        return filterDescription;
    }
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

function validateSlices(slices: TFilterSlices, storeIds: string[]) {
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

function validateFilterDescription(filterDescription: TFilterDescription | undefined): void {
    if (!filterDescription) {
        logger.warn(
            'На странице используется контрол фильтра,' +
                ' но в загрузчике не передана опция filterDescription'
        );
    }
}

export function useFilterDescriptionState({
    storeId,
    filterNames,
    excludedFilterNames,
}: IUseFilterDescriptionOptions): IUseFilterDescriptionState {
    const storeIds = useMemo(() => {
        const ids = Array.isArray(storeId) ? storeId : [storeId];
        return ids.filter((id) => id !== undefined && id !== null);
    }, [storeId]);

    const filterDescriptionSelector = useCallback(
        (state: Record<string, IListState> | undefined) => {
            if (!state) {
                return;
            }
            for (const id of storeIds) {
                const filterDescriptionFromState = state[id]?.filterDescription;
                if (filterDescriptionFromState) {
                    return filterDescriptionFromState;
                }
            }
        },
        [storeIds]
    );

    const filterDescriptionFromSlice = useSelector<
        Record<string, IListState> | undefined,
        TFilterDescription | undefined
    >(filterDescriptionSelector);

    useMemo(() => {
        validateFilterDescription(filterDescriptionFromSlice);
    }, [filterDescriptionFromSlice]);

    const fullFilterDescription = filterDescriptionFromSlice || [];

    const filterDescription = useMemo(() => {
        return getFilterDescriptionByFilterNames(
            fullFilterDescription,
            filterNames,
            excludedFilterNames
        );
    }, [fullFilterDescription, filterNames, excludedFilterNames]);

    return { filterDescription, fullFilterDescription };
}

export function useFilterDescriptionActions(slices: TFilterSlices): IUseFilterDescriptionActions {
    const applyFilterDescription = useCallback(
        (
            newFilterDescription: TFilterDescription,
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
        [slices]
    );

    const closeDetailPanel = useCallback(() => {
        Object.values(slices).forEach((filterSlice) => {
            if (typeof filterSlice.closeFilterDetailPanel === 'function') {
                filterSlice.closeFilterDetailPanel();
            } else {
                filterSlice.setState({
                    filterDetailPanelVisible: false,
                });
            }
        });
    }, [slices]);

    return { applyFilterDescription, closeDetailPanel };
}

/**
 * Хук для получения описания фильтров.
 * @private
 */
export function useFilterDescription({
    storeId,
    filterNames,
    excludedFilterNames,
}: IUseFilterDescriptionOptions): IUseFilterDescription {
    const storeIds = useMemo(() => {
        const ids = Array.isArray(storeId) ? storeId : [storeId];
        return ids.filter((id) => id !== undefined && id !== null);
    }, [storeId]);

    const slicesRef = useRef<TFilterSlices>({});
    let hasChangedSlices = false;
    const notFoundSliceIds: string[] = [];
    const slicesObj = storeIds.reduce<TFilterSlices>((accum, id) => {
        const dispatcher = useSliceActions<ListSlice>(id);
        if (dispatcher !== slicesRef.current[id]) {
            hasChangedSlices = true;
        }
        if (!dispatcher) {
            notFoundSliceIds.push(id);
            return accum;
        }
        accum[id] = dispatcher;
        return accum;
    }, {});

    if (hasChangedSlices) {
        slicesRef.current = slicesObj;
    }
    const slices = slicesRef.current;

    if (notFoundSliceIds.length !== 0) {
        logErrorWithDescription(
            `useFilterDescription::В контексте данных не найдены слайсы с именами ${notFoundSliceIds.join(
                ','
            )}`,
            storeId
        );
    }

    useMemo(() => {
        validateSlices(slices, storeIds);
    }, [slices, storeIds]);

    const { filterDescription, fullFilterDescription } = useFilterDescriptionState({
        storeId,
        filterNames,
        excludedFilterNames,
    });

    const { applyFilterDescription, closeDetailPanel } = useFilterDescriptionActions(slices);

    return {
        fullFilterDescription,
        filterDescription,
        applyFilterDescription,
        closeDetailPanel,
    };
}
