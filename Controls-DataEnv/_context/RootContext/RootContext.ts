import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';

export interface IRootContext {
    store: Record<string, Record<string, Slice>>;
    getNode(name: string): Record<string, Slice>;
    getElement(elementName: string, startNodeName: string): Slice | unknown | undefined;
}

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */
const RootContext = React.createContext<IRootContext>(undefined);

RootContext.displayName = 'Controls-DataEnv/context:RootDataContext';

export default RootContext;
