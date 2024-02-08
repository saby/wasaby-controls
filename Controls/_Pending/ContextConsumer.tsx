import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';

export default function ContextConsumer(props: TInternalProps) {
    const context = useContext(Context);

    return (
        <>
            {
                cloneElement(props.children, {
                    ...this.props,
                    registerPending: context.registerPending,
                    finishPendingOperations: context.finishPendingOperations,
                    cancelFinishingPending: context.cancelFinishingPending
                })
            }
        </>
    );
}