/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ISliceWithSelection } from 'Controls/dataFactory';
import type { TKey, TFilter, TSelectionRecordContent } from 'Controls/interface';
import type { IListMobileState } from './interface/IListMobileState';
import type { IListMobileDataFactoryArguments } from './interface/factory/IListMobileDataFactoryArguments';
import { ListMobileSource } from './_source/ListMobileSource';
import { SourceController } from './_sourceController/SourceController';
import { ScrollController } from './_scrollController/ScrollController';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { VirtualCollection } from './_virtualCollection/VirtualCollection';
import { resolve as diResolve } from 'Types/di';
import { Model } from 'Types/entity';
import { Logger } from 'UICommon/Utils';

import {
    AbstractListSlice,
    IAbstractListDataFactoryLoadResult,
    TListMiddlewareContextExtension,
} from 'Controls-DataEnv/abstractList';

import type { TListMobileMiddleware } from './types/TListMobileMiddleware';
import { TListMobileMiddlewareContext } from './types/TListMobileMiddlewareContext';
import { rpcWorkerMiddleware } from './middlewares/rpcWorker';
import { rpcEventsMiddleware } from './middlewares/rpcEvents';
import { rpcInvokeMiddleware } from './middlewares/rpcInvoke';
import { applyStateMiddleware } from './middlewares/applyState';
import {
    itemsMiddleware,
    itemActionsMiddleware,
    operationsPanelMiddleware,
    highlightFieldsMiddleware,
    stubMiddleware,
} from 'Controls-DataEnv/list';
import type { IFilterDescriptionItem } from 'Controls/filter';
import { calculateFilterByFilterDescription } from './utils/calculateFilterByFilterDescription';
import { getFilterModuleSync } from './utils/getFilterModuleSync';

import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { TListMobileActions, ListMobileActionCreators } from './actions';

const SEARCH_PARAM = 'SearchString';

type TAction = TListMobileActions.TAnyListMobileAction | TAbstractAction;

const MIDDLEWARES: TListMobileMiddleware[] = [
    rpcWorkerMiddleware,
    rpcEventsMiddleware,
    rpcInvokeMiddleware,
    applyStateMiddleware,
    itemsMiddleware,
    itemActionsMiddleware,
    operationsPanelMiddleware,
    highlightFieldsMiddleware,
    stubMiddleware,
];

/**
 * Класс, реализующий мобильный слайс списка.
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}
 * @class Controls-Lists/_dataFactory/ListMobile/Slice
 * @extends Controls-DataEnv/slice:AbstractSlice
 * @see Controls-ListEnv
 * @public
 */
