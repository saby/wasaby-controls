import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */
//@ts-ignore
const DataContext = React.createContext<Record<string | symbol, Slice | unknown>>(undefined);

DataContext.displayName = 'Controls-DataEnv/context:DataContext';

export default DataContext;
