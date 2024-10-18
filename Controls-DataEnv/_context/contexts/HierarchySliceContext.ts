import * as React from 'react';
import type Store from '../store/Store';
import { CONTEXT_STORE_FIELD } from '../Constants';

/**
 * Интерфейс для контекста
 * @public
 */
export interface IRootContext {
    [CONTEXT_STORE_FIELD]: Store;
    rootKey: string;
}

/**
 * Экземпляр нативного ReactContext.
 * Значением контекста является объект со слайсами.
 */

//@ts-ignore
const HierarchySliceContext = React.createContext<IRootContext>(undefined);

HierarchySliceContext.displayName = 'Controls-DataEnv/context:RootDataContext';

export default HierarchySliceContext;
