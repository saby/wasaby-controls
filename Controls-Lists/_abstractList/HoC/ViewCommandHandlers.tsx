/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import type { IAbstractComponentEventHandlers } from '../interface/IAbstractComponentEventHandlers';

export type TUseViewCommandHandlersProps = {
    changeRootByItemClick?: boolean;
    storeId: string;
};

export type TUseViewCommandHandlersHook<TViewCommandHandlers extends IAbstractViewCommandHandlers> =
    (
        viewModelAPI: IAbstractListAPI,
        viewModelState: IAbstractListState,
        componentEventHandlers: IAbstractComponentEventHandlers,
        props: TUseViewCommandHandlersProps
    ) => TViewCommandHandlers;

export function withViewCommandHandlers<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TOuter,
>(
    Component: React.ComponentType<
        TOuter & {
            viewModelAPI: IAbstractListAPI;
            viewModelState: IAbstractListState;
        } & TUseViewCommandHandlersProps &
            IAbstractComponentEventHandlers &
            TViewCommandHandlers
    >,
    useViewCommandHandlers: TUseViewCommandHandlersHook<TViewCommandHandlers>
): React.ComponentType<
    TOuter & {
        viewModelAPI: IAbstractListAPI;
        viewModelState: IAbstractListState;
    } & TUseViewCommandHandlersProps &
        IAbstractComponentEventHandlers
> {
    function Composed(
        props: TOuter & {
            viewModelAPI: IAbstractListAPI;
            viewModelState: IAbstractListState;
        } & TUseViewCommandHandlersProps &
            IAbstractComponentEventHandlers
    ) {
        const handlers = useViewCommandHandlers(
            props.viewModelAPI,
            props.viewModelState,
            props,
            props
        );
        return <Component {...props} {...handlers} />;
    }

    Composed.displayName = `withViewCommandHandlers(${Component.displayName || Component.name})`;

    return Composed;
}
