/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddlewareCreator } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';

export const selection: TListMiddlewareCreator =
    ({ dispatch, getState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setSelectionVisibility': {
                await dispatch(
                    ListWebActions.state.setState({
                        multiSelectVisibility: action.payload.visibility,
                    })
                );

                // Показ чекбоксов всегда приводит к открытию ПМО, даже если вызов был из ПМО.
                // В случае просадок по производительности можно добавить параметр в экшен.
                if (action.payload.visibility === 'visible') {
                    await dispatch(ListWebActions.operationsPanel.openOperationsPanel());
                }
                break;
            }
            case 'resetSelection': {
                await dispatch(ListWebActions.selection.setSelection([], []));
                await dispatch(
                    ListWebActions.state.setState({
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
                    ListWebActions.state.setState({
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
                    await dispatch(ListWebActions.operationsPanel.openOperationsPanel());
                }

                await dispatch(ListWebActions.operationsPanel.updateOperationsSelection());
                await dispatch(ListWebActions.source.updateSavedState());

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

                await dispatch(
                    ListWebActions.selection.setSelection(nextSelectedKeys, nextExcludedKeys)
                );

                break;
            }
        }

        next(action);
    };
