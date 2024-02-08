import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

const Context = createContext(null);

interface IPendingContextProvider extends TInternalProps {
    registerPending: Function;
    finishPendingOperations: Function;
    cancelFinishingPending: Function;
}

export default function ContextProvider(props: IPendingContextProvider) {
    const contextData = useMemo(() => {
        return {
            registerPending: props.registerPending,
            finishPendingOperations: props.finishPendingOperations,
            cancelFinishingPending: props.cancelFinishingPending,
        };
    }, [props.registerPending, props.finishPendingOperations, props.cancelFinishingPending]);
    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...props,
                ...props.children.props,
            })}
        </Context.Provider>
    );
}

export { Context };