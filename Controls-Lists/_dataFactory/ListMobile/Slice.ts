/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListChange } from 'Controls/listAspects';
import type { IListAspects, IListLoadResult } from 'Controls/dataFactory';
import { AbstractListSlice, ISliceWithSelection } from 'Controls/dataFactory';
import type { TKey, TFilter, TSelectionRecordContent } from 'Controls/interface';
import { IListMobileState } from './_interface/IListMobileTypes';
import type { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';
import { ListMobileSource } from './_source/ListMobileSource';
import { SourceController } from './_sourceController/SourceController';
import { ScrollController } from './_scrollController/ScrollController';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { VirtualCollection } from './_virtualCollection/VirtualCollection';
import { resolve as diResolve } from 'Types/di';
import { Model } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

import type { TListMobileMiddleware } from './types/TListMobileMiddleware';
import type { TListMobileMiddlewareContextGetter } from './types/TListMobileMiddlewareContext';
import { rpcWorkerMiddleware } from './middlewares/rpcWorker';
import { rpcEventsMiddleware } from './middlewares/rpcEvents';
import { rpcInvokeMiddleware } from './middlewares/rpcInvoke';
import { extraLogicMiddleware } from './middlewares/extraLogic';

import { TAbstractAction, TAbstractMiddlewareContext } from 'Controls-DataEnv/dispatcher';
import { TListMobileActions, ListMobileActionCreators } from './actions';

const SEARCH_PARAM = 'SearchString';

type TAction = TListMobileActions.TAnyListMobileAction | TAbstractAction;

const MIDDLEWARES: TListMobileMiddleware[] = [
    rpcWorkerMiddleware,
    rpcEventsMiddleware,
    rpcInvokeMiddleware,
    extraLogicMiddleware,
];

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
    extends AbstractListSlice<
        IListMobileState,
        TAction,
        TAbstractMiddlewareContext<IListMobileState, TAction>
    >
    implements ISliceWithSelection
{
    readonly '[IListSlice]': boolean = true;
    readonly '[ISliceWithSelection]' = true;

    private _connectionCount: number = 0;

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
            collectionStorageEndpoint: initConfig.collectionStorageEndpoint,
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
            ...super._initState(loadResult, initConfig),
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

        this._onAfterInitState(state);

        this._initAspects(initConfig.collectionType, {
            ...state,
            collection: state.collection,
        });

        this._scrollController = new ScrollController()
            .setCollection(() => this.state.collection || state.collection)
            .setSourceController(() => this._sourceController);

        this._virtualCollection = new VirtualCollection({
            model: getModelConstructor(initConfig.model),
            ...this._originDataConfig,
            _getSearchValue: () => this.state.searchInputValue,
        });

        return state;
    }

    protected _getMiddlewares() {
        return [
            ...MIDDLEWARES,
            ({ dispatch }) =>
                (next) =>
                async (action) => {
                    if (action.type === 'beforeApplyState' && action.payload.actionsToDispatch) {
                        for (const _action of action.payload.actionsToDispatch.values()) {
                            await dispatch(_action);
                        }
                    }
                    next(action);
                },
        ];
    }

    protected _getMiddlewaresContext() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const applyChanges = this._applyChanges.bind(this);

        return {
            get collection() {
                return self.state.collection;
            },
            get virtualCollection() {
                return self._virtualCollection;
            },
            get sourceController() {
                return self._sourceController;
            },
            get scrollController() {
                return self._scrollController;
            },
            scheduleDispatch: (action) => {
                this._addAction(action);
            },
            get applyChanges() {
                return applyChanges;
            },
        } as ReturnType<TListMobileMiddlewareContextGetter>;
    }

    protected _beforeApplyState(nextState: IListMobileState): Promise<IListMobileState> {
        return super._beforeApplyStateNew(nextState);
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

        super.connect();
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
            this._addAction(ListMobileActionCreators.interactorCore.disconnect());
        }
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
    changeRoot(key: TKey): void {
        const parentProperty = this.state.parentProperty;

        // кнопку назад
        if (this.state.backButtonItem && this.state.backButtonItem.get(parentProperty) === key) {
            this._dispatcher.dispatch(ListMobileActionCreators.root.moveFromRoot(key));
            return;
        }
        // переход по хлебным крошкам
        const clickedBreadCrumb = this.state?.breadCrumbsItems?.find(
            (item) => item.getKey() === key
        );
        if (clickedBreadCrumb) {
            const record = clickedBreadCrumb.getRawData().originalItem;
            this._dispatcher.dispatch(ListMobileActionCreators.root.moveToRootByItem(record));
            return;
        }
        // проваливание внутрь узла списка
        this._dispatcher.dispatch(ListMobileActionCreators.root.moveFromRoot(key));
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

    resetSearch(): void {
        this.setSearchInputValue('');
        this.resetSearchQuery();
    }

    setFilter(filter: TFilter): void {
        this._updateStateWithFilter({
            ...this.state,
            filter,
        });
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
        this._dispatcher.dispatch(ListMobileActionCreators.filter.setFilter(nextState.filter));
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
