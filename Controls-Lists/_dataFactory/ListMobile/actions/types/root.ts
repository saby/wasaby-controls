import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { Record as RecordType } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import { ActionsNames } from '../ActionsNames';

export type TSetRootAction = TAbstractListActions.root.TSetRootAction;

export type TMoveIntoRootAction = TAbstractAction<
    ActionsNames.NEXT_DISPLAY,
    {
        root: TKey;
    }
>;

export type TMoveFromRootAction = TAbstractAction<
    ActionsNames.PREV_DISPLAY,
    {
        root: TKey;
    }
>;

export type TMoveToRootByItemAction = TAbstractAction<
    ActionsNames.MOVE,
    {
        root: RecordType | null;
    }
>;

export type TAnyRootAction = TMoveIntoRootAction | TMoveFromRootAction | TMoveToRootByItemAction;
