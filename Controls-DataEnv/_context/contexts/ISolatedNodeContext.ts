import { createContext } from 'react';

/**
 * Состояние контекста, который хранит путь до текущего уровня контекста данных
 * @public
 */
export interface IIsolatedContextState {
    /**
     * Ключ текущего уровня
     */
    dataLayoutId: string;
    /**
     * Путь
     */
    path: string[];
}

//@ts-ignore
const IsolatedContext = createContext<IIsolatedContextState>({});

IsolatedContext.displayName = 'Controls-DataEnv/context:IsolatedContext';

export default IsolatedContext;
