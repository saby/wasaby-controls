import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';
import type Store from '../Store';

/**
 * Интерфейс для контекста
 * @public
 */
export interface IRootContext {
    contextUUID: string;
    storeValue: Record<string, unknown>;
    store: Store;

    getNode(name: string[] | string): Record<string, Slice | unknown> | null;

    getElement(elementName: string, path: string[]): Slice | unknown | undefined;
}

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */

//@ts-ignore
const HierarchySliceContext = React.createContext<IRootContext>(undefined);

HierarchySliceContext.displayName = 'Controls-DataEnv/context:RootDataContext';

export default HierarchySliceContext;
