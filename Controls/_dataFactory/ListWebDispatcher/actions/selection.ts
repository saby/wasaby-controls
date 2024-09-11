import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from '../../interface/IListState';
import { TKey } from 'Controls-DataEnv/interface';

export type TSetSelectionVisibilityAction = TAbstractAction<
    'setSelectionVisibility',
    {
        visibility: IListState['multiSelectVisibility'];
    }
>;

export const setSelectionVisibility = (
    visibility: IListState['multiSelectVisibility']
): TSetSelectionVisibilityAction => ({
    type: 'setSelectionVisibility',
    payload: {
        visibility,
    },
});

export type TSetSelectionAction = TAbstractAction<
    'setSelection',
    {
        selectedKeys: TKey[];
        excludedKeys: TKey[];
    }
>;

export const setSelection = (selectedKeys: TKey[], excludedKeys: TKey[]): TSetSelectionAction => ({
    type: 'setSelection',
    payload: {
        selectedKeys,
        excludedKeys,
    },
});

export type TResetSelectionAction = TAbstractAction<'resetSelection', {}>;

export const resetSelection = (): TResetSelectionAction => ({
    type: 'resetSelection',
    payload: {},
});

export type TResetSelectionViewModeAction = TAbstractAction<'resetSelectionViewMode', {}>;

export const resetSelectionViewMode = (): TResetSelectionViewModeAction => ({
    type: 'resetSelectionViewMode',
    payload: {},
});

export type TUpdateSelectionAction = TAbstractAction<
    'updateSelection',
    {
        prevState: IListState;
        selectedKeys: TKey[];
        excludedKeys: TKey[];
    }
>;

export const updateSelection = (
    prevState: IListState,
    selectedKeys: TKey[],
    excludedKeys: TKey[]
): TUpdateSelectionAction => ({
    type: 'updateSelection',
    payload: {
        prevState,
        selectedKeys,
        excludedKeys,
    },
});

export type TSelectionActions =
    | TSetSelectionVisibilityAction
    | TUpdateSelectionAction
    | TSetSelectionAction
    | TResetSelectionAction
    | TResetSelectionViewModeAction;
