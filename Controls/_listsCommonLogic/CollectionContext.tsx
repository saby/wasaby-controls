import { createContext, useContext, ReactElement } from 'react';

import type { Collection } from 'Controls/display';

export const _ctx = createContext<Collection | null>(null);
_ctx.displayName = 'Controls/listsCommonLogic:CollectionContext';

export function useCollection<T = Collection>(): T {
    return useContext(_ctx) as unknown as T;
}

type TProviderProps<T = Collection> = {
    children: ReactElement;
    collection: T;
};

export function Provider<T = Collection>({ children, collection }: TProviderProps<T>) {
    return <_ctx.Provider value={collection as unknown as Collection}>{children}</_ctx.Provider>;
}
