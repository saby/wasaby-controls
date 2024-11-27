/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import { FlatSelectionStrategy, HierarchySelectionStrategy } from 'Controls/listAspects';

import type { IListState } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';
import { getModelsDifference } from 'Controls/_listAspects/_abstractListAspect/common/Utils';

export const selection: TListMiddleware = ({ dispatch, getState, setState, getCollection }) => {
    const getStrategy = () => {
        if (isStateHierarchy(getState())) {
            return new HierarchySelectionStrategy();
        }
        return new FlatSelectionStrategy();
    };
    const getStateWithCollection = () => ({
        ...getState(),
        collection: getCollection(),
    });

    return (next) => async (action) => {
        switch (action.type) {
            case 'setSelectionVisibility': {
                setState({
                    multiSelectVisibility: action.payload.visibility,
                });

                // Показ чекбоксов всегда приводит к открытию ПМО, даже если вызов был из ПМО.
                // В случае просадок по производительности можно добавить параметр в экшен.
                if (action.payload.visibility === 'visible') {
                    await dispatch(ListWebActions.operationsPanel.openOperationsPanel());
                }
                break;
            }
            case 'resetSelection': {
                await dispatch(ListWebActions.selection.setSelection([], []));
                setState({
                    selectionModel: new Map(),
                });
                break;
            }
            // TODO: Разбить на setSelectionObject и setSelectionMap для сходимости
            //  с тонким интерактором
            case 'setSelection': {
                const { selectedKeys, excludedKeys } = action.payload;
                const prevState = { ...getStateWithCollection() };

                //#region Обновление отметки записей
                setState({
                    selectedKeys,
                    excludedKeys,
                });
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

                await dispatch(
                    ListWebActions.selection.setSelectionModel(
                        getNewModelByStates(prevState, getStateWithCollection(), getStrategy())
                    )
                );

                //#endregion Сайд-эффекты

                break;
            }
            case 'setSelectionModel': {
                const { selectionModel } = action.payload;
                //#region Обновление состояния
                if (isEqual(getState().selectionModel, selectionModel)) {
                    break;
                }
                setState({
                    selectionModel,
                });
                //#endregion
                break;
            }
            case 'select': {
                const { key, direction } = action.payload;
                const status = getState().selectionModel.get(key);
                //#region Обновление состояния
                let newSelection;
                if (status || status === null) {
                    newSelection = getStrategy().unselect(getStateWithCollection(), key);
                } else {
                    newSelection = getStrategy().select(getStateWithCollection(), key);
                }

                const { selectedKeys, excludedKeys, selectionModel } = newSelection;
                await dispatch(ListWebActions.selection.setSelection(selectedKeys, excludedKeys));
                await dispatch(ListWebActions.selection.setSelectionModel(selectionModel));

                //#endregion

                //#region работа с маркером
                if (direction) {
                    await dispatch(ListWebActions.marker.markNext(direction));
                } else {
                    await dispatch(ListWebActions.marker.setMarkedKey(key));
                }
                //#endregion
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
            case 'selectAll': {
                //#region Обновление состояния
                setState({
                    command: 'selectAll',
                });
                // #endregion
                break;
            }
            case 'invertSelection': {
                //#region Обновление состояния
                setState({
                    command: 'toggleAll',
                });
                //#endregion
                break;
            }
        }

        next(action);
    };
};
const getNewModelByStates = (
    prevState: IListState,
    nextState: IListState,
    strategy: HierarchySelectionStrategy | FlatSelectionStrategy
): Map<CrudEntityKey, boolean | null> => {
    if (!prevState.collection || !nextState.collection) {
        return new Map();
    }
    const isKeysChanged =
        ('selectedKeys' in nextState && !isEqual(prevState.selectedKeys, nextState.selectedKeys)) ||
        ('excludedKeys' in nextState && !isEqual(prevState.excludedKeys, nextState.excludedKeys));
    const shouldWorkByMapChanges =
        !isKeysChanged &&
        'selectionModel' in nextState &&
        !isEqual([...prevState.selectionModel.entries()], [...nextState.selectionModel.entries()]);
    const newModel = new Map(nextState.selectionModel);
    if (isKeysChanged || shouldWorkByMapChanges) {
        // Когда-то мы будем работать от карты, но пока пересобираем ее по стейту источника данных.
        const selectionModelsDifference = shouldWorkByMapChanges
            ? getModelsDifference(prevState.selectionModel, nextState.selectionModel)
            : getModelsDifference(
                  strategy.getSelectionModel(prevState),
                  strategy.getSelectionModel(nextState)
              );

        if (
            !shouldWorkByMapChanges &&
            prevState.selectedKeys.length &&
            !nextState.selectedKeys.length
        ) {
            prevState.selectionModel.forEach((value, key) => {
                if (value !== false) {
                    selectionModelsDifference.set(key, false);
                }
            });
        }

        selectionModelsDifference.forEach((value, key) => {
            newModel.set(key, value);
        });
    }

    return newModel;
};
const isStateHierarchy = (state: IListState): boolean =>
    !!(state.nodeProperty && state.parentProperty);
