import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

const Context = createContext(null);

interface IPopupContextProvider extends TInternalProps {
    close: Function;
    sendResult: Function;
}

export default function ContextProvider(props: IPopupContextProvider) {
    const contextData = useMemo(() => {
        return {
            sendResult: props.sendResult,
            close: props.close
        };
    }, [props.close, props.sendResult]);

    return (
        <Context.Provider value={contextData}>
            {
                cloneElement(props.children, {
                    ...props
                })
            }
        </Context.Provider>
    );
}

export { Context };