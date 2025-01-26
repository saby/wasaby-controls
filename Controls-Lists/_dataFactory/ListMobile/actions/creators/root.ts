/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Record as RecordType } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import { ActionsNames } from '../ActionsNames';
import { root } from '../types';

export const moveIntoRoot = (rootKey: TKey): root.TMoveIntoRootAction => ({
    type: ActionsNames.NEXT_DISPLAY,
    payload: {
        root: rootKey,
    },
});

export const moveFromRoot = (rootKey: TKey): root.TMoveFromRootAction => ({
    type: ActionsNames.PREV_DISPLAY,
    payload: {
        root: rootKey,
    },
});

export const moveToRootByItem = (rootItem: RecordType | null): root.TMoveToRootByItemAction => ({
    type: ActionsNames.MOVE,
    payload: {
        root: rootItem,
    },
});
