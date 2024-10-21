/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { hooks } from 'Controls/listsCommonLogic';
import { DataContext, useStrictSlice } from 'Controls-DataEnv/context';

import type {
    AbstractListSlice,
    IAbstractListAPI,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';
import type { IAbstractComponentEventHandlers } from '../interface/IAbstractComponentEventHandlers';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';

export type TUseViewCommandHandlersProps = {
    changeRootByItemClick?: boolean;
    storeId: string;
};

export function useViewCommandHandlers<TViewCommandHandlers extends IAbstractViewCommandHandlers>(
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState,
    viewHandlers: IAbstractComponentEventHandlers,
    { storeId, changeRootByItemClick }: TUseViewCommandHandlersProps
): TViewCommandHandlers {
    // Контекст, необходимые для обработчиков событий ItemActions
    const context = React.useContext(DataContext);
    // Контекст, необходимые для обработчиков событий ItemActions
    const slice = useStrictSlice<AbstractListSlice>(storeId);

    const viewModelAPIRef = React.useRef<IAbstractListAPI>(viewModelAPI);
    const viewModelStateRef = React.useRef<IAbstractListState>(viewModelState);
    const viewHandlersRef = React.useRef<IAbstractComponentEventHandlers>(viewHandlers);
    const propsRef = React.useRef<
        TUseViewCommandHandlersProps & hooks.TUseRenderHandlersPropsCompatible
    >({
        storeId,
        changeRootByItemClick,
        sliceForOldItemActions: slice,
        contextForOldItemActions: context,
    });

    React.useEffect(() => {
        viewModelAPIRef.current = viewModelAPI;
        viewModelStateRef.current = viewModelState;
        viewHandlersRef.current = viewHandlers;
        propsRef.current = {
            storeId,
            changeRootByItemClick,
            sliceForOldItemActions: slice,
            contextForOldItemActions: context,
        };
    }, [
        changeRootByItemClick,
        context,
        slice,
        storeId,
        viewHandlers,
        viewModelAPI,
        viewModelState,
    ]);

    return hooks.getRenderHandlers<TViewCommandHandlers>(
        viewModelAPIRef,
        viewModelStateRef,
        viewHandlersRef,
        propsRef
    );
}
