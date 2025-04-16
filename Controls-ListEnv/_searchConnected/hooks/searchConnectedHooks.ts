/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

import { useEffect, RefObject, useMemo, useCallback } from 'react';
import { activate } from 'UICommon/Focus';
import { useSliceActions, useSelector } from 'Controls-DataEnv/context';
import type { ListSlice, IListState } from 'Controls/dataFactory';

/**
 * Хук для управления состоянием фокурсровки слайсов с уже собранным массивом слайсов.
 * @param {object} inputRef
 * @param {string} storeId
 * @param slices
 */
export function useSearchConnectedFocusWithSlices(
    inputRef: RefObject<HTMLElement>,
    storeId: string | string[],
    slices: readonly (ListSlice | undefined)[]
): () => void {
    const storeIds = useMemo(() => {
        if (Array.isArray(storeId)) {
            return storeId;
        }
        return [storeId];
    }, [storeId]);
    const memoizedSelector = useCallback<
        (state: Record<string, IListState> | undefined) => boolean | undefined
    >(
        (state) => {
            if (!state) {
                return;
            }
            return storeIds.some((id) => state[id]?.searchInputFocused);
        },
        [storeIds]
    );
    const searchInputFocused = useSelector<Record<string, IListState>, boolean | undefined>(
        memoizedSelector
    );

    useEffect(() => {
        if (searchInputFocused && inputRef.current) {
            activate(inputRef.current);
        }
    }, [searchInputFocused, inputRef.current]);

    return useCallback(() => {
        return () => {
            slices.forEach((slice) => {
                if (slice && !slice.isDestroyed() && slice.state.searchInputFocused) {
                    slice.setState({ searchInputFocused: false });
                }
            });
        };
    }, slices);
}

/**
 * Хук для управления состоянием фокурсровки слайса.
 * @param {object} inputRef
 * @param {string} storeId
 */
export function useSearchConnectedFocus(
    inputRef: RefObject<HTMLElement>,
    storeId: string | string[]
): () => void {
    const slices = (Array.isArray(storeId) ? storeId : [storeId]).map((id) => {
        return useSliceActions<ListSlice>(id);
    });

    return useSearchConnectedFocusWithSlices(inputRef, storeId, slices);
}
