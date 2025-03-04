import * as React from 'react';
import { Meta } from 'Meta/types';

export interface IContext {
    metaType: Meta<unknown>;
}

interface IContextProviderProps extends IContext {
    children?: React.ReactNode;
}

export const Context = React.createContext<IContext>(null as unknown as IContext);

export default function ContextProvider(props: IContextProviderProps) {
    const data = React.useMemo(() => {
        return {
            metaType: props.metaType,
        };
    }, [props.metaType]);
    return <Context.Provider value={data} children={props.children} />;
}
