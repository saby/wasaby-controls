import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

export interface IContext {
    close: () => void;
}
const Context = createContext(null as unknown as IContext);

interface IPopupContextProvider extends IContext, TInternalProps {}

export default function ContextProvider(props: IPopupContextProvider) {
    const contextData = useMemo(() => {
        return {
            close: props.close,
        };
    }, [props.close]);

    const clearProps = { ...props };
    delete clearProps.children;

    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...clearProps,
            })}
        </Context.Provider>
    );
}

export { Context };
