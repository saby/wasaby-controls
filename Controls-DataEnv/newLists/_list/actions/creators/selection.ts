/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls/interface';
import { selection } from '../types';

export const setSelection = AbstractListActionCreators.selection.setSelection;
export const resetSelection = AbstractListActionCreators.selection.resetSelection;

export const setSelectionVisibility = (
    visibility: IListState['multiSelectVisibility']
): selection.TSetSelectionVisibilityAction => ({
    type: 'setSelectionVisibility',
    payload: {
        visibility,
    },
});

export const updateSelection = (
    prevState: IListState,
    selectedKeys: TKey[],
    excludedKeys: TKey[]
): selection.TUpdateSelectionAction => ({
    type: 'updateSelection',
    payload: {
        prevState,
        selectedKeys,
        excludedKeys,
    },
});

export type TSelectionActions =
    | selection.TSetSelectionAction
    | selection.TResetSelectionAction
    | selection.TSetSelectionVisibilityAction
    | selection.TUpdateSelectionAction;
