import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';

export default function ContextConsumer(props: TInternalProps) {
    const context = useContext(Context);

    return (
        <>
            {cloneElement(props.children, {
                ...props,
                sendResult: context?.sendResult,
                close: context?.close,
            })}
        </>
    );
}
