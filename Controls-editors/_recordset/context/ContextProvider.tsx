import * as React from 'react';

export interface IContext {
    beginAdd: () => Promise<void>;
}

interface IContextProviderProps extends IContext {
    children?: React.ReactNode;
}

export const Context = React.createContext<IContext>(null as unknown as IContext);

export default function ContextProvider(props: IContextProviderProps) {
    const data = React.useMemo(() => {
        return {
            beginAdd: props.beginAdd,
        };
    }, [props.beginAdd]);
    return <Context.Provider value={data} children={props.children} />;
}
