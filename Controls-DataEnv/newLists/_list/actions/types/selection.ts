/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls/interface';

export type TResetSelectionAction = TAbstractListActions.selection.TResetSelectionAction;
export type TSetSelectionAction = TAbstractListActions.selection.TSetSelectionAction;

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
