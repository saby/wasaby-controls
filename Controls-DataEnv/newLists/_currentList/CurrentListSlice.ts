import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type {
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
    IListState,
    TListActions,
    TListMiddlewareContext,
} from 'Controls-DataEnv/list';
import { ListActionCreators, ListSlice } from 'Controls-DataEnv/list';
import {
    _private_predicates,
    getError,
    resolveCollectionType,
    getCollectionOptions,
} from 'Controls-DataEnv/abstractList';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';
import type { Collection as ICollection, IInteractorStateProps } from 'Controls/display';
import type { SyntheticEvent } from 'UICommon/Events';
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import {
    Direction,
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
    TSortingOptionValue,
} from 'Controls-DataEnv/listTypes';

const { isDefined, isUndefined } = _private_predicates;

/**
 * Класс, реализующий текущий слайс списка, тяжеловесный.
 *
 * Является дженериком и принимает параметр TState - тип состояния слайса.
 * @remark
 * {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d Архитектура списков и интеракторов}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Интерактор для работы со списочными компонентами в web окружении}
 * {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/mobile-slice/ Интерактор для работы со списочными компонентами на базе мобильного контроллера}
 * @see ListSlice
 */
export class CurrentListSlice<
    TState extends IListState = IListState,
    TAction extends TAbstractAction = TListActions.TAnyListAction<TState>,
    TMiddlewareContext extends TListMiddlewareContext<TState, TAction> = TListMiddlewareContext<
        TState,
        TAction
    >,
