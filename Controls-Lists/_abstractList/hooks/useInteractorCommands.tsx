/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { useContext, useEffect, useRef } from 'react';
import { hooks } from 'Controls/listsCommonLogic';
import { DataContext, useStrictSlice } from 'Controls-DataEnv/context';

import type {
    AbstractListSlice,
    IAbstractListAPI,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';
import type { IAbstractComponentEventHandlers } from '../interface/IAbstractComponentEventHandlers';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import type { TUseInteractorCommandsHookProps } from '../HoC/withInteractorCommands';

/**
 * Хук, получающий View-команды.
 */
export function useInteractorCommands<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
>(
    viewModelAPI: TListAPI,
    viewModelState: TListState,
    // TODO: Сделать эти обработчики тоже переопределяемми.
    viewHandlers: IAbstractComponentEventHandlers,
    { storeId, changeRootByItemClick, expandByItemClick }: TUseInteractorCommandsHookProps
): TViewCommandHandlers {
    // Контекст, необходимые для обработчиков событий ItemActions
    const context = useContext(DataContext);
    // Контекст, необходимые для обработчиков событий ItemActions
    const slice = useStrictSlice<AbstractListSlice>(storeId);

    const viewModelAPIRef = useRef<TListAPI>(viewModelAPI);
    const viewModelStateRef = useRef<TListState>(viewModelState);
    const viewHandlersRef = useRef<IAbstractComponentEventHandlers>(viewHandlers);
    const propsRef = useRef<
        TUseInteractorCommandsHookProps & hooks.TUseRenderHandlersPropsCompatible
    >({
        storeId,
        changeRootByItemClick,
        expandByItemClick,
        sliceForOldItemActions: slice,
        contextForOldItemActions: context,
    });

    useEffect(() => {
        viewModelAPIRef.current = viewModelAPI;
        viewModelStateRef.current = viewModelState;
        viewHandlersRef.current = viewHandlers;
        propsRef.current = {
            storeId,
            expandByItemClick,
            changeRootByItemClick,
            sliceForOldItemActions: slice,
            contextForOldItemActions: context,
        };
    }, [
        changeRootByItemClick,
        context,
        expandByItemClick,
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

export default useInteractorCommands;
