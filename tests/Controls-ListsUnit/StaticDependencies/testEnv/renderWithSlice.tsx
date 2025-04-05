import { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import * as SliceContextModule from 'Controls-DataEnv/context';
import { useSlice } from 'Controls-DataEnv/context';
import { createContext, useLayoutEffect, ReactElement, useContext, useState } from 'react';
import { render } from '@testing-library/react';

export function renderWithSlice<TSlice extends AbstractListSlice>(
    storeId: string,
    slice: TSlice,
    Component: ReactElement
) {
    const initContext = {
        [storeId]: slice,
    };
    const SliceContext = createContext(initContext);
    jest.spyOn(SliceContextModule, 'useSlice').mockImplementation((id: string) => {
        return useContext(SliceContext)[id];
    });
    jest.spyOn(SliceContextModule, 'useStrictSlice').mockImplementation((id: string) => {
        return useContext(SliceContext)[id];
    });
    const rerender = {
        call: () => {},
    };
    const originalSliceOnChange = slice._onChange.bind(slice);
    slice._onChange = (...args) => {
        originalSliceOnChange(...args);
        rerender.call();
    };

    function ConnectedComponent() {
        const [sliceContext, setSliceContext] = useState(initContext);
        useLayoutEffect(() => {
            rerender.call = () => {
                setSliceContext({
                    ...sliceContext,
                });
            };
        }, []);
        return <SliceContext.Provider value={sliceContext}>{Component}</SliceContext.Provider>;
    }
    render(<ConnectedComponent />, {
        container: document.createElement('div'),
    });
}
