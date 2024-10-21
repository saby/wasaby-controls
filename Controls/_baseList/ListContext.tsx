import * as React from 'react';

import type { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';

interface IContextValues {
    actionHandlers: IItemActionsHandler;
}

export const ListContext = React.createContext<IContextValues>(null);

export default function Provider(props: IContextValues & { children: React.ReactElement }) {
    const contextValues = React.useMemo(() => {
        return {
            actionHandlers: props.actionHandlers,
        };
    }, [props.actionHandlers]);
    return <ListContext.Provider value={contextValues}>{props.children}</ListContext.Provider>;
}
