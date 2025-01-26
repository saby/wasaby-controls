/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import { ListWebActions } from 'Controls/dataFactory';
import { IAbstractListState } from 'Controls-DataEnv/abstractList';

export const applyStateMiddleware: TListMobileMiddleware = ({ setState, getState, dispatch }) => {
    let lastVisibility: IAbstractListState['multiSelectVisibility'] | undefined;

    return (next) => async (action) => {
        switch (action.type) {
            case 'setMarkedKey': {
                setState({
                    markedKey: action.payload.key,
                });
                break;
            }
            case 'setRoot': {
                setState({
                    root: action.payload.root,
                });
                break;
            }
            case 'setExpansionModel': {
                const { expansionModel } = action.payload;
                setState({ expansionModel });
                break;
            }
            case 'setSelectionModel': {
                const { selectionModel } = action.payload;
                setState({ selectionModel });
                break;
            }
            case 'setBreadCrumbs': {
                const { breadCrumbsItems, backButtonCaption, backButtonItem } = action.payload;
                setState({
                    breadCrumbsItems,
                    backButtonCaption,
                    backButtonItem,
                });
                break;
            }
            case 'openOperationsPanel': {
                const state = getState();

                if (state.operationsPanelVisible) {
                    break;
                }

                lastVisibility = getState().multiSelectVisibility;

                setState({
                    operationsPanelVisible: true,
                    multiSelectVisibility: 'visible',
                });
                getState().operationsController?.openOperationsPanel();

                break;
            }

            case 'closeOperationsPanel': {
                if (!getState().operationsPanelVisible) {
                    break;
                }

                setState({
                    operationsPanelVisible: false,
                    multiSelectVisibility: lastVisibility,
                });

                lastVisibility = undefined;

                const { operationsController } = getState();
                if (operationsController) {
                    operationsController.closeOperationsPanel();
                    if (operationsController.getOperationsPanelVisible()) {
                        operationsController.setOperationsPanelVisible(false);
                    }
                }

                await dispatch(ListWebActions.selection.resetSelection());
                break;
            }
        }
        next(action);
    };
};
