/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import {
    TWithInteractorCommandsProvidedProps,
    TWithInteractorProvidedProps,
    useRenderEventHandlers as useBaseRenderEventHandlers,
} from 'Controls-Lists/abstractList';
import type { IAbstractViewCommandHandlers } from 'Controls/listsCommonLogic';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { ITileRenderEventHandlers } from '../interface/IRenderEventHandlers';
import { ItemActionsContext } from 'Controls/itemActions';

export function useRenderEventHandlers<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TRenderEventHandlers extends ITileRenderEventHandlers,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
>(
    props: TWithInteractorProvidedProps<TListAPI, TListState> &
        TWithInteractorCommandsProvidedProps<TViewCommandHandlers>
): TRenderEventHandlers {
    const itemActionsCtx = React.useContext(ItemActionsContext);
    const base = useBaseRenderEventHandlers(props);
    const handlers = React.useMemo<ITileRenderEventHandlers>(
        () => ({
            ...base,
            onItemClick: (item, e) => {
                itemActionsCtx?.menuPopupOpener.close();
                props.viewCommandHandlers.onItemClick(e as unknown as React.MouseEvent, item);
            },
            onCheckBoxClick: (item, e) => {
                props.viewCommandHandlers.onCheckboxClick(
                    e as unknown as React.MouseEvent,
                    item.contents
                );
            },
            onItemMouseDown: (item, e) => {
                base.itemHandlers.onMouseDown(
                    e as unknown as React.MouseEvent<HTMLDivElement>,
                    item.contents
                );
            },
            onItemMouseMove: (item, e) => {
                base.itemHandlers.onMouseMove(
                    e as unknown as React.MouseEvent<HTMLDivElement>,
                    item.contents
                );
            },
        }),
        [base, itemActionsCtx?.menuPopupOpener, props.viewCommandHandlers]
    );

    return handlers as TRenderEventHandlers;
}
