/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import type { TKey } from 'Controls-DataEnv/interface';
import type { IListState } from '../../interface/IListState';
import { selection } from 'Controls-DataEnv/newLists/_list/actions/types';

// Экспорты для публичных типов.
export type TSelectAction = TAbstractListActions.selection.TSelectAction;
export type TResetSelectionAction = TAbstractListActions.selection.TResetSelectionAction;
export type TSetSelectionAction = TAbstractListActions.selection.TSetSelectionAction;
export type TSelectAllAction = TAbstractListActions.selection.TSelectAllAction;
export type TInvertSelectionAction = TAbstractListActions.selection.TInvertSelectionAction;
// Экспорты для публичных типов.

export type TSetSelectionVisibilityAction = TAbstractAction<
    'setSelectionVisibility',
    {
        visibility: IListState['multiSelectVisibility'];
    }
>;

export type TUpdateSelectionAction = TAbstractAction<
    'updateSelection',
    {
        prevState: IListState;
        selectedKeys: TKey[];
        excludedKeys: TKey[];
    }
>;

export type TAnySelectionAction =
    | TAbstractListActions.selection.TAnySelectionAction
    | selection.TSetSelectionVisibilityAction
    | selection.TUpdateSelectionAction;
