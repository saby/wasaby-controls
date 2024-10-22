import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

/**
 * Контекст
 * @class Controls/_LoadingIndicator/Context
 * @public
 * @remark Контекст, в котором содержатся стандартные методы индикатора:
 * * showIndicator
 * * hideIndicator
 */
const Context = createContext(null);

interface ILoadingIndicatorContextProvider extends TInternalProps {
    showIndicator: Function;
    hideIndicator: Function;
}

export default function ContextProvider(props: ILoadingIndicatorContextProvider) {
    const contextData = useMemo(() => {
        return {
            showIndicator: props.showIndicator,
            hideIndicator: props.hideIndicator,
        };
    }, [props.showIndicator, props.hideIndicator]);

    const newProps = { ...props };
    delete newProps.showIndicator;
    delete newProps.hideIndicator;

    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...newProps,
                children: props.children.props.children,
            })}
        </Context.Provider>
    );
}

export { Context };
