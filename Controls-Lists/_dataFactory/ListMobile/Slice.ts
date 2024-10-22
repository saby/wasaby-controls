/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/listAspects';
import type { IListAspects, IListLoadResult } from 'Controls/dataFactory';
import { AbstractListSlice, ISliceWithSelection } from 'Controls/dataFactory';
import type { MarkerDirection, TFilter, TSelectionRecordContent } from 'Controls/interface';
import type { IListMobileMiddlewareContext } from './_interface/IListMobileTypes';
import {
    IListMobileAction,
    IListMobileMiddlewareWithContext,
    IListMobileState,
} from './_interface/IListMobileTypes';
import type { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';
import { eventChannelMiddleware } from './_middlewares/eventChannelMiddleware';
import { invokerMiddleware } from './_middlewares/invokerMiddleware';
// import { loggerMiddleware } from './_middlewares/loggerMiddleware';
import { receiverMiddleware } from './_middlewares/receiverMiddleware';
import * as actions from './_actions';
import { ListMobileSource } from './_source/ListMobileSource';
import { SourceController } from './_sourceController/SourceController';
import { ScrollController } from './_scrollController/ScrollController';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { VirtualCollection } from './_virtualCollection/VirtualCollection';
import { resolve as diResolve } from 'Types/di';
import { Model } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { extraLogicMiddleware } from 'Controls-Lists/_dataFactory/ListMobile/_middlewares/extraLogicMiddleware';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

const SEARCH_PARAM = 'SearchString';

/**
 * Класс, реализующий мобильный слайс списка.
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}
 * @class Controls-Lists/_dataFactory/ListMobile/Slice
 * @extends Controls-DataEnv/slice:AbstractSlice
 * @see Controls-ListEnv
 * @public
 */
// TODO: Вынести ISliceWithSelection в абстрактный списочный слайс, когда ПМО будет готово к этому.
//  https://online.sbis.ru/opendoc.html?guid=5165af79-4171-44b6-9e62-29b41a304d39&client=3
export default class ListMobileSlice
    extends AbstractListSlice<IListMobileState>
    implements ISliceWithSelection
{
    readonly '[IListSlice]': boolean = true;
    readonly '[ISliceWithSelection]' = true;

    private _connectionCount: number = 0;
    private _middlewares: IListMobileMiddlewareWithContext[];

    private _sourceController: SourceController;
    private _scrollController: ScrollController;
    private _virtualCollection: VirtualCollection;
    protected _aspectStateManagers: IListAspects;

    protected _muteRS: boolean = false;

    private _originDataConfig: Pick<
        IListMobileDataFactoryArguments,
        'keyProperty' | 'parentProperty' | 'nodeProperty' | 'displayProperty'
    >;

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

        this._originDataConfig = {
            keyProperty: initConfig.keyProperty,
            parentProperty: initConfig.parentProperty,
            nodeProperty: initConfig.nodeProperty,
            displayProperty: initConfig.displayProperty || 'title',
        };

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
            ladderProperties: initConfig.ladderProperties,
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
            ...this._originDataConfig,
            _getSearchValue: () => this.state.searchInputValue,
        });

        this._middlewares = this._createMiddlewares().map((middleware) =>
            middleware(this._createMiddlewareContext(initConfig))
        );

        return state;
    }

    protected _beforeApplyState(
        nextState: IListMobileState
    ): Promise<IListMobileState> | IListMobileState {
        super._beforeApplyState(nextState);
        return this.state;
    }

    /**
     * Метод, для синхронного применения изменений к state и collection
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#_applyChanges
     * @param {IListChange[]} changes
     * @private
     */
    private _applyChanges(changes: IListChange[]): void {
        const nextState = this._getNextState(this.state, changes);
        this._updateListCommandsSelection(nextState);
        this._applyChangesToCollection(changes, nextState);
        this._applyState(nextState);
        this._updateControllersByNewState(nextState);
    }

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

    protected _createMiddlewares() {
        return [
            eventChannelMiddleware,
            invokerMiddleware,
            receiverMiddleware,
            extraLogicMiddleware,
            // loggerMiddleware,
        ];
    }

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

    /**
     * Запустить подписки на внешние ресурсы
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#connect
     * @return {void}
     * @public
     */
    connect(): void {
        if (this._connectionCount === 0) {
            this._connectionCount++;
        } else {
            return;
        }

        this._dispatch(actions.connect());
    }

    /**
     * Остановить подписки на внешние ресурсы
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#disconnect
     * @return {void}
     * @public
     */
    disconnect(): void {
        this._connectionCount = Math.max(this._connectionCount - 1, 0);
        if (this._connectionCount === 0) {
            this._dispatch(actions.disconnect());
        }
    }

    /**
     * Разрушить слайс
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#destroy
     * @return {void}
     * @public
     */
    destroy() {
        super.destroy();
    }

    /**
     * Отметить элемент
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#mark
     * @param {Types/source:ICrud#CrudEntityKey} key
     * @return {void}
     * @public
     */
    mark(key: CrudEntityKey): void {
        this._dispatch(actions.mark(key));
    }

    /**
     * Выделить элемент
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#select
     * @param {Types/source:ICrud#CrudEntityKey} key
     * @param {MarkerDirection | undefined} direction
     * @return {void}
     * @public
     */
    select(key: CrudEntityKey, direction?: MarkerDirection): void {
        this._dispatch(actions.select(key, direction));
    }

    /**
     * Выделить все элементы
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#selectAll
     * @return {void}
     * @public
     */
    selectAll(): void {
        this._dispatch(actions.selectAll());
    }

    /**
     * Сбросить выделение
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#resetSelection
     * @return {void}
     * @public
     */
    resetSelection(): void {
        this._dispatch(actions.resetSelection());
    }

    /**
     * Инвертировать выделение
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#invertSelection
     * @return {void}
     * @public
     */
    invertSelection(): void {
        this._dispatch(actions.invertSelection());
    }

    /**
     * Получить выделение
     * @async
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#getSelection
     * @return {Promise<Controls/interface:ISelectionType#TSelectionRecordContent>}
     * @public
     */
    async getSelection(): Promise<TSelectionRecordContent> {
        return this._sourceController.getSelection();
    }

    /**
     * Сменить корневой элемент
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#changeRoot
     * @param {Types/source:ICrud#CrudEntityKey | null} key
     * @return {void}
     * @public
     */
    changeRoot(key: CrudEntityKey | null): void {
        this._dispatch(actions.changeRoot(key));
    }

    /**
     * Раскрыть узел
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#expand
     * @param {Types/source:ICrud#CrudEntityKey} key
     * @return {void}
     * @public
     */
    expand(key: CrudEntityKey): void {
        this._dispatch(actions.expand(key));
    }

    /**
     * Свернуть узел
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#collapse
     * @param {Types/source:ICrud#CrudEntityKey} key
     * @return {void}
     * @public
     */
    collapse(key: CrudEntityKey): void {
        this._dispatch(actions.collapse(key));
    }

    /**
     * Загрузить следующую страницу
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#next
     * @return {void}
     * @public
     */
    next(): void {
        if (this.state.hasMoreStorage?.[`${this.state.root}`]?.forward !== true) {
            return;
        }
        this._dispatch(actions.next(this._scrollController.getForwardKey()));
    }

    /**
     * Загрузить предыдущую страницу
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#prev
     * @return {void}
     * @public
     */
    prev(): void {
        if (this.state.hasMoreStorage?.[`${this.state.root}`]?.backward !== true) {
            return;
        }
        this._dispatch(actions.prev(this._scrollController.getBackwardKey()));
    }

    /**
     * Открыть панель массовых операций
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#openOperationsPanel
     * @return {void}
     * @public
     */
    openOperationsPanel() {
        super.openOperationsPanel();
        this._dispatch(actions.openOperationsPanel());
    }

    /**
     * Закрыть панель массовых операций
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#closeOperationsPanel
     * @return {void}
     * @public
     */
    closeOperationsPanel() {
        super.closeOperationsPanel();
        this._dispatch(actions.closeOperationsPanel());
        this.resetSelection();
    }

    /**
     * Запустить поиск
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#search
     * @param {string} searchValue
     * @return {void}
     * @public
     */
    search(searchValue: string): void {
        this.setFilter({
            ...this.state.filter,
            [SEARCH_PARAM]: searchValue,
        });
    }

    /**
     * Установить фильтры
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#setFilter
     * @param {Controls/interface:IFilter#TFilter} filter
     * @return {void}
     * @public
     */
    setFilter(filter: TFilter): void {
        this._updateStateWithFilter({
            ...this.state,
            filter,
        });
    }

    /**
     * Открыть окна фильтров
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    openFilterDetailPanel() {
        this._applyState({
            filterDetailPanelVisible: true,
        });
    }

    /**
     * Закрыть окна фильтров
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    closeFilterDetailPanel(): void {
        this._applyState({
            filterDetailPanelVisible: false,
        });
    }

    /**
     * Сбросить поиск с очисткой строки поиска
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#resetSearch
     * @return {void}
     * @public
     */
    resetSearch(): void {
        this.setSearchInputValue('');
        this.resetSearchQuery();
    }

    /**
     * Сбросить параметр поиска. Строка поиска не очищается
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#resetSearchQuery
     * @return {void}
     * @public
     */
    resetSearchQuery(): void {
        const filter = { ...this.state.filter };
        delete filter[SEARCH_PARAM];
        this.setFilter(filter);
    }

    /**
     * Установить значение строки поиска
     * @function Controls-Lists/_dataFactory/ListMobile/Slice#setSearchInputValue
     * @param {string} value
     * @return {void}
     * @public
     */
    setSearchInputValue(value: string): void {
        if (this.state.searchInputValue !== value) {
            this._applyState({
                searchInputValue: value,
            });
        }
    }

    //# endregion API Публичного контроллера

    protected _updateStateWithFilter(nextState: Partial<IListMobileState>): void {
        this._applyState(nextState);
        this._dispatch(actions.setFilter(nextState.filter));
    }

    private _updateListCommandsSelection(state: IListMobileState): void {
        if (isLoaded('Controls/operations')) {
            const selection = loadSync<typeof import('Controls/operations')>(
                'Controls/operations'
            ).getListCommandsSelection(state, state.markedKey);

            // Ключ в наших моделях это поле CI<ident>, в селекшене же отдаются прикладные ключи.
            // Конвертируем
            for (let i = 0; i < selection.selected.length; i++) {
                const selectedItemWithBlKey = state.items.getRecordById(selection.selected[i]);
                if (selectedItemWithBlKey) {
                    selection.selected[i] = selectedItemWithBlKey.get(
                        this._originDataConfig.keyProperty
                    );
                }
            }

            state.listCommandsSelection = selection;
        }
    }
}

function getModelConstructor(modelCfg?: string | Function): typeof Model {
    if (!modelCfg) {
        return Model;
    }

    const model = typeof modelCfg === 'string' ? diResolve(modelCfg) : modelCfg;

    if (typeof model === 'function') {
        return model as typeof Model;
    }

    Logger.error('Controls-Lists/dataFactory:MobileSlice::Неверный тип модели!');

    return Model;
}
