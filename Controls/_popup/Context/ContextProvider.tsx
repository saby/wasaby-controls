import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

export interface IContext {
    close: () => void;
    sendResult: (...args: unknown[]) => unknown;
    maximized: (state: boolean) => void;
    isPopup: boolean;
    popupId: string;
}

/**
 * Контекст
 * @class Controls/_pending/Context
 * @public
 * @remark Контекст, в котором содержатся стандартные методы окон:
 * * close
 * * sendResult
 */
const Context = createContext(null as unknown as IContext);

interface IPopupContextProvider extends IContext, TInternalProps {}

export default function ContextProvider(props: IPopupContextProvider) {
    const contextData = useMemo(() => {
        return {
            sendResult: props.sendResult,
            close: props.close,
            maximized: props.maximized,
            isPopup: props.isPopup,
            popupId: props.popupId,
        };
    }, [props.close, props.sendResult, props.maximized]);

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
