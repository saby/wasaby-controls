import {
    IListState,
    ListActionCreators,
    SnapshotName,
    TListMiddleware,
    TListMiddlewareContext,
    ListWebInitializers,
    _private,
    _private_TMiddlewaresPropsForMigrationToDispatcher,
    TListActions,
} from 'Controls-DataEnv/list';
import { ListWebActions, getDecomposedPromise } from 'Controls/dataFactory';
import type { Collection as ICollection } from 'Controls/display';
import { isEqual } from 'Types/object';
import { USER } from 'ParametersWebAPI/Scope';
import { RecordSet } from 'Types/collection';
import { getError, TAbstractListMiddlewareContext } from 'Controls-DataEnv/abstractList';
import {
    resolveSearchViewMode,
    getStateOnSearchReset,
    getSelectionViewMode,
    getCountConfig,
    loadCount,
} from './utils';
import { TFilter, IFilterDescriptionItem } from 'Controls-DataEnv/interface';

const { getFilterModuleSync } = _private;

export const complexUpdate: TListMiddleware =
    ({
        getTrashBox,
        getCollection,
        snapshots,
        dispatch,
        registerPendingPromise,
        scheduleDispatch,
        getState,
        setState,
    }: TListMiddlewareContext) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'oldBeforeApplyState': {
                const { _propsForMigrationToDispatcher } = getTrashBox();
                // Старый код.
                // Мы уже что-то обновили выше.
                // В старый код нужно отдать предыдущий стейт, а в новый уже посчитанный.
                const nextState = await beforeApplyState_fn(
                    action.payload.prevState,
                    action.payload.nextState,
                    _propsForMigrationToDispatcher,
                    getCollection(),
                    snapshots,
                    dispatch,
                    registerPendingPromise,
                    scheduleDispatch
                );
                if (nextState.expandedItems !== getState().expandedItems) {
                    await dispatch(
                        ListWebActions.expandCollapse.setExpandedItems(nextState.expandedItems)
                    );
                    nextState.expansionModel = getState().expansionModel;
                }
                setState(nextState);
                break;
            }
        }

        next(action);
    };

