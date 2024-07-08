import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import * as stateActions from '../actions/state';
import * as operationsPanelActions from '../actions/operationsPanel';
import * as selectionActions from '../actions/selection';
import * as markerActions from '../actions/marker';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'operationsPanel',
    actionsNames: ['openOperationsPanel', 'closeOperationsPanel', 'updateOperationsPanel'],
});

export const operationsPanel: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch } = withLogger(ctx, 'operationsPanel');

    let previousMultiSelectVisibility: IListState['multiSelectVisibility'];

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'openOperationsPanel': {
                const state = getState();

                state.operationsController?.setSelectedKeys(state.selectedKeys);

                if (state.operationsPanelVisible) {
                    break;
                }

                previousMultiSelectVisibility = state.multiSelectVisibility;

                await dispatch(
                    stateActions.setState({
                        operationsPanelVisible: true,
                    })
                );

                await dispatch(selectionActions.setSelectionVisibility('visible'));
                await dispatch(markerActions.setMarkerVisibility('visible'));

                break;
            }

            case 'closeOperationsPanel': {
                if (!getState().operationsPanelVisible) {
                    break;
                }

                //#region Обновление отметки записей
                await dispatch(
                    stateActions.setState({
                        operationsPanelVisible: false,
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                await dispatch(selectionActions.resetSelection());
                await dispatch(selectionActions.resetSelectionViewMode());

                // TODO: Разобрать на экшены, поняв что это за поведение.
                await dispatch(
                    stateActions.setState({
                        markerVisibility: undefined,
                        multiSelectVisibility: previousMultiSelectVisibility || 'hidden',
                        ...(getState().selectionViewMode === 'selected' ? { command: 'all' } : {}),
                    })
                );

                previousMultiSelectVisibility = undefined;
                //#endregion Сайд-эффекты

                break;
            }

            case 'updateOperationsPanel': {
                const { prevState, isVisible, selectionVisibility } = action.payload;

                const operationsPanelVisibleChanged =
                    prevState.operationsPanelVisible !== isVisible;

                // TODO: Это не должно быть тут. Должны быть отдельные экшены, show и hide в selection.
                if (prevState.multiSelectVisibility !== selectionVisibility) {
                    previousMultiSelectVisibility = selectionVisibility;
                }

                if (!operationsPanelVisibleChanged) {
                    break;
                }

                if (isVisible) {
                    await dispatch(operationsPanelActions.openOperationsPanel());
                } else {
                    await dispatch(operationsPanelActions.closeOperationsPanel());
                }

                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};
