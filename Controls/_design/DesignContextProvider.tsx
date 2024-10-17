import { forwardRef, memo } from 'react';
import { default as DesignContext } from 'Controls/_design/Context';
import * as React from 'react';

interface IProps {
    children: JSX.Element;
    value: Record<string, unknown>;
}

function DesignContextProvider(props: IProps, ref: React.ForwardedRef<HTMLElement>): JSX.Element {
    const { value, ...childProps } = props;
    return (
        <DesignContext.Provider value={value}>
            {React.cloneElement(props.children, {
                ...childProps,
                forwardedRef: ref,
            })}
        </DesignContext.Provider>
    );
}

export default memo(forwardRef(DesignContextProvider));
