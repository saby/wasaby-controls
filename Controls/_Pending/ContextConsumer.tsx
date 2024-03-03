import { cloneElement, useContext } from 'react';
import { Context } from './ContextProvider';
import { TInternalProps } from 'UICore/executor';

/**
 * Обертка, позволяющая получить контекст пендинга
 * @class Controls/_Pending/ContextConsumer
 * @public
 * @remark Контекст, в котором содержатся стандартные методы пендинга:
 * * registerPending
 * * finishPendingOperations
 * * cancelFinishingPending
 */

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