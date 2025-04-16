import { forwardRef, memo, ForwardedRef } from 'react';
import { default as DataContextCompatible } from 'Controls/_contextDeprecated/DataContextCompatible';
import { ListSlice } from 'Controls/dataFactory';
import * as React from 'react';

interface IProps {
    children: JSX.Element;
    value: ListSlice;
}

function DataContextCompatibleProvider(props: IProps, ref: ForwardedRef<object>): JSX.Element {
    return (
        <DataContextCompatible.Provider value={props.value}>
            {React.cloneElement(props.children, {
                ...props,
                value: null,
                forwardedRef: ref,
            })}
        </DataContextCompatible.Provider>
    );
}

export default memo(forwardRef(DataContextCompatibleProvider));
