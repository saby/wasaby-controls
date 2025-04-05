/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware, ListWebInitializers } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import {
    NewFlatSelectionStrategy as FlatSelectionStrategy,
    NewHierarchySelectionStrategy as HierarchySelectionStrategy,
} from 'Controls/multiselection';

import type { IListState } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';
import { helpers } from 'Controls/listsCommonLogic';
import { IHierarchySelectionState } from 'Controls/multiselection';
import { Collection as ICollection, CollectionItem } from 'Controls/display';
import { TreeItem } from 'Controls/tree';
import { Initializer } from 'Controls-DataEnv/abstractList';

const { getCount } = ListWebInitializers.operationsPanel;

export const selection: TListMiddleware = ({ dispatch, getState, setState, getCollection }) => {
    const getStateWithCollection = (
        state: IListState = getState()
    ): IHierarchySelectionState & IListState => ({
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

                const selectionModel = new Map();

                [...getState().selectionModel.keys()].forEach((key) => {
                    selectionModel.set(key, false);
                });

                await dispatch(ListWebActions.selection.setSelectionModel(selectionModel));
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

                //# region Обновление отметки записей
                setState({
                    selectedKeys,
                    excludedKeys,
                });
                //# endregion

                //# region Сайд-эффекты

                //  TODO: на listActions проверять тут или в OperationsPanel?
                //   Чтоб понять, нужно ответить на вопрос, можно ли открывать панель без listActions.
                // Если заданы ListActions, значит точно используем OperationsPanel.
                // Иначе не меняем видимость OperationsPanel и, соответственно, видимость маркера и мультивыбора.
                if (Initializer.operationsPanel.needOpenOperationsPanel(getState())) {
                    await dispatch(ListWebActions.operationsPanel.openOperationsPanel());
                }

                await dispatch(ListWebActions.operationsPanel.updateOperationsSelection());
                await dispatch(ListWebActions.source.updateSavedState());

                await dispatch(
                    ListWebActions.selection.setSelectionModel(
                        getNewModelByStates(
                            getStateWithCollection(prevState),
                            getStateWithCollection(),
                            Initializer.selection.getSelectionStrategy(getState())
                        )
                    )
                );

                await dispatch(ListWebActions.selection.updateCounter());

                //# endregion Сайд-эффекты

                break;
            }
            case 'setSelectionModel': {
                const { selectionModel } = action.payload;
                //# region Обновление состояния
                if (isEqual(getState().selectionModel, selectionModel)) {
                    break;
                }
                setState({
                    selectionModel,
                });
                //# endregion
                break;
            }
            case 'setSelectionCount': {
                const { count: curCount, isAllSelected: curIsAllSelected } = getState();
                const { count, isAllSelected } = action.payload;
                if (count !== curCount || isAllSelected !== curIsAllSelected) {
                    setState(action.payload);
                }
                break;
            }
            case 'select': {
                const { key, direction, isRangeSelection } = action.payload;
                const status = getState().selectionModel.get(key);
                const collection = getCollection();

                if (!collection) {
                    break;
                }

                //# region Обновление состояния
                let newSelection;
                if (isRangeSelection) {
                    const lastSelectedKey = getState().lastCheckedKey;
                    if (!lastSelectedKey) {
                        newSelection = Initializer.selection
                            .getSelectionStrategy(getState())
                            .select(getStateWithCollection(), key);
                        setState({ lastCheckedKey: key });
                    } else {
                        newSelection = Initializer.selection
                            .getSelectionStrategy(getState())
                            .selectRange(
                                getStateWithCollection(),
                                getRangeSelectionItems(
                                    collection,
                                    key,
                                    lastSelectedKey
                                ) as CollectionItem[] & TreeItem[]
                            );
                    }
                } else if (status || status === null) {
                    newSelection = Initializer.selection
                        .getSelectionStrategy(getState())
                        .unselect(getStateWithCollection(), key);
                    setState({ lastCheckedKey: key });
                } else {
                    newSelection = Initializer.selection
                        .getSelectionStrategy(getState())
                        .select(getStateWithCollection(), key);
                    setState({ lastCheckedKey: key });
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
            case 'selectAll': {
                if (getState().isLatestInteractorVersion) {
                    const newSelection = Initializer.selection
                        .getSelectionStrategy(getState())
                        .selectAll({
                            ...getStateWithCollection(),
                            isMassSelectMode: getState().selectionViewMode !== 'selected',
                        });
                    const { selectedKeys, excludedKeys, selectionModel } = newSelection;
                    await dispatch(
                        ListWebActions.selection.setSelection(selectedKeys, excludedKeys)
                    );
                    await dispatch(ListWebActions.selection.setSelectionModel(selectionModel));
                } else {
                    setState({
                        command: 'selectAll',
                    });
                }
                break;
            }
            case 'invertSelection': {
                if (getState().isLatestInteractorVersion) {
                    const newSelection = Initializer.selection
                        .getSelectionStrategy(getState())
                        .toggleAll(
                            {
                                ...getStateWithCollection(),
                                isMassSelectMode: getState().selectionViewMode !== 'selected',
                            },
                            {
                                up: getState().sourceController.hasMoreData('up'),
                                down: getState().sourceController.hasMoreData('down'),
                            }
                        );
                    const { selectedKeys, excludedKeys, selectionModel } = newSelection;
                    await dispatch(
                        ListWebActions.selection.setSelection(selectedKeys, excludedKeys)
                    );
                    await dispatch(ListWebActions.selection.setSelectionModel(selectionModel));
                } else {
                    setState({
                        command: 'toggleAll',
                    });
                }
                break;
            }
            case 'updateCounter': {
                const state = getStateWithCollection();

                // Список с BaseControl будет считать счетчик до тех пор,
                // пока в нем есть хоть какое то множественное выделени.
                // Проблема - BaseControl считает выделение и отстреливает событиями
                // selected, excluded, еще что то changed.
                // События отстреливают по порядку и мы вызываем синхронно методы слайса.
                // При получении первого события selected мы еще ничего не знаем про excluded и count,
                // поэтому отрабатываем по неверным данным.
                if (!state.collection || !state.isLatestInteractorVersion) {
                    break;
                }

                setState({
                    count: getCount(state),
                    isAllSelected: Initializer.selection
                        .getSelectionStrategy(getState())
                        .isAllSelected(
                            state,
                            state.collection.hasMoreData(),
                            state.collection.getCount(),
                            0
                        ),
                });
                break;
            }
            case 'onItemsRemoved':
            case 'onItemsAdded':
            case 'onItemsReset': {
                await dispatch(
                    ListWebActions.selection.setSelectionModel(
                        Initializer.selection.createSelectionModel(getStateWithCollection())
                    )
                );
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
    if (!prevState.collection || !nextState.collection || nextState.collection.isDestroyed()) {
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
                  Initializer.selection.createSelectionModel(prevState),
                  Initializer.selection.createSelectionModel(nextState)
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

const getRangeSelectionItems = (
    collection: ICollection,
    key: CrudEntityKey,
    lastSelectedKey: CrudEntityKey
): CollectionItem[] => {
    const firstIndex = collection.getIndexByKey(key);
    const secondIndex = collection.getIndexByKey(lastSelectedKey);
    const sliceStart = secondIndex > firstIndex ? firstIndex : secondIndex;
    const sliceEnd = sliceStart === secondIndex ? firstIndex + 1 : secondIndex + 1;
    const items = [];
    for (let i = sliceStart; i < sliceEnd; i++) {
        // нельзя использовать ::getItems, т.к. он не учитывает фильтрацию, а ::getIndexByKey учитывает
        items.push(collection.at(i));
    }

    return items;
};
