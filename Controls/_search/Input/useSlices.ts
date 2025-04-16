import { useCallback, useMemo, useRef } from 'react';
import { useSelector, useSliceActions } from 'Controls-DataEnv/context';
import type { ListSlice, IListState } from 'Controls/dataFactory';

type TSearchPropertyName = keyof IListState;
const PROPERTY_NAMES: TSearchPropertyName[] = [
    'searchParam',
    'searchValue',
    'searchInputValue',
    'minSearchLength',
    'searchDelay',
    'searchValueTrim',
];
export type TSearchStates = Record<string, IListState>;
export type TSearchSlices = Record<string, ListSlice>;

type TSelectorState = Record<string, IListState> | undefined;
export interface ISearchSlicesResult {
    slices: TSearchSlices;
    states: TSearchStates;
}

export function useSlices(
    storeId: string | string[] | undefined,
    preparedSlices?: Record<string, ListSlice | undefined>
): ISearchSlicesResult {
    const searchSlicesRef = useRef<TSearchSlices>({});
    const storeIds = useMemo(() => {
        if (!storeId) {
            return [];
        }
        if (Array.isArray(storeId)) {
            return storeId;
        }
        return [storeId];
    }, [storeId]);
    const slicesObj: TSearchSlices = {};
    let hasChangedStore = false;
    for (const id of storeIds) {
        const slice = preparedSlices ? preparedSlices[id] : useSliceActions<ListSlice>(id);
        if (searchSlicesRef.current[id] !== slice) {
            hasChangedStore = true;
        }
        if (slice) {
            slicesObj[id] = slice;
        }
    }
    if (hasChangedStore) {
        searchSlicesRef.current = slicesObj;
    }
    const slices = searchSlicesRef.current;

    // В текущем виде не помогает оптимизация useSelector, на первом уровне всегда новые объекты.
    // Некогда рефакторить, вернул пока реф.
    const searchStatesRef = useRef<TSearchStates>({});
    const memoizedSelector = useCallback<(state: TSelectorState) => TSearchStates>(
        (state) => {
            if (!state) {
                return searchStatesRef.current;
            }
            const statesObj: TSearchStates = {};
            let hasChangedState = false;
            for (const id of storeIds) {
                statesObj[id] = PROPERTY_NAMES.reduce(
                    (accum: Partial<IListState>, propertyName) => {
                        const propertyValue = state[id]?.[propertyName];
                        accum[propertyName] = propertyValue;
                        if (searchStatesRef.current[id]?.[propertyName] !== propertyValue) {
                            hasChangedState = true;
                        }
                        return accum;
                    },
                    {}
                ) as IListState;
            }
            if (hasChangedState) {
                searchStatesRef.current = statesObj;
            }
            return searchStatesRef.current;
        },
        [storeIds]
    );

    const states = useSelector<TSelectorState, TSearchStates>(memoizedSelector);

    return { slices, states };
}
