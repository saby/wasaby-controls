import { createContext } from 'react';

export interface IIsolatedContextState {
    dataLayoutId: string;
    path: string[];
}

//@ts-ignore
const IsolatedContext = createContext<IIsolatedContextState>({});

IsolatedContext.displayName = 'Controls-DataEnv/context:IsolatedContext';

export default IsolatedContext;
