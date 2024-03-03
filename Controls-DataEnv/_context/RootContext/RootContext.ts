import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';
import type Store from '../Store';

export interface IRootContext {
    store: Store;
    storeValue: Record<string, Record<string, Slice | unknown>>;

    getNode(name: string): Record<string, Slice | unknown>;

    getElement(elementName: string, startNodeName: string): Slice | unknown | undefined;
}

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */

//@ts-ignore
const RootContext = React.createContext<IRootContext>(undefined);

RootContext.displayName = 'Controls-DataEnv/context:RootDataContext';

export default RootContext;
