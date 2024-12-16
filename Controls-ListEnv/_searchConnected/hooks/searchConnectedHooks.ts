/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

import { useEffect, RefObject, useMemo, useCallback } from 'react';
import { activate } from 'UICommon/Focus';
import { useSlice } from 'Controls-DataEnv/context';
import type { ListSlice } from 'Controls/dataFactory';

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
        return useSlice<ListSlice>(id);
    });
    const searchInputFocused = useMemo(() => {
        return slices.some((slice) => slice?.state.searchInputFocused);
    }, slices);

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
