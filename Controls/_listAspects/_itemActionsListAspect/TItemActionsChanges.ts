import { TItemActionsMap } from './common/types';

export const ItemActionsChangeName = 'ITEM_ACTIONS_CHANGE';
export type TItemActionsChangeName = typeof ItemActionsChangeName;

export interface IItemActionsChange {
    name: TItemActionsChangeName;
    args: {
        itemActionsMap: TItemActionsMap;
    };
}

export type TItemActionsChanges = IItemActionsChange;
