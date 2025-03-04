/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import {
    DynamicGridColumnContext,
    IDynamicGridColumnContextValue,
} from './DynamicGridColumnContext';

interface IDynamicGridColumnContextProviderProps extends IDynamicGridColumnContextValue {
    children: JSX.Element;
}

export function DynamicGridColumnContextProvider(
    props: IDynamicGridColumnContextProviderProps
): JSX.Element {
    const contextValue = React.useMemo(
        () => ({
            columnIndex: props.columnIndex,
            renderData: props.renderData,
            columnWidth: props.columnWidth,
        }),
        [props.columnIndex, props.renderData, props.columnWidth]
    );

    return (
        <DynamicGridColumnContext.Provider value={contextValue}>
            {props.children}
        </DynamicGridColumnContext.Provider>
    );
}

const DynamicGridColumnContextProviderMemo = React.memo(DynamicGridColumnContextProvider);
export default DynamicGridColumnContextProviderMemo;
