import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import * as stateActions from '../actions/state';
import * as operationsPanelActions from '../actions/operationsPanel';
import * as selectionActions from '../actions/selection';
import * as markerActions from '../actions/marker';
import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { ISelection, TFilter } from 'Controls-DataEnv/interface';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import type { ISnapshotsStore } from '../types/ISnapshotsStore';
import { SnapshotName } from '../types/SnapshotName';
import { TSelectionViewMode } from 'Controls/_interface/ISelectionViewMode';
import { isEqual } from 'Types/object';
import { AbstractListSlice } from 'Controls/_dataFactory/AbstractList/AbstractListSlice';
import { TMiddlewaresPropsForMigrationToDispatcher } from 'Controls/_dataFactory/ListWebDispatcher/actions/beforeApplyState';
import { getStateOnSearchReset } from 'Controls/_dataFactory/ListWebDispatcher/middlewares/_search';
import { TSelectionCountMode } from 'Controls/_interface/ISelectionCountMode';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'operationsPanel',
    actionsNames: [
        'openOperationsPanel',
        'closeOperationsPanel',
        'updateOperationsSelection',
        'setSelectionViewMode',
        'resetSelectionViewMode',
        'updateOperationsPanel',
    ],
});

export const operationsPanel: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, snapshots } = withLogger(ctx, 'operationsPanel');

    return (next) => async (action) => {
        logger.enter(action);

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
                    stateActions.setState({
                        operationsPanelVisible: true,
                    })
                );

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

                //#region Обновление отметки записей
                await dispatch(
                    stateActions.setState({
                        operationsPanelVisible: false,
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                await dispatch(selectionActions.resetSelection());
                await dispatch(operationsPanelActions.resetSelectionViewMode());

                // TODO: Разобрать на экшены, поняв что это за поведение.
                await dispatch(
                    stateActions.setState({
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

                await dispatch(
                    stateActions.setState({
                        listCommandsSelection: getListCommandsSelection(getState(), snapshots),
                    })
                );
                break;
            }

            case 'setSelectionViewMode': {
                break;
            }

            case 'resetSelectionViewMode': {
                await dispatch(stateActions.setState(getStateForSelectionViewModeReset()));
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

function getListCommandsSelection(
    nextState: IListState,
    snapshots: ISnapshotsStore
): ISelection | undefined {
    if (isLoaded('Controls/operations')) {
        return loadSync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).getListCommandsSelection(
            { selectedKeys: nextState.selectedKeys, excludedKeys: nextState.excludedKeys },
            // @ts-ignore
            nextState.markedKey,
            snapshots.get(SnapshotName.BeforeShowOnlySelected)
        );
    }
}

function getStateForSelectionViewModeReset(): Partial<IListState> {
    return {
        selectionViewMode: 'hidden',
        showSelectedCount: null,
    } as Partial<IListState>;
}

function getSelectionViewMode(currentState: IListState, nextState: IListState): TSelectionViewMode {
    let selectionViewMode = nextState.selectionViewMode;
    const needCalcSelectionViewMode =
        !isEqual(currentState.selectedKeys, nextState.selectedKeys) ||
        !isEqual(currentState.excludedKeys, nextState.excludedKeys) ||
        currentState.searchValue !== nextState.searchValue ||
        currentState.root !== nextState.root ||
        !isEqual(currentState.expandedItems, nextState.expandedItems);

    if (needCalcSelectionViewMode && isLoaded('Controls/operations')) {
        selectionViewMode = AbstractListSlice.getOperationsModuleSync().getSelectionViewMode(
            selectionViewMode,
            nextState
        );
    }

    return selectionViewMode;
}

function getStateForOnlySelectedItems(
    state: IListState,
    props: TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore
): Partial<IListState> {
    const newState: Record<string, unknown> = {
        breadCrumbsItems: null,
        breadCrumbsItemsWithoutBackButton: null,
        backButtonCaption: '',
        filter: state.filter,
    };

    if (state.searchValue) {
        Object.assign(newState, getStateOnSearchReset(state, snapshots));
        newState.viewMode = props.sliceProperties.previousViewMode;
        state.sourceController?.setFilter(newState.filter);
    }

    if (state.filterDescription) {
        const { FilterDescription, FilterCalculator } = AbstractListSlice.getFilterModuleSync();
        newState.filterDescription = FilterDescription.resetFilterDescription(
            state.filterDescription,
            true
        );
        newState.filter = FilterCalculator.getFilterByFilterDescription(
            newState.filter,
            newState.filterDescription
        );
        state.sourceController?.setFilter(newState.filter);
    }

    if (state.count) {
        state.showSelectedCount = state.count;
    }
    state.listCommandsSelection = getListCommandsSelection(state, snapshots);

    return newState as Partial<IListState>;
}

type ICountConfig = Required<IListState>['selectedCountConfig'];

function loadCount(
    selection: ISelection,
    countConfig: ICountConfig,
    selectionCountMode: TSelectionCountMode = 'all',
    recursive?: boolean
): Promise<number | null | void> {
    return loadAsync<typeof import('Controls/operations')>('Controls/operations').then(
        ({ getCount }) => {
            return getCount
                .getCount(selection, countConfig, selectionCountMode, recursive)
                .then((newCount) => {
                    return newCount;
                });
        }
    );
}

function getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
    const data = selectedCountConfig.data || {};
    const selectedFilter = data.filter ? { ...filter, ...data.filter } : filter;
    return {
        ...selectedCountConfig,
        data: {
            filter: {
                ...selectedFilter,
            },
        },
    };
}

export {
    getSelectionViewMode,
    getStateForSelectionViewModeReset,
    getListCommandsSelection,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
};
