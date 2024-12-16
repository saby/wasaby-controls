import * as React from 'react';
import type { IItemActionsHandler, INavigationButtonProps } from 'Controls/baseList';

interface IContextValues {
    actionHandlers?: IItemActionsHandler;
    navigationButtonProps?: INavigationButtonProps;
    navigationButtonState?: boolean;
}

export const _ctx = React.createContext<IContextValues>(null);
_ctx.displayName = 'Controls/listsCommonLogic:ListContext';

export default function Provider(props: IContextValues & { children: React.ReactElement }) {
    const contextValues = React.useMemo(() => {
        return {
            actionHandlers: props.actionHandlers,
            navigationButtonProps: props.navigationButtonProps,
            navigationButtonState: props.navigationButtonState,
        };
    }, [props.actionHandlers, props.navigationButtonProps, props.navigationButtonState]);
    return <_ctx.Provider value={contextValues}>{props.children}</_ctx.Provider>;
}

export function useListContext(): IContextValues {
    return React.useContext(_ctx);
}