async function beforeApplyState_fn(
    currentState: IListState,
    nextState: IListState,
    props: _private_TMiddlewaresPropsForMigrationToDispatcher | null,
    collection: ICollection | undefined,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: TAbstractListMiddlewareContext['registerPendingPromise'],
    scheduleDispatch: Function
): Promise<IListState> {
    const needReloadBySelectionViewMode =
        (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
        currentState.selectionViewMode === 'selected';
    const excludedKeysChanged = !isEqual(currentState.excludedKeys, nextState.excludedKeys);
    const selectedKeysChanged = !isEqual(currentState.selectedKeys, nextState.selectedKeys);

    const viewModeChanged = nextState.viewMode !== currentState.viewMode;
    // Для правильной работы expandedCompositeTree.
    if (nextState.viewMode === 'composite') {
        nextState.expandedItems = [null];
    }
    const collapsedItemsChanged = !isEqual(currentState.collapsedItems, nextState.collapsedItems);
    const expandedItemsChanged = !isEqual(currentState.expandedItems, nextState.expandedItems);
    const countChanged = currentState.count !== nextState.count;

    const sourceControllerChanged = nextState.sourceController !== currentState.sourceController;
    const loadingPromises = [];
    const rootChanged = currentState.root !== nextState.root;
    const searchValueChanged =
        !isEqual(currentState.searchValue, nextState.searchValue) &&
        // Сброс поиска от смены корня не должен вызывать загрузку данных через resetSearch
        !(rootChanged && !nextState.searchValue);

    const filterChanged = !isEqual(currentState.filter, nextState.filter);
    const filterDescriptionChanged = !isEqual(
        currentState.filterDescription,
        nextState.filterDescription
    );

    if (sourceControllerChanged) {
        // Нам не нужно отписываться от старого сорс контроллера, т.к.
        // в момент выполнения Dispatcher.dispatch мы отписаны от контроллера источника.
        // Это обеспечивает сейчас слайс.

        if (!nextState.sourceController) {
            nextState.sourceController =
                ListWebInitializers.source.createSourceController(currentState);
        } else {
            nextState.items = nextState.sourceController.getItems();
        }

        if (props?.sliceProperties) {
            props.sliceProperties.sourceController = nextState.sourceController;
        }
    }

    if (rootChanged && nextState.rootHistoryId) {
        USER.set(nextState.rootHistoryId, JSON.stringify(nextState.root));
    }
    if (
        !currentState.fix88221034174482 &&
        currentState.items &&
        nextState.items &&
        currentState.items !== nextState.items
    ) {
        props?.sliceCallbacks?.updateSubscriptionOnItems?.(currentState.items, nextState.items);
    }
    if ((expandedItemsChanged || countChanged) && currentState.listConfigStoreId) {
        await dispatch(
            ListActionCreators.source.setSavedSourceState(currentState.listConfigStoreId, nextState)
        );
    }

    const needReloadBySourceController = nextState.sourceController?.updateOptions(
        // TODO: source -> complexUpdate
        ListWebInitializers.source.getSourceControllerOptions(nextState)
    );

    if (
        (needReloadBySourceController ||
            rootChanged ||
            searchValueChanged ||
            props?.sliceProperties?.newItems) &&
        !needReloadBySelectionViewMode &&
        nextState.selectionViewMode === 'selected'
    ) {
        Object.assign(nextState, { selectionViewMode: 'hidden', showSelectedCount: null });
    }
    const needReload =
        needReloadBySourceController ||
        needReloadBySelectionViewMode ||
        (nextState.searchNavigationMode === 'expand' && rootChanged);

    if (needReload) {
        snapshots.set(SnapshotName.ComplexUpdate, {
            ...(snapshots.get(SnapshotName.ComplexUpdate) || {}),
            _needReloadBySourceController: needReload,
        });
    }

    if (props?.sliceProperties?.newItems) {
        if (!needReload) {
            const newItems = props.sliceProperties.newItems;
            const direction = props.sliceProperties.newItemsDirection;
            const sourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
            const keepNavigation = props.sliceProperties.loadConfig?.keepNavigation;
            props.sliceProperties.newItems = null;
            props.sliceProperties.loadConfig = null;
            props.sliceProperties.newItemsDirection = undefined;

            const dNewItemsReceived = getDecomposedPromise<Partial<IListState>>();

            return dispatch(
                ListActionCreators.source.newItemsReceived({
                    items: newItems as RecordSet,
                    itemsDirection: direction,
                    currentState,
                    nextState,
                    loadConfig: {
                        sourceConfig,
                        keepNavigation,
                    },
                    additionalPromise: undefined,

                    onResolve: dNewItemsReceived.resolve,
                    onReject: dNewItemsReceived.reject,
                })
            ).then(() => dNewItemsReceived.promise);
        } else {
            props.sliceProperties.newItems = null;
        }
    }

    if (
        props &&
        nextState.filter &&
        nextState.selectionViewMode !== currentState.selectionViewMode &&
        nextState.selectionViewMode === 'selected'
    ) {
        snapshots.set(SnapshotName.BeforeShowOnlySelected, {
            breadCrumbsItems: nextState.breadCrumbsItems,
            selected: nextState.selectedKeys,
            excluded: nextState.excludedKeys,
        });
        Object.assign(nextState, getStateForOnlySelectedItems(nextState, props, snapshots));
        nextState.sourceController?.setFilter(nextState.filter);

        if (props.sliceProperties) {
            props.sliceProperties.previousViewMode = undefined;
        }
    }

    const selectionBeforeShowSelectedApply = snapshots.get(SnapshotName.BeforeShowOnlySelected);
    if (currentState.selectionViewMode === 'selected' && nextState.selectionViewMode === 'all') {
        snapshots.delete(SnapshotName.BeforeShowOnlySelected);
        nextState.isAllSelected = false;
        nextState.showSelectedCount = null;
        nextState.listCommandsSelection =
            ListWebInitializers.operationsPanel.getListCommandsSelection(
                nextState,
                selectionBeforeShowSelectedApply
            );
    } else if (excludedKeysChanged || selectedKeysChanged) {
        nextState.listCommandsSelection =
            ListWebInitializers.operationsPanel.getListCommandsSelection(
                nextState,
                selectionBeforeShowSelectedApply
            );
    }

    if (nextState.selectionViewMode === 'selected') {
        nextState.breadCrumbsItems = null;
        nextState.breadCrumbsItemsWithoutBackButton = null;
        nextState.backButtonCaption = '';
    }

    if (
        countChanged ||
        filterChanged ||
        (nextState.selectedCountConfig &&
            nextState.count === null &&
            (selectedKeysChanged || excludedKeysChanged))
    ) {
        if (typeof nextState.count === 'number' && !filterChanged) {
            const operationsController = nextState.operationsController;
            if (
                nextState.listId &&
                operationsController &&
                operationsController?.getCounterConfig()?.count !== nextState.count
            ) {
                operationsController.updateSelectedKeysCount(
                    nextState.count,
                    nextState.isAllSelected,
                    nextState.listId
                );
            }
        } else if (
            nextState.filter &&
            nextState.selectedCountConfig &&
            (nextState.count === null || (filterChanged && nextState.selectedKeys.length))
        ) {
            const selection = {
                selected: nextState.selectedKeys,
                excluded: nextState.excludedKeys,
            };
            const countConfig = getCountConfig(nextState.selectedCountConfig, nextState.filter);
            nextState.countLoading = true;
            registerPendingPromise(
                'loadCount',
                loadCount(
                    selection,
                    countConfig,
                    nextState.selectionCountMode,
                    nextState.recursiveSelection
                ),
                'replace'
            )
                .then((newCount) => {
                    scheduleDispatch(
                        ListActionCreators.interactorCore.publicSetState<IListState>({
                            count: newCount as number | null | undefined,
                            countLoading: false,
                        })
                    );
                })
                .catch((error) => {
                    if (!error.isCanceled) {
                        getError('ANY', error);
                    }
                });
        } else if (countChanged) {
            nextState.operationsController?.updateSelectedKeysCount(
                nextState.count as unknown as number,
                nextState.isAllSelected,
                // FIXME: Types
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                nextState.listId
            );
        }
    }

    if (props?.sliceProperties && nextState.viewMode) {
        const searchViewMode = resolveSearchViewMode(
            !!currentState.adaptiveSearchMode,
            nextState.viewMode
        );

        if (
            nextState.viewMode !== searchViewMode &&
            !currentState.searchValue &&
            nextState.searchValue
        ) {
            props.sliceProperties.previousViewMode = nextState.viewMode;
        }

        // Поддержка смены viewMode в режиме поиска
        if (viewModeChanged && nextState.searchValue) {
            props.sliceProperties.previousViewMode = nextState.viewMode;
            nextState.viewMode = searchViewMode;
        }
    }

    if (expandedItemsChanged) {
        nextState.sourceController?.setExpandedItems(nextState.expandedItems);
        if (nextState.nodeHistoryId) {
            nextState.sourceController?.updateExpandedItemsInUserStorage();
        }
    } else if (needReload && !(nextState.sourceController?.isExpandAll() || nextState.deepReload)) {
        nextState.expandedItems = [];
        nextState.sourceController?.setExpandedItems([]);
    }

    if (needReload && (!searchValueChanged || !nextState.searchParam)) {
        const stateForApply: Partial<IListState> = {
            loading: true,
        };
        if (filterDescriptionChanged) {
            stateForApply.filterDescription = nextState.filterDescription;
        }
        if (currentState.searchInputValue !== nextState.searchInputValue) {
            stateForApply.searchInputValue = nextState.searchInputValue;
        }
        props?.sliceCallbacks?.applyState?.(stateForApply);
        // При смене рута props.sliceProperties.loadConfig хранит курсорную навигацию с изменённым position.
        // Нужно обновить курсорную навигацию в стейте и вызывать reloadSourceController() с нужной конфигурацией.
        let navigationSourceConfig;
        if (rootChanged && props?.sliceProperties?.loadConfig?.sourceConfig) {
            // Обновляем только курсорную навигацию
            if (nextState.navigation?.source === 'position') {
                navigationSourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
                nextState.navigation = {
                    ...nextState.navigation,
                    // @ts-expect-error Необходимо выравнять типы конфигураций
                    sourceConfig: navigationSourceConfig,
                };
            }
            props.sliceProperties.loadConfig = null;
        }

        // @ts-expect-error Необходимо выравнять типы конфигураций
        await dispatch(ListActionCreators.source.load(navigationSourceConfig));
    }

    if (
        collection &&
        !needReload &&
        !searchValueChanged &&
        (expandedItemsChanged || collapsedItemsChanged)
    ) {
        const expandedItemsDiff = getArrayDifference(
            currentState.expandedItems,
            nextState.expandedItems
        );

        if (expandedItemsDiff.added.length && nextState.source) {
            const dPromise = getDecomposedPromise<IListState>();

            await dispatch(
                ListActionCreators.source.loadNodes({
                    currentState,
                    nextState,
                    keys: expandedItemsDiff.added,
                    onResolve: dPromise.resolve,
                })
            );

            loadingPromises.push(dPromise.promise);
        }
    }

    if (!loadingPromises.length) {
        nextState.selectionViewMode = getSelectionViewMode(currentState, nextState);
    }

    if (loadingPromises.length) {
        return Promise.all(loadingPromises).then((results: IListState[]) =>
            results.reduce((state, loadStateResult) => {
                return {
                    ...state,
                    ...loadStateResult,
                };
            }, nextState)
        );
    } else {
        return Promise.resolve(nextState);
    }
}

type ISnapshotsStore = Parameters<TListMiddleware>[0]['snapshots'];

// Скопировано из Controls/Utils/ArraySimpleValuesUtil

/**
 * Утилита для простых операций с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 * @private
 */
interface IDifferenceArrays<T extends any = any> {
    added: T[];
    removed: T[];
}

/**
 * Сравнивает два массива, возвращает разницу между ними
 * @param arrayOne
 * @param arrayTwo
 * @returns {{added: Array, removed: Array}}
 */
function getArrayDifference<T extends any = any>(
    arrayOne: T[],
    arrayTwo: T[]
): IDifferenceArrays<T> {
    return {
        removed: arrayOne.filter((item) => {
            return !hasInArray(arrayTwo, item);
        }),
        added: arrayTwo.filter((item) => {
            return !hasInArray(arrayOne, item);
        }),
    };
}

function hasInArray(array: any[], elem: unknown): boolean {
    return invertTypeIndexOf(array, elem) !== -1;
}

const CONSTRUCTORS_FOR_TYPE_INVERTING = {
    string: Number,
    number: String,
};

function invertTypeIndexOf(array: any[], elem: unknown): number {
    let index: number = array.indexOf(elem);

    if (index === -1) {
        const elementType = typeof elem;

        // Данная утилита используется для операций с массивами,
        // в которых могут лежать любые типы данных.
        // Инвертировать тип необходимо только для строк и чисел.
        // Для остальных типов данных это не имеет смысла и только вызывает тормоза
        if (
            (elementType === 'string' || elementType === 'number') &&
            CONSTRUCTORS_FOR_TYPE_INVERTING[elementType]
        ) {
            index = array.indexOf(CONSTRUCTORS_FOR_TYPE_INVERTING[elementType](elem));
        }
    }

    return index;
}

/**
 * Получение нового состояния для выделенных элементов
 * */
function getStateForOnlySelectedItems(
    state: IListState,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
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
        newState.viewMode = props?.sliceProperties?.previousViewMode;
        state.sourceController?.setFilter(newState.filter as TFilter);
    }

    if (state.filterDescription) {
        const { FilterDescription, FilterCalculator } = getFilterModuleSync();

        if (FilterDescription.isFilterDescriptionChanged(state.filterDescription)) {
            newState.filterDescription = state.filterDescription.map((filterItem) => {
                if (!filterItem.doNotSaveToHistory) {
                    return FilterDescription.resetFilterItem({ ...filterItem });
                }
                return filterItem;
            });
            newState.filter = FilterCalculator.getFilterByFilterDescription(
                newState.filter as TFilter,
                newState.filterDescription as IFilterDescriptionItem[]
            );
            state.sourceController?.setFilter(newState.filter as TFilter);
        }
    }

    if (state.count) {
        state.showSelectedCount = state.count;
    }
    state.listCommandsSelection = ListWebInitializers.operationsPanel.getListCommandsSelection(
        state,
        snapshots.get(SnapshotName.BeforeShowOnlySelected)
    );

    return newState as Partial<IListState>;
}
