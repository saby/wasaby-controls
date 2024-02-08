import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

const Context = createContext(null);

interface IPopupContextProvider extends TInternalProps {
    close: Function;
    sendResult: Function;
    maximized: Function;
}

export default function ContextProvider(props: IPopupContextProvider) {
    const contextData = useMemo(() => {
        return {
            sendResult: props.sendResult,
            close: props.close,
            maximized: props.maximized,
        };
    }, [props.close, props.sendResult, props.maximized]);

    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...props,
            })}
        </Context.Provider>
    );
}

export { Context };
