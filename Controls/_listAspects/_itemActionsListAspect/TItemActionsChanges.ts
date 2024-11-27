import { IAction, TItemActionsMap, TItemActionVisibilityCallback } from './common/types';

export const ItemActionsChangeName = 'ITEM_ACTIONS_CHANGE';
export type TItemActionsChangeName = typeof ItemActionsChangeName;

export interface IItemActionsChange {
    name: TItemActionsChangeName;
    args: {
        itemActionsMap: TItemActionsMap;
        itemActions: IAction[];
        itemActionsProperty: string;
        itemActionVisibilityCallback: TItemActionVisibilityCallback;
    };
}

export type TItemActionsChanges = IItemActionsChange;
