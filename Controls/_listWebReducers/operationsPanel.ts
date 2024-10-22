/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { ListWebActions, TListMiddlewareCreator, SnapshotName } from 'Controls/dataFactory';

export const operationsPanel: TListMiddlewareCreator =
    ({ getState, dispatch, snapshots }) =>
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

                await dispatch(
                    ListWebActions.state.setState({
                        operationsPanelVisible: true,
                    })
                );

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

                //#region Обновление отметки записей
                await dispatch(
                    ListWebActions.state.setState({
                        operationsPanelVisible: false,
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                await dispatch(ListWebActions.selection.resetSelection());
                await dispatch(ListWebActions.operationsPanel.resetSelectionViewMode());

                // TODO: Разобрать на экшены, поняв что это за поведение.
                await dispatch(
                    ListWebActions.state.setState({
                        markerVisibility: undefined,
                        multiSelectVisibility:
                            snapshots.get(SnapshotName.BeforeOpenOperationsPanel)
                                ?.multiSelectVisibility || 'hidden',
                        ...(getState().selectionViewMode === 'selected' ? { command: 'all' } : {}),
                    })
                );

                snapshots.delete(SnapshotName.BeforeOpenOperationsPanel);
                //#endregion Сайд-эффекты

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
                        ListWebActions.state.setState({
                            listCommandsSelection,
                        })
                    );
                }

                break;
            }

            case 'setSelectionViewMode': {
                break;
            }

            case 'resetSelectionViewMode': {
                await dispatch(
                    ListWebActions.state.setState({
                        selectionViewMode: 'hidden',
                        showSelectedCount: null,
                    })
                );
                break;
            }

            case 'updateOperationsPanel': {
                const { prevState, isVisible, selectionVisibility } = action.payload;

                const operationsPanelVisibleChanged =
                    prevState.operationsPanelVisible !== isVisible;

                // TODO: Это не должно быть тут.
                //  Унасти в selection, которая обновит снапшот и стейт.
                if (prevState.multiSelectVisibility !== selectionVisibility) {
                    snapshots.set(SnapshotName.BeforeOpenOperationsPanel, {
                        multiSelectVisibility: selectionVisibility,
                    });
                }

                if (!operationsPanelVisibleChanged) {
                    break;
                }

                if (isVisible) {
                    await dispatch(ListWebActions.operationsPanel.openOperationsPanel());
                } else {
                    await dispatch(ListWebActions.operationsPanel.closeOperationsPanel());
                }

                break;
            }
        }

        next(action);
    };
