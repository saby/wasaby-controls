import { forwardRef, memo } from 'react';
import { default as DesignContext } from 'Controls/_design/Context';
import * as React from 'react';

interface IProps {
    children: JSX.Element;
    value: Record<string, unknown>;
}

function DesignContextProvider(props: IProps, ref: React.ForwardedRef<HTMLElement>): JSX.Element {
    return (
        <DesignContext.Provider value={props.value}>
            {React.cloneElement(props.children, {
                ...props,
                forwardedRef: ref,
            })}
        </DesignContext.Provider>
    );
}

export default memo(forwardRef(DesignContextProvider));
