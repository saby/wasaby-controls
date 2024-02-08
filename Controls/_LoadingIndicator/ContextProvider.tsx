import { createContext, cloneElement, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

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

    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...props,
                children: props.children.props.children,
            })}
        </Context.Provider>
    );
}

export { Context };
