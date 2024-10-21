import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */
//@ts-ignore
const SliceContext = React.createContext<Record<string | symbol, Slice | unknown>>(undefined);

SliceContext.displayName = 'Controls-DataEnv/context:DataContext';

export default SliceContext;
