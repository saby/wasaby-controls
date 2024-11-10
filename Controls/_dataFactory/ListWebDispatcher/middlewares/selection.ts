import { TListMiddlewareCreator } from '../types/TListMiddleware';
import * as stateActions from '../actions/state';
import * as operationsPanelActions from '../actions/operationsPanel';
import * as selectionActions from '../actions/selection';
import * as sourceActions from '../actions/source';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { isEqual } from 'Types/object';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'selection',
    actionsNames: ['setSelectionVisibility', 'setSelection', 'resetSelection', 'updateSelection'],
});

export const selection: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch } = withLogger(ctx, 'selection');

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'setSelectionVisibility': {
                await dispatch(
                    stateActions.setState({
                        multiSelectVisibility: action.payload.visibility,
                    })
                );

                // Показ чекбоксов всегда приводит к открытию ПМО, даже если вызов был из ПМО.
                // В случае просадок по производительности можно добавить параметр в экшен.
                if (action.payload.visibility === 'visible') {
                    await dispatch(operationsPanelActions.openOperationsPanel());
                }
                break;
            }
            case 'resetSelection': {
                await dispatch(selectionActions.setSelection([], []));
                await dispatch(
                    stateActions.setState({
                        selectionModel: new Map(),
                    })
                );
                break;
            }
            // TODO: Разбить на setSelectionObject и setSelectionMap для сходимости
            //  с тонким интерактором
            case 'setSelection': {
                const { selectedKeys, excludedKeys } = action.payload;

                //#region Обновление отметки записей
                await dispatch(
                    stateActions.setState({
                        selectedKeys,
                        excludedKeys,
                    })
                );
                //#endregion

                //#region Сайд-эффекты

                //  TODO: на useOperationsPanel проверять тут или в OperationsPanel?
                //   Чтоб понять, нужно ответить на вопрос, можно ли открывать панель без listActions.
                // Если заданы ListActions, значит точно используем OperationsPanel.
                // Иначе не меняем видимость OperationsPanel и, соответственно, видимость маркера и мультивыбора.
                const useOperationsPanel = getState().listActions;
                if (useOperationsPanel && selectedKeys.length) {
                    await dispatch(operationsPanelActions.openOperationsPanel());
                }

                await dispatch(operationsPanelActions.updateOperationsSelection());
                await dispatch(sourceActions.updateSavedState());

                //#endregion Сайд-эффекты

                break;
            }
            case 'updateSelection': {
                const {
                    prevState,
                    selectedKeys: nextSelectedKeys,
                    excludedKeys: nextExcludedKeys,
                } = action.payload;

                if (
                    isEqual(prevState.selectedKeys, nextSelectedKeys) &&
                    isEqual(prevState.excludedKeys, nextExcludedKeys)
                ) {
                    break;
                }

                await dispatch(selectionActions.setSelection(nextSelectedKeys, nextExcludedKeys));

                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};
