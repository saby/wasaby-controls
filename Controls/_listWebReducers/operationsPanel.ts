/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isLoaded, loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { SnapshotName } from 'Controls-DataEnv/list';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

export const operationsPanel: TListMiddleware =
    ({ getState, setState, dispatch, snapshots }) =>
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
                await dispatch(ListWebActions.selection.setSelectionVisibility('visible'));

                // Попытка показать маркер, если его нет, а он нужен.
                // По стандарту платформы, открытие ПМО должно показывать маркер, если
                // он ИЗНАЧАЛЬНО не скрыт.
                // Если маркер виден, но при открытии ПМО прикладной разработчик
                // пытается его скрыть - игнорируем.
                await dispatch(ListWebActions.marker.activateMarker());

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
                await dispatch(ListWebActions.selection.resetSelection());
                await dispatch(ListWebActions.operationsPanel.resetSelectionViewMode());

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
                        // @ts-ignore
                        getState().markedKey,
                        snapshots.get(SnapshotName.BeforeShowOnlySelected)
                    );

                    await dispatch(
                        ListWebActions.operationsPanel.setListCommandsSelection(
                            listCommandsSelection
                        )
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

                if (getState().isLatestInteractorVersion) {
                    if (selectionViewMode === 'selected') {
                        const {
                            items,
                            selectedKeys,
                            excludedKeys,
                            parentProperty,
                            nodeProperty,
                            root,
                            sourceController,
                        } = getState();
                        const { ShowOnlySelected } = await loadAsync<
                            typeof import('Controls/listCommands')
                        >(LibPaths.ListCommands);
                        await new ShowOnlySelected({
                            items,
                            selectedItems: selectedKeys.map((key) => items.getRecordById(key)),
                            parentProperty,
                            nodeProperty,
                            root,
                            selection: {
                                selected: selectedKeys,
                                excluded: excludedKeys,
                            },
                            sourceController,
                        }).execute();
                        await dispatch(ListWebActions.selection.resetSelection());
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
                if (getState().selectionViewMode === 'hidden') {
                    break;
                }

                const removedKeys = action.payload.keys;
                const isSelectedItemRemoved = snapshots
                    .get(SnapshotName.BeforeShowOnlySelected)
                    ?.selected.find((key) => removedKeys.includes(key));

                if (!isSelectedItemRemoved) {
                    break;
                }

                if (!getState().items.getCount() && getState().selectionViewMode !== 'hidden') {
                    await dispatch(ListWebActions.operationsPanel.resetSelectionViewMode());
                } else if (getState().showSelectedCount) {
                    setState({
                        showSelectedCount: getState().showSelectedCount - removedKeys.length,
                    });
                }
                break;
            }
        }

        next(action);
    };
