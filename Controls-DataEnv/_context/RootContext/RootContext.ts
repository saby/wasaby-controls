import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';

interface IRootContext {
    store: Record<string, Record<string, Slice>>;
    getNode(name: string): Record<string, Slice>;
}

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */
const DataContext = React.createContext<IRootContext>(undefined);

DataContext.displayName = 'Controls-DataEnv/context:RootDataContext';

export default DataContext;
