import { cloneElement, createContext, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

export interface IInfoBoxContext {
    onOpenInfoBox: (event: Event, config: unknown, withDelay?: boolean) => void;
    onCloseInfoBox: (event: Event, withDelay?: boolean) => void;
    onForceCloseInfoBox: (_e: Event) => void;
}

/**
 * Контекст инфобокса
 * @class Controls/_popup/Context/InfoBoxContext
 * @public
 * @remark Контекст, в котором содержатся методы для манипуляции инфобоксом:
 * * onOpenInfoBox
 * * onCloseInfoBox
 * * onForceCloseInfoBox
 */
const Context = createContext(null as unknown as IInfoBoxContext);

interface IInfoBoxContextProvider extends IInfoBoxContext, TInternalProps {}

export default function ContextProvider(props: IInfoBoxContextProvider) {
    const contextData = useMemo(() => {
        return {
            onOpenInfoBox: props.onOpenInfoBox,
            onCloseInfoBox: props.onCloseInfoBox,
            onForceCloseInfoBox: props.onForceCloseInfoBox,
        };
    }, [props.onCloseInfoBox, props.onForceCloseInfoBox, props.onOpenInfoBox]);

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
