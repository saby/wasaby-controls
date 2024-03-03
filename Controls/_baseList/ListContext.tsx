import * as React from 'react';

import { Collection } from 'Controls/display';
import { IItemActionsHandler } from 'Controls/_baseList/Render/ItemActions';

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
