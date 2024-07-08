import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from 'Controls/_dataFactory/interface/IListState';

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
    | TUpdateOperationsPanelAction;
