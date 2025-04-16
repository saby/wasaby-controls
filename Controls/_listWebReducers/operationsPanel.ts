/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddleware, IListState } from 'Controls-DataEnv/list';
import type { Collection as ICollection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';

import { SnapshotName, ListActionCreators } from 'Controls-DataEnv/list';
import { Initializer } from 'Controls-DataEnv/abstractList';
import { isLoaded, loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

const {
    selection: selectionActions,
    marker: markerActions,
    operationsPanel: operationsPanelActions,
} = ListActionCreators;

export const operationsPanel: TListMiddleware =
    ({ getState, setState, getCollection, dispatch, snapshots }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'openOperationsPanel': {
                const state = getState();

                if (state.operationsPanelVisible) {
                    break;
                }

                snapshots.set(SnapshotName.BeforeOpenOperationsPanel, {
                    multiSelectVisibility: state.multiSelectVisibility,
                });

                setState({
                    operationsPanelVisible: true,
                });
                getState().operationsController?.openOperationsPanel();

                // По стандарту платформы, открытие ПМО всегда должно показывать чекбоксы.
                await dispatch(selectionActions.setSelectionVisibility('visible'));

                // Попытка показать маркер, если его нет, а он нужен.
                // По стандарту платформы, открытие ПМО должно показывать маркер, если
                // он ИЗНАЧАЛЬНО не скрыт.
                // Если маркер виден, но при открытии ПМО прикладной разработчик
                // пытается его скрыть - игнорируем.
                await dispatch(markerActions.activateMarker());

                break;
            }

            case 'closeOperationsPanel': {
                if (!getState().operationsPanelVisible) {
                    break;
                }

                //# region Обновление ПМО
                setState({
                    operationsPanelVisible: false,
                });

                const { operationsController } = getState();
                if (operationsController) {
                    operationsController.closeOperationsPanel();
                    if (operationsController.getOperationsPanelVisible()) {
                        operationsController.setOperationsPanelVisible(false);
                    }
                }

                //# endregion

                //# region Сайд-эффекты
                await dispatch(selectionActions.resetSelection());
                await dispatch(operationsPanelActions.resetSelectionViewMode());

                // TODO: Разобрать на экшены, поняв что это за поведение.
                setState({
                    markerVisibility: undefined,
                    multiSelectVisibility:
                        snapshots.get(SnapshotName.BeforeOpenOperationsPanel)
                            ?.multiSelectVisibility || 'hidden',
                    ...(getState().selectionViewMode === 'selected' ? { command: 'all' } : {}),
                });

                snapshots.delete(SnapshotName.BeforeOpenOperationsPanel);
                //# endregion Сайд-эффекты

                break;
            }

            case 'updateOperationsSelection': {
                // TODO: Вынести в экшен обновления и вызывать из смены выделения.
                const controller = getState().operationsController;
                if (controller) {
                    controller.setSelectedKeys(getState().selectedKeys);
                    controller.setExcludedKeys(getState().excludedKeys);
                }

                if (isLoaded('Controls/operations')) {
                    const listCommandsSelection = loadSync<typeof import('Controls/operations')>(
                        'Controls/operations'
                    ).getListCommandsSelection(
                        {
                            selectedKeys: getState().selectedKeys,
                            excludedKeys: getState().excludedKeys,
                        },
                        isMarkedKeySelectable(getState(), getCollection())
                            ? getState().markedKey
                            : undefined,
                        snapshots.get(SnapshotName.BeforeShowOnlySelected)
                    );

                    await dispatch(
                        operationsPanelActions.setListCommandsSelection(listCommandsSelection)
                    );
                }

                break;
            }

            case 'setListCommandsSelection': {
                const { listCommandsSelection } = action.payload;
                setState({
                    listCommandsSelection,
                });
                break;
            }

            case 'setSelectionViewMode': {
                const { selectionViewMode } = action.payload;
                const { items } = getState();

                if (getState().isLatestInteractorVersion && items) {
                    if (selectionViewMode === 'selected') {
                        const {
                            selectedKeys,
                            excludedKeys,
                            selectionModel,
                            parentProperty,
                            nodeProperty,
                            root,
                            sourceController,
                            selectDescendants,
                        } = getState();

                        const { ShowOnlySelected } = await loadAsync<
                            typeof import('Controls/listCommands')
                        >(LibPaths.ListCommands);

                        const selectedItems = [...selectionModel.entries()].reduce(
                            (acc, [key, status]) => {
                                if (status) {
                                    acc.push(items.getRecordById(key));
                                }
                                return acc;
                            },
                            [] as Model[]
                        );

                        await new ShowOnlySelected({
                            items,
                            selectedItems,
                            parentProperty,
                            nodeProperty,
                            root,
                            selection: {
                                selected: selectedKeys,
                                excluded: excludedKeys,
                            },
                            selectDescendants,
                            sourceController,
                        }).execute();
                        await dispatch(selectionActions.resetSelection());
                        sourceController?.resetNavigation(root);
                    }
                }

                setState({
                    selectionViewMode,
                });
                break;
            }

            case 'resetSelectionViewMode': {
                setState({
                    selectionViewMode: 'hidden',
                    showSelectedCount: null,
                });
                break;
            }

            case 'onItemsRemoved': {
                const { selectionViewMode, items, showSelectedCount } = getState();

                if (selectionViewMode === 'hidden') {
                    break;
                }

                const removedKeys = action.payload.keys;
                const isSelectedItemRemoved = snapshots
                    .get(SnapshotName.BeforeShowOnlySelected)
                    ?.selected.find((key) => removedKeys.includes(key as CrudEntityKey));

                if (!isSelectedItemRemoved) {
                    break;
                }

                if (!items?.getCount()) {
                    await dispatch(operationsPanelActions.resetSelectionViewMode());
                } else if (showSelectedCount) {
                    setState({
                        showSelectedCount: showSelectedCount - removedKeys.length,
                    });
                }
                break;
            }
        }

        next(action);
    };

function isMarkedKeySelectable(state: IListState, collection?: ICollection): boolean {
    if (!collection || typeof state.markedKey === 'undefined' || state.markedKey === null) {
        return false;
    }

    return Initializer.selection
        .getSelectionStrategy(state)
        .isKeySelectable({ ...state, collection }, state.markedKey);
}
