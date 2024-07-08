import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';
export default function ContextConsumer(props: TInternalProps) {
    const context = useContext(Context);

    const clearProps = { ...props };
    delete clearProps.children;

    return (
        <>
            {cloneElement(props.children, {
                ...clearProps,
                sendResult: context?.sendResult,
            })}
        </>
    );
}
