import { copyStateWithItems, IStateWithItems } from '../_abstractListAspect/common/IStateWithItems';
import { IAction, TItemActionsMap, TItemActionVisibilityCallback } from './common/types';

export interface IItemActionsState extends IStateWithItems {
    itemActions: IAction[];
    itemActionsProperty: string;
    itemActionVisibilityCallback: TItemActionVisibilityCallback;
    itemActionsMap: TItemActionsMap;
}

export function copyItemActionsState({
    itemActions,
    itemActionsProperty,
    itemActionVisibilityCallback,
    itemActionsMap,
    ...state
}: IItemActionsState): IItemActionsState {
    return {
        ...copyStateWithItems(state),
        itemActions,
        itemActionsProperty,
        itemActionVisibilityCallback,
        itemActionsMap,
    };
}
