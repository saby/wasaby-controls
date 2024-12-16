/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import { isEqual } from 'Types/object';
import {
    NewFlatSelectionStrategy as FlatSelectionStrategy,
    NewHierarchySelectionStrategy as HierarchySelectionStrategy,
} from 'Controls/multiselection';

import type { IListState } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';
import { helpers } from 'Controls/listsCommonLogic';
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
const { removeSubArray } = ArrayUtil;

export const selection: TListMiddleware = ({ dispatch, getState, setState, getCollection }) => {
    const getStrategy = () => {
        if (isStateHierarchy(getState())) {
            return new HierarchySelectionStrategy();
        }
        return new FlatSelectionStrategy();
    };
    const getStateWithCollection = (state: IListState = getState()) => ({
        ...state,
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

                if (
                    isEqual(getState().selectedKeys, selectedKeys) &&
                    isEqual(getState().excludedKeys, excludedKeys)
                ) {
                    break;
                }

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
                        getNewModelByStates(
                            getStateWithCollection(prevState),
                            getStateWithCollection(),
                            getStrategy()
                        )
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
                //# region Обновление состояния
                let newSelection;
                if (status || status === null) {
                    newSelection = getStrategy().unselect(getStateWithCollection(), key);
                } else {
                    newSelection = getStrategy().select(getStateWithCollection(), key);
                }

                const { selectedKeys, excludedKeys, selectionModel } = newSelection;
                await dispatch(ListWebActions.selection.setSelection(selectedKeys, excludedKeys));
                await dispatch(ListWebActions.selection.setSelectionModel(selectionModel));

                //# endregion Обновление состояния

                //# region Сайд-эффекты
                if (direction) {
                    await dispatch(ListWebActions.marker.markNext(direction));
                } else {
                    await dispatch(ListWebActions.marker.mark(key));
                }
                //# endregion Сайд-эффекты
                break;
            }
            case 'complexUpdateSelection': {
                const {
                    prevState: { selectedKeys: prevSelectedKeys, excludedKeys: prevExcludedKeys },
                    nextState: { selectedKeys: nextSelectedKeys, excludedKeys: nextExcludedKeys },
                } = action.payload;

                if (
                    isEqual(prevSelectedKeys, nextSelectedKeys) &&
                    isEqual(prevExcludedKeys, nextExcludedKeys)
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
            case 'onItemsRemoved': {
                const { selectedKeys, excludedKeys } = getState();

                // https://online.sbis.ru/opendoc.html?guid=7550915c-91af-4eb5-b322-747933d56728&client=3
                if (!getState().collection || !getCollection()) {
                    break;
                }

                let keys = action.payload.keys;

                // Этот ужас будет выправляться в декабре24 - январе25
                // https://online.sbis.ru/opendoc.html?guid=cce32762-ed30-413a-92f1-e77e72cd1816&client=3
                if (action.payload.actionArray) {
                    const aa =
                        action.payload.actionArray.find<TAbstractListActions.items.TAppendItemsAction>(
                            (a) => a.type === 'appendItems'
                        );
                    const pa =
                        action.payload.actionArray.find<TAbstractListActions.items.TPrependItemsAction>(
                            (a) => a.type === 'prependItems'
                        );

                    if (aa) {
                        const added = new Set(
                            [...aa.payload.items.values()].map((v) => v.getKey() as CrudEntityKey)
                        );
                        keys = keys.filter((rk) => !added.has(rk));
                    }

                    if (pa && keys.length) {
                        const added = new Set(
                            [...pa.payload.items.values()].map((v) => v.getKey() as CrudEntityKey)
                        );
                        keys = keys.filter((rk) => !added.has(rk));
                    }
                }

                await dispatch(
                    ListWebActions.selection.setSelection(
                        removeSubArray(selectedKeys.slice(), keys),
                        removeSubArray(excludedKeys.slice(), keys)
                    )
                );

                // TODO: Поддержать выделение через шифт
                // if (this._lastCheckedKey && keys.indexOf(this._lastCheckedKey) !== -1) {
                //     this._lastCheckedKey = undefined;
                // }

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
            ? helpers.getModelsDifference(prevState.selectionModel, nextState.selectionModel)
            : helpers.getModelsDifference(
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