// TODO: Вынести ISliceWithSelection в абстрактный списочный слайс, когда ПМО будет готово к этому.
//  https://online.sbis.ru/opendoc.html?guid=5165af79-4171-44b6-9e62-29b41a304d39&client=3
export class ListMobileSlice
    extends AbstractListSlice<IListMobileState, TAction, TListMobileMiddlewareContext>
    implements ISliceWithSelection
{
    readonly '[IListSlice]': boolean = true;
    readonly '[ISliceWithSelection]' = true;

    private _connectionCount: number = 0;

    private _sourceController: SourceController;
    private _scrollController: ScrollController;
    private _virtualCollection: VirtualCollection;

    private _originDataConfig: Pick<
        IListMobileDataFactoryArguments,
        'keyProperty' | 'parentProperty' | 'nodeProperty' | 'displayProperty'
    >;

    protected _initState(
        loadResult: IAbstractListDataFactoryLoadResult,
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
            // Из абстрактного, надо доразобраться
            header: initConfig.header,
            columns: initConfig.columns,
            itemActionVisibilityCallback: initConfig.itemActionVisibilityCallback,
            stickyHeader: initConfig.stickyHeader,
            headerVisibility: initConfig.headerVisibility,
            rowSeparatorSize: initConfig.rowSeparatorSize,
            rowSeparatorVisibility: initConfig.rowSeparatorVisibility,
            emptyView: initConfig.emptyView,
            emptyTemplate: initConfig.emptyTemplate,
            emptyTemplateOptions: initConfig.emptyTemplateOptions,
            emptyViewConfig: initConfig.emptyViewConfig,

            ...super._initState(loadResult, {
                ...initConfig,
                items: loadResult.items,
                keyProperty: ExternalCollectionItemKeys.ident,
                parentProperty: ExternalCollectionItemKeys.parent,
                nodeProperty: ExternalCollectionItemKeys.node_type,
            }),

            countLoading: false,
            isAllSelected: false,
            backButtonCaption: '',
            backButtonItem: undefined,
            breadCrumbsItems: [],
            breadCrumbsItemsWithoutBackButton: [],
            hasMoreStorage: undefined,
            selectionType: initConfig.selectionType,
            data: loadResult.items,
            sorting: initConfig.sorting,
            selectFields: initConfig.selectFields,
            historyId: initConfig.historyId,
            navigation: initConfig.navigation,
            listConfigStoreId: initConfig.listConfigStoreId,
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
            // Нет предзагрузки данных, поэтому судить о необходимости отображения пустого представления на initState нельзя
            // Состояние будет пересчитано в рамках мидлвары при установке загруженных items
            needShowStub: false,
        };

        this._onAfterInitState(state);

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

    protected _getMiddlewares(): TListMobileMiddleware[] {
        return [
            ...MIDDLEWARES,
            ({ dispatch, setState, getState }) =>
                (next) =>
                async (action) => {
                    switch (action.type) {
                        case 'startUpdate': {
                            const { actions } = action.payload;

                            for (const _action of actions) {
                                await dispatch(_action);
                            }

                            setState(getState());
                            break;
                        }
                        case 'beforeApplyState': {
                            setState(action.payload.nextState);
                        }
                    }
                    next(action);
                },
        ];
    }

    protected _getMiddlewaresContextExtension(): TListMiddlewareContextExtension<
        IListMobileState,
        TAction,
        TListMobileMiddlewareContext
    > {
        return {
            virtualCollection: this._virtualCollection,
            sourceController: this._sourceController,
            scrollController: this._scrollController,
            originDataConfig: this._originDataConfig,
            snapshots: new Map(),
        };
    }

    //# region API Публичного контроллера

    connect(): void {
        if (this._connectionCount === 0) {
            this._connectionCount++;
        } else {
            return;
        }

        super.connect();
    }

    disconnect(): void {
        this._connectionCount = Math.max(this._connectionCount - 1, 0);
        if (this._connectionCount === 0) {
            this._dispatcher.dispatch(ListMobileActionCreators.interactorCore.disconnect());
            // дисконнект должен происходить синхронно, поскольку при разрушении слайса
            // dispatch не доведет экшен до мидлвары
            this._sourceController.disconnect();
        }
    }

    async getSelection(): Promise<TSelectionRecordContent> {
        return this._sourceController.getSelection();
    }

    changeRoot(key: TKey): void {
        const parentProperty = this.state.parentProperty;

        // кнопку назад
        if (this.state.backButtonItem && this.state.backButtonItem.get(parentProperty) === key) {
            this._addAction(ListMobileActionCreators.root.moveFromRoot(key));
            return;
        }
        // переход по хлебным крошкам
        const clickedBreadCrumb = this.state?.breadCrumbsItems?.find(
            (item) => item.getKey() === key
        );
        if (clickedBreadCrumb) {
            const record = clickedBreadCrumb.getRawData().originalItem;
            this._addAction(ListMobileActionCreators.root.moveToRootByItem(record));
            return;
        }
        // проваливание внутрь узла списка
        this._addAction(ListMobileActionCreators.root.moveIntoRoot(key));
    }

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

    applyFilterDescription(
        filterDescription: IFilterDescriptionItem[],
        newState?: Partial<IListMobileState>,
        appliedFrom?: string
    ): IFilterDescriptionItem[] | void {
        const nextState = calculateFilterByFilterDescription(
            this.state,
            filterDescription,
            newState,
            appliedFrom
        );
        if (nextState?.filterDescription) {
            this._updateStateWithFilter(nextState);
        }
        return nextState?.filterDescription;
    }

    resetFilterDescription(): void {
        const { resetFilterDescription } = getFilterModuleSync().FilterDescription;
        const newFilterDescription = resetFilterDescription(
            this.state.filterDescription ?? [],
            true
        );
        this.applyFilterDescription(newFilterDescription);
    }

    executeCommand(): void {}

    setSelectionViewMode(selectionViewMode: string): void {
        this._addAction(
            ListMobileActionCreators.operationsPanel.setSelectionViewMode(selectionViewMode)
        );
    }
    //# endregion API Публичного контроллера

    protected _updateStateWithFilter(nextState: Partial<IListMobileState>): void {
        this._applyState(nextState);
        this._addAction(ListMobileActionCreators.filter.setFilter(nextState.filter));
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
