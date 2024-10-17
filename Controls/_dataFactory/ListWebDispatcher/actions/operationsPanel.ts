/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import { ISelectionViewMode } from 'Controls/interface';

export type TOpenOperationsPanelAction = TAbstractAction<'openOperationsPanel', {}>;

export const openOperationsPanel = (): TOpenOperationsPanelAction => ({
    type: 'openOperationsPanel',
    payload: {},
});

export type TCloseOperationsPanelAction = TAbstractAction<'closeOperationsPanel', {}>;

export const closeOperationsPanel = (): TCloseOperationsPanelAction => ({
    type: 'closeOperationsPanel',
    payload: {},
});

export type TSetSelectionViewModeAction = TAbstractAction<
    'setSelectionViewMode',
    {
        viewMode: ISelectionViewMode;
    }
>;

export const setSelectionViewMode = (
    viewMode: ISelectionViewMode
): TSetSelectionViewModeAction => ({
    type: 'setSelectionViewMode',
    payload: { viewMode },
});

export type TResetSelectionViewModeAction = TAbstractAction<'resetSelectionViewMode', {}>;

export const resetSelectionViewMode = (): TResetSelectionViewModeAction => ({
    type: 'resetSelectionViewMode',
    payload: {},
});

export type TUpdateOperationsSelectionAction = TAbstractAction<'updateOperationsSelection', {}>;

export const updateOperationsSelection = (): TUpdateOperationsSelectionAction => ({
    type: 'updateOperationsSelection',
    payload: {},
});

export type TUpdateOperationsPanelAction = TAbstractAction<
    'updateOperationsPanel',
    {
        prevState: IListState;
        isVisible: boolean | undefined;
        selectionVisibility: IListState['multiSelectVisibility'];
    }
>;

export const updateOperationsPanel = (
    prevState: IListState,
    isVisible: boolean | undefined,
    selectionVisibility: IListState['multiSelectVisibility']
): TUpdateOperationsPanelAction => ({
    type: 'updateOperationsPanel',
    payload: {
        prevState,
        isVisible,
        selectionVisibility,
    },
});

export type TOperationsPanelActions =
    | TOpenOperationsPanelAction
    | TCloseOperationsPanelAction
    | TSetSelectionViewModeAction
    | TResetSelectionViewModeAction
    | TUpdateOperationsSelectionAction
    | TUpdateOperationsPanelAction;
