import { useEffect } from 'react';
import { activate } from 'UICommon/Focus';
import { useSlice } from 'Controls-DataEnv/context';

/**
 * Хук для управления состоянием фокурсровки слайса.
 * @param {object} inputRef
 * @param {string} storeId
 */
export function useSearchConnectedFocus(inputRef, storeId) {
    const slice = useSlice(storeId);
    const searchInputFocused = slice?.state?.searchInputFocused;
    useEffect(() => {
        if (searchInputFocused) {
            activate(inputRef.current);
        }
    }, [searchInputFocused]);
    return slice;
}