> extends ListSlice<TState, TAction, TMiddlewareContext> {
    private _subscribeOnFilter?: boolean;

    observeChanges(state: TState = this.state): void {
        this._subscribe(state);
    }

    unobserveChanges(state: TState = this.state): void {
        this._unsubscribe(state);
    }

    protected _subscribe(state: TState): void {
        super._subscribe(state);
        const controller = this._propsForMigrationToDispatcher?.sliceProperties?.sourceController;
        if (controller) {
            if (this._subscribeOnFilter) {
                controller.subscribe('rootChanged', this._rootChanged, this);
                controller.subscribe('filterChanged', this._filterChanged, this);
                controller.subscribe('sortingChanged', this._sortingChanged, this);
                controller.subscribe('navigationChanged', this._navigationChanged, this);
            }
        }
    }

    protected _unsubscribe(state: TState): void {
        super._unsubscribe(state);
        this._unsubscribeFromSourceController();
    }

    private _unsubscribeFromSourceController(): void {
        const controller = this._propsForMigrationToDispatcher?.sliceProperties?.sourceController;

        if (controller) {
            controller.unsubscribe('rootChanged', this._rootChanged, this);
            controller.unsubscribe('filterChanged', this._filterChanged, this);
            controller.unsubscribe('sortingChanged', this._sortingChanged, this);
            controller.unsubscribe('navigationChanged', this._navigationChanged, this);
        }
    }

    private _rootChanged(_: SyntheticEvent, root: TKey): void {
        if (root !== this.state.root) {
            this.state.root = root;
        }
    }

    private _filterChanged(_: SyntheticEvent, filter: TFilter): void {
        if (!isEqual(filter, this.state.filter)) {
            this.state.filter = filter;
        }
    }

    private _sortingChanged(_: SyntheticEvent, sorting: TSortingOptionValue): void {
        this.state.sorting = sorting;
    }

    private _navigationChanged(
        _: SyntheticEvent,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        this.state.navigation = navigation;
    }

    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        config: IListDataFactoryArguments
    ): TState {
        this._subscribeOnFilter = config.task1186833531;

        return super._initState(loadResult, config);
    }

    protected _onAfterInitState(state: TState) {
        super._onAfterInitState(state);

        // Чистой новой схеме маркер инициализируется правильно, как надо.
        // Для всех остальных список сам дергает и
        // проставляет в модель значение на маунте.
        // Затем, после построения, обновляется слайс
        if (this.collection) {
            state.markedKey = this._initMarker(state);
            this._initActions(state, this.collection);
        }
    }

    protected async _beforeApplyState(nextStateProp: TState): Promise<TState> {
        if (this.isDestroyed()) {
            return this.state;
        }

        this.unobserveChanges();

        const nextState = await super._beforeApplyState(nextStateProp);

        this.observeChanges();

        return nextState;
    }

    private _initActions({ itemActionsMap }: TState, collection: ICollection): void {
        if (itemActionsMap) {
            collection.updateInteractorStateProps({
                itemActionsMap,
            });
        }
    }

    // Возвращается значение для совместимости со старыми таблицами в WEB.
    setCollection<T extends ICollection>(
        collection: T | null,
        isOnInitInOldLists?: boolean
    ): boolean {
        // https://online.sbis.ru/opendoc.html?guid=78cd4cb6-ed7b-44c5-8cba-46b16af4a91d&client=3
        if (collection === this._collection) {
            return !!this._collection;
        }

        if (collection && !collection['[Controls/display:Collection]' as keyof T]) {
            getError('OBJ_IS_NOT_COLLECTION');
            this._collection = undefined;
            return false;
        }

        let alias;
        try {
            alias = collection ? resolveCollectionType(collection) : undefined;
        } catch (e) {
            alias = undefined;
            getError('ANY', e);
        }

        if (alias) {
            this._collection = collection ?? undefined;
            // Необходимо разработать слой совместимости
            // Одни и те же операции происходят в Slice, а затем в BaseControl
            // Последствия такого поведения непредсказуемы
            this._skipSetCollection = true;
            this._isPrivateCollectionMoreActual = true;
        } else {
            this._collection = undefined;
            this._skipSetCollection = false;
        }

        if (this._collection && isOnInitInOldLists) {
            this._collection.updateInteractorStateProps(
                getCollectionOptions(
                    // Если на состоянии есть коллекция, то alias точно определен
                    alias as Exclude<typeof alias, undefined>,
                    this.state
                ) as IInteractorStateProps
            );

            // TODO: На коллекции и состоянии рассинхронизирован маркер
            this._collection.setMarkedKey(this._initMarker(this.state));
        }

        return !!this._collection;
    }

    private _initMarker(state: TState): TKey | undefined {
        if (state.markerVisibility === 'hidden') {
            return undefined;
        }

        let newMarkedKey = state.markedKey;

        if (state.markerVisibility === 'visible' && state.items) {
            const item =
                state.markedKey !== undefined &&
                state.markedKey !== null &&
                state.items.getRecordById(state.markedKey);
            if (state.items.getCount() && !item) {
                newMarkedKey = this._collection?.getFirst('Markable')?.key;
            }
        }

        return newMarkedKey;
    }

    _setPreloadedItems(items: RecordSet, direction: Direction): Promise<void> {
        return this._addAsyncAction(
            ListActionCreators.source.setPreloadedItems({
                direction,
                items,
            }) as TAction
        );
    }

    _loadItemsToDirection(
        direction: Direction,
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean
    ): Promise<RecordSet | Error> {
        if (direction === 'up') {
            return this._addAsyncAction(
                ListActionCreators.source.loadPrev(addItemsAfterLoad, useServicePool) as TAction
            );
        } else {
            return this._addAsyncAction(
                ListActionCreators.source.loadNext(addItemsAfterLoad, useServicePool) as TAction
            );
        }
    }

    async load(
        direction?: Direction,
        key?: TKey,
        ...args: [
            filter?: TFilter,
            addItemsAfterLoad?: boolean,
            navigationSourceConfig?: IBaseSourceConfig,
        ]
    ): Promise<TListActions.source.TOldSliceLoadAction> {
        if (isDefined(direction) && isDefined(key) && args.every(isUndefined)) {
            await getError('DEPRECATED_USED', 'warn', 'load', 'prev/next');
        }
        return this._load(void 0, direction, key, ...args);
    }
}
