import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/abstractListAspect';
import type { IListAspects, IListLoadResult } from 'Controls/dataFactory';
import { AbstractListSlice } from 'Controls/dataFactory';
import type { IListMobileMiddlewareContext } from './_interface/IListMobileTypes';
import {
    IListMobileAction,
    IListMobileMiddlewareWithContext,
    IListMobileState,
} from './_interface/IListMobileTypes';
import type { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';
import { eventChannelMiddleware } from './_middlewares/eventChannelMiddleware';
import { invokerMiddleware } from './_middlewares/invokerMiddleware';
import { loggerMiddleware } from './_middlewares/loggerMiddleware';
import { receiverMiddleware } from './_middlewares/receiverMiddleware';
import * as actions from './_actions';
import { KeepAliveController } from './_keepAliveController/KeepAliveController';
import { ListMobileSource } from './_source/ListMobileSource';
import { SourceController } from './_sourceController/SourceController';
import { ScrollController } from './_scrollController/ScrollController';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { VirtualCollection } from './_virtualCollection/VirtualCollection';
import { resolve as diResolve } from 'Types/di';
import { Model } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { extraLogicMiddleware } from 'Controls-Lists/_dataFactory/ListMobile/_middlewares/extraLogicMiddleware';

export default class ListMobileSlice extends AbstractListSlice<IListMobileState> {
    readonly '[IListSlice]': boolean = true;
    private _connectionCount: number = 0;
    private _middlewares: IListMobileMiddlewareWithContext[];

    private _keepAliveController: KeepAliveController;
    private _sourceController: SourceController;
    private _scrollController: ScrollController;
    private _virtualCollection: VirtualCollection;
    protected _aspectStateManagers: IListAspects;

    protected _initState(
        loadResult: IListLoadResult,
        initConfig: IListMobileDataFactoryArguments
    ): IListMobileState {
        const source = new ListMobileSource({
            collectionEndpoint: initConfig.collectionEndpoint,
            observerEndpoint: initConfig.observerEndpoint,
        });
        if (initConfig.pagination.direction === undefined) {
            initConfig.pagination.direction = 'down';
        }

        this._sourceController = new SourceController({
            filter: initConfig.filter,
            root: initConfig.root,
            pagination: initConfig.pagination,
            source,
        });

        const state: IListMobileState = {
            ...this._getInitialState(loadResult, initConfig),
            command: null,
            countLoading: false,
            filter: initConfig.filter,
            isAllSelected: false,
            loading: false,
            backButtonCaption: '',
            backButtonItem: undefined,
            breadCrumbsItems: [],
            breadCrumbsItemsWithoutBackButton: [],
            hasMoreStorage: undefined,
            displayProperty: initConfig.displayProperty,
            keyProperty: ExternalCollectionItemKeys.ident,
            parentProperty: ExternalCollectionItemKeys.parent,
            nodeProperty: ExternalCollectionItemKeys.node_type,
            expandedItems: initConfig.expandedItems || [],
            collapsedItems: initConfig.collapsedItems || [],
            singleExpand: initConfig.singleExpand,
            root: initConfig.root ?? null,
            selectedKeys: initConfig.selectedKeys || [],
            excludedKeys: initConfig.excludedKeys || [],
            markerVisibility: initConfig.markerVisibility || 'onactivated',
            markedKey: initConfig.markedKey,
            selectionType: initConfig.selectionType,
            collectionType: initConfig.collectionType,
            items: loadResult.items,
            data: loadResult.items,
            filterDetailPanelVisible: false,
            operationsPanelVisible: false,
            sorting: initConfig.sorting,
            selectFields: initConfig.selectFields,
            historyId: initConfig.historyId,
            navigation: initConfig.navigation,
            listConfigStoreId: initConfig.listConfigStoreId,
            viewMode: initConfig.viewMode,
            multiSelectVisibility: initConfig.multiSelectVisibility || 'hidden',
            selectionViewMode: 'hidden',
            groupHistoryId: initConfig.groupHistoryId,
            count: undefined,
            editorsViewMode: initConfig.editorsViewMode,
            adaptiveSearchMode: initConfig.adaptiveSearchMode,
            propStorageId: initConfig.propStorageId,
            hasChildrenProperty: initConfig.hasChildrenProperty,
            expanderVisibility: 'visible',
            selectionCountMode: initConfig.selectionCountMode,
            recursiveSelection: initConfig.recursiveSelection,
            rootHistoryId: initConfig.rootHistoryId,
            nodeHistoryId: initConfig.nodeHistoryId,
            nodeHistoryType: initConfig.nodeHistoryType,
            deepReload: initConfig.deepReload,
            deepScrollLoad: initConfig.deepScrollLoad,
            moveMarkerOnScrollPaging: initConfig.moveMarkerOnScrollPaging,
            markItemByExpanderClick: initConfig.markItemByExpanderClick ?? true,
            isThinInteractor: true,
            searchParam: initConfig.searchParam || 'SearchString',
        };

        this._initCollection(initConfig.collectionType, state);
        this._initAspects(initConfig.collectionType, {
            ...state,
            collection: this._collection,
        });

        this._scrollController = new ScrollController()
            .setCollection(() => this._collection)
            .setSourceController(() => this._sourceController);

        this._virtualCollection = new VirtualCollection({
            model: getModelConstructor(initConfig.model),
            displayProperty: initConfig.displayProperty || 'title',
            // Только ради крошек
            _getFilter: () => this.state.filter,
        });

        this._middlewares = this._createMiddlewares().map((middleware) =>
            middleware(this._createMiddlewareContext(initConfig))
        );

        this._keepAliveController = new KeepAliveController({
            dispatchCallback: (pageId: string) => this._dispatch(actions.keepAlive(pageId)),
        });

        return state;
    }

    protected _beforeApplyState(): Promise<IListMobileState> | IListMobileState {
        return this.state;
    }

    protected _onSnapshot(state: IListMobileState): IListMobileState {
        const superState = super._onSnapshot(state);
        if (superState.breadCrumbsItems && superState.breadCrumbsItems.length) {
            const firstParent = superState.breadCrumbsItems[0].get(this.state.parentProperty);
            if (typeof firstParent === 'undefined') {
                superState.breadCrumbsItems[0].set(this.state.parentProperty, null);
            }
        }
    }

    // Метод, для синхронного применения изменений к state и collection
    private _applyChanges(changes: IListChange[]): void {
        const nextState = this._getNextState(this.state, changes);
        this._applyState(nextState);
        this._applyChangesToCollection(changes, nextState);
    }

    // Метод, создающий контекст для middleware
    protected _createMiddlewareContext(
        initConfig: IListMobileDataFactoryArguments
    ): IListMobileMiddlewareContext {
        const dispatch = this._dispatch.bind(this);
        const applyChanges = this._applyChanges.bind(this);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        return {
            get collection() {
                return self._collection;
            },
            get virtualCollection() {
                return self._virtualCollection;
            },
            get state() {
                return self.state;
            },
            get initConfig() {
                return initConfig;
            },
            get applyChanges() {
                return applyChanges;
            },
            get dispatch() {
                return dispatch;
            },
            get sourceController() {
                return self._sourceController;
            },
        };
    }

    // Метод, создающий middlewares для action
    protected _createMiddlewares() {
        return [
            eventChannelMiddleware,
            invokerMiddleware,
            receiverMiddleware,
            extraLogicMiddleware,
            loggerMiddleware,
        ];
    }

    // Метод, для публикации action через цепочку middlewares
    protected _dispatch(action: IListMobileAction): void {
        let listActions: IListMobileAction[] = [action];
        let nextActions: IListMobileAction[] = [];

        const next = (nextAction: IListMobileAction) => nextActions.push(nextAction);

        for (const middleware of this._middlewares) {
            for (const currentAction of listActions) {
                middleware(next)(currentAction);
            }
            listActions = nextActions;
            nextActions = [];
        }
    }

    //# region API Публичного контроллера
    connect(): void {
        if (this._connectionCount === 0) {
            this._connectionCount++;
        } else {
            return;
        }

        this._dispatch(actions.connect());
        // this._keepAliveController.start();
    }

    disconnect(): void {
        this._connectionCount = Math.max(this._connectionCount - 1, 0);
        if (this._connectionCount === 0) {
            this._keepAliveController.stop();
            this._dispatch(actions.disconnect());
        }
    }

    destroy() {
        this._keepAliveController.destroy();
        super.destroy();
    }

    mark(key: CrudEntityKey): void {
        this._dispatch(actions.mark(key));
    }

    select(key: CrudEntityKey): void {
        this._dispatch(actions.select(key));
    }

    changeRoot(key: CrudEntityKey | null): void {
        this._dispatch(actions.changeRoot(key));
    }

    expand(key: CrudEntityKey): void {
        this._dispatch(actions.expand(key));
    }

    collapse(key: CrudEntityKey): void {
        this._dispatch(actions.collapse(key));
    }

    next(): void {
        if (this.state.hasMoreStorage?.[`${this.state.root}`]?.forward !== true) {
            return;
        }
        this._dispatch(actions.next(this._scrollController.getForwardKey()));
    }

    prev(): void {
        if (this.state.hasMoreStorage?.[`${this.state.root}`]?.backward !== true) {
            return;
        }
        this._dispatch(actions.prev(this._scrollController.getBackwardKey()));
    }

    async search(searchValue: string): Promise<void> {
        this._rootBeforeSearch = this.state.root;
        await this._sourceController.search(searchValue);
        if (null !== this.state.root) {
            this._dispatch(actions.changeUICollectionRoot(null));
        }
    }

    async resetSearchQuery(): Promise<void> {
        await this._sourceController.resetSearch();
        if (this._rootBeforeSearch !== this.state.root) {
            this._dispatch(actions.changeUICollectionRoot(this._rootBeforeSearch));
            this._rootBeforeSearch = undefined;
        }
    }

    setSearchInputValue(value: string): void {
        if (this.state.searchInputValue !== value) {
            this._applyState({
                searchInputValue: value,
            });
        }
    }

    //# endregion API Публичного контроллера
}

function getModelConstructor(modelCfg?: string | Function): typeof Model {
    if (!modelCfg) {
        return Model;
    }

    let model = typeof modelCfg === 'string' ? diResolve(modelCfg) : modelCfg;

    if (typeof model === 'function') {
        return model as typeof Model;
    }

    Logger.error('Controls-Lists/dataFactory:MobileSlice::Неверный тип модели!');

    return Model;
}
