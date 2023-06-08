/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_baseList/Data/DataInner');
import { IDataOptions } from '../interface/IDataOptions';
import { RegisterClass, RegisterUtil, UnregisterUtil } from 'Controls/event';
import { RecordSet } from 'Types/collection';
import {
    QueryWhereExpression,
    PrefetchProxy,
    ICrud,
    ICrudPlus,
    IData,
    Memory,
    CrudEntityKey,
} from 'Types/source';
import {
    ISourceControllerState,
    ISourceControllerOptions,
    NewSourceController as SourceController,
    Path,
} from 'Controls/dataSource';
import { IContextOptionsValue } from 'Controls/context';
import {
    ISourceOptions,
    IFilterOptions,
    INavigationOptions,
    ISortingOptions,
    TKey,
    Direction,
    INavigationSourceConfig,
} from 'Controls/interface';
import {
    ErrorViewMode,
    ErrorViewConfig,
    ErrorController,
    process,
} from 'Controls/error';
import { SyntheticEvent } from 'UI/Vdom';
import { isEqual } from 'Types/object';
import {
    TErrorQueryConfig,
    getErrorConfig as getErrorConfigHelper,
    processError as processErrorHelper,
} from 'Controls/_baseList/Error/errorHelpers';

export interface IDataContextOptions
    extends ISourceOptions,
        INavigationOptions<unknown>,
        IFilterOptions,
        ISortingOptions {
    keyProperty: string;
    items: RecordSet;
}

interface IReceivedState {
    items?: RecordSet | Error;
    expandedItems?: CrudEntityKey[];
    errorConfig?: ErrorViewConfig;
}

export default class Data extends Control<IDataOptions, IReceivedState> {
    protected _template: TemplateFunction = template;
    protected _contextState: IContextOptionsValue;
    private _isMounted: boolean;
    private _loading: boolean = false;
    private _loadToDirectionRegister: RegisterClass = null;
    private _sourceController: SourceController = null;
    private _source: ICrudPlus | (ICrud & ICrudPlus & IData);
    private _sourceControllerState: ISourceControllerState;
    private _root: TKey = null;

    private _items: RecordSet;
    protected _breadCrumbsItems: Path;
    protected _backButtonCaption: string;
    protected _breadCrumbsItemsWithoutBackButton: Path;
    protected _expandedItems: CrudEntityKey[];
    protected _shouldSetExpandedItemsOnUpdate: boolean;
    protected _errorController: ErrorController;
    protected _errorConfig: ErrorViewConfig;

    private _filter: QueryWhereExpression<unknown>;

    protected _onExpandedItemsChanged: Function = (expandedItems) => {
        return this._expandedItemsChanged(null, expandedItems);
    };

    _beforeMount(
        options: IDataOptions,
        context?: object,
        receivedState?: IReceivedState
    ): Promise<IReceivedState> | void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._notifyNavigationParamsChanged =
            this._notifyNavigationParamsChanged.bind(this);
        this._onDataLoad = this._onDataLoad.bind(this);
        this._onDataLoadError = this._onDataLoadError.bind(this);
        this._dataLoadStart = this._dataLoadStart.bind(this);
        this._updateBreadcrumbsFromSourceController =
            this._updateBreadcrumbsFromSourceController.bind(this);
        this._errorController =
            options.errorController || new ErrorController({});
        this._loadToDirectionRegister = new RegisterClass({
            register: 'loadToDirection',
        });

        if (options.expandedItems) {
            this._shouldSetExpandedItemsOnUpdate = true;
        }

        if (receivedState && options.source instanceof PrefetchProxy) {
            this._source = options.source.getOriginal();
        } else {
            this._source = options.source;
        }

        if (options.root !== undefined) {
            this._root = options.root;
        }
        this._initSourceController(options, receivedState);
        const sourceController = this._sourceController;
        const controllerState = sourceController.getState();
        const items =
            receivedState?.items instanceof RecordSet
                ? receivedState.items
                : null;

        // TODO filter надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        this._filter = controllerState.filter;

        if (options.sourceController) {
            // Если контроллер задан выше, чем появилось дерево, то надо установить в него expandedItems из опций
            if (options.expandedItems && !controllerState.expandedItems) {
                options.sourceController.setExpandedItems(
                    options.expandedItems
                );
            }
            if (
                options.sourceController.getLoadError() &&
                options.processError
            ) {
                this._updateContext(controllerState);
                return this._processAndShowError(
                    { error: options.sourceController?.getLoadError() },
                    {},
                    options.theme
                );
            } else {
                if (
                    !controllerState.dataLoadCallback &&
                    options.dataLoadCallback
                ) {
                    options.dataLoadCallback(
                        options.sourceController.getItems()
                    );
                }
                this._setItemsAndUpdateContext();
            }
        } else if (items) {
            if (options.source && options.dataLoadCallback) {
                options.dataLoadCallback(items);
            }
            sourceController.setItems(items);
            this._setItemsAndUpdateContext();
        } else if (receivedState?.errorConfig) {
            this._showError(receivedState.errorConfig);
        } else if (options.source) {
            return sourceController
                .reload(undefined, true)
                .then((items) => {
                    const state = sourceController.getState();
                    this._items = state.items;
                    this._updateBreadcrumbsFromSourceController();

                    return {
                        items,
                        expandedItems: state.expandedItems,
                    };
                })
                .catch((error) => {
                    if (options.processError) {
                        return this._processAndShowError(
                            { error },
                            {},
                            options.theme
                        ).then((errorConfig) => {
                            return { errorConfig };
                        });
                    } else {
                        return error;
                    }
                })
                .finally(() => {
                    this._updateContext(sourceController.getState());
                });
        } else {
            this._updateContext(controllerState);
        }
    }

    protected _afterMount(): void {
        this._isMounted = true;

        // После монтирования пошлем событие о изменении хлебных крошек для того,
        // что бы эксплорер заполнил свое состояние, которое завязано на хлебные крошки
        this._notifyAboutBreadcrumbsChanged();
        RegisterUtil(this, 'dataError', this._onDataError.bind(this, null));
    }

    protected _afterUpdate(): void {
        // Чтобы при повторном возникновении ошибки снова показался диалог
        if (this._errorConfig?.mode === 'dialog') {
            this._hideError();
        }
    }

    protected _beforeUpdate(
        newOptions: IDataOptions
    ): void | Promise<RecordSet | Error> {
        let updateResult;
        const { sourceController, expandedItems, loading } = newOptions;
        const isSourceControllerChanged =
            this._options.sourceController !== sourceController;
        let currentSourceController = this._sourceController;

        if (isSourceControllerChanged) {
            this._sourceController = sourceController;
            this._initSourceController(newOptions);
            currentSourceController = this._sourceController;

            if (!this._sourceController?.getLoadError() && this._errorConfig) {
                this._hideError();
            }
        }

        if (sourceController && this._options.loading !== loading) {
            this._loading = loading;
        }

        if (
            currentSourceController &&
            currentSourceController.getItems() !== this._items
        ) {
            this._items = currentSourceController.getItems();
            this._updateBreadcrumbsFromSourceController();
        }

        if (currentSourceController) {
            // !!isSourceControllerFromContext При переходе на React люди стали передавать sourceController напрямую списку
            // DataContainer вставлен в список ипри передаче sourceController'a работал как proxy для опций и не реагировал
            // на изменение опций фильтра, сурса и т.д., т.к. ожидалось, что вверху есть Browser, который этим занимается
            // Теперь же sourceController может передаваться и без Browser'a сверху, но на изменение опций надо реагировать
            if (sourceController && newOptions.isSourceControllerFromContext) {
                updateResult = this._updateWithSourceControllerInOptions();
            } else if (!isSourceControllerChanged || !sourceController) {
                updateResult =
                    this._updateWithoutSourceControllerInOptions(newOptions);
            } else {
                this._updateBySourceControllerState(
                    currentSourceController.getState()
                );
            }
        }

        if (
            !isEqual(expandedItems, this._options.expandedItems) &&
            !newOptions.nodeHistoryId
        ) {
            this._expandedItems = expandedItems;
        }

        return updateResult;
    }

    private _initSourceController(
        options: IDataOptions,
        receivedState?: IReceivedState
    ): void {
        const sourceController =
            options.sourceController ||
            this._getSourceController(options, receivedState);
        this._sourceController = sourceController;
        this._fixRootForMemorySource(options);
        // Подпишемся на изменение данных хлебных крошек для того, что бы если пользователь
        // руками меняет path в RecordSet то эти изменения долетели до контролов
        this._toggleSourceControllerEvents(true);
    }

    private _toggleSourceControllerEvents(subscribe: boolean): void {
        const methodName = subscribe ? 'subscribe' : 'unsubscribe';
        const sourceController = this._sourceController;

        sourceController[methodName](
            'breadcrumbsDataChanged',
            this._updateBreadcrumbsFromSourceController
        );
        sourceController[methodName]('dataLoadError', this._onDataLoadError);
        sourceController[methodName]('dataLoad', this._onDataLoad);
        sourceController[methodName]('dataLoadStarted', this._dataLoadStart);
    }

    _updateWithoutSourceControllerInOptions(
        newOptions: IDataOptions
    ): void | Promise<RecordSet | Error> {
        const sourceController = this._sourceController;
        const { root, source, filter } = newOptions;
        const sourceChanged = this._options.source !== source;
        let filterChanged;
        let expandedItemsChanged;

        if (sourceChanged) {
            this._source = source;
        }

        if (this._options.root !== root) {
            this._root = root;
        }

        if (!isEqual(this._options.filter, filter)) {
            this._filter = filter;
            filterChanged = true;
        }

        if (
            this._shouldSetExpandedItemsOnUpdate &&
            !isEqual(newOptions.expandedItems, this._options.expandedItems)
        ) {
            expandedItemsChanged = true;
        }

        let newSource;
        if (sourceChanged) {
            newSource = source;
        } else if (sourceController.getSource() !== newOptions.source) {
            newSource = this._getOriginalSource(newOptions);
        } else {
            newSource = source;
        }

        const isChanged = sourceController.updateOptions({
            ...this._getSourceControllerOptions(newOptions),
            source: newSource,
        });
        const sourceControllerState = sourceController.getState();

        if (isChanged && this._source) {
            return this._reload(newOptions);
        } else if (filterChanged) {
            this._filter = sourceController.getFilter();
            this._updateContext(sourceControllerState);
        } else if (expandedItemsChanged) {
            if (newOptions.nodeHistoryId) {
                sourceController.updateExpandedItemsInUserStorage();
            }
            this._updateContext(sourceControllerState);
        } else if (isChanged) {
            this._updateBySourceControllerState(sourceControllerState);
        }
    }

    _updateWithSourceControllerInOptions(): void {
        if (
            this._isSourceControllerStateChanged() &&
            !this._sourceController.isLoading()
        ) {
            this._updateBySourceControllerState(
                this._sourceController.getState()
            );
        }
    }

    _isSourceControllerStateChanged(): boolean {
        return !isEqual(
            this._sourceController.getState(),
            this._sourceControllerState
        );
    }

    _updateBySourceControllerState(
        sourceControllerState: ISourceControllerState
    ): void {
        this._filter = sourceControllerState.filter;
        this._items = sourceControllerState.items;
        if (this._shouldSetExpandedItemsOnUpdate) {
            this._expandedItems = sourceControllerState.expandedItems;
        }
        this._updateBreadcrumbsFromSourceController();
        this._updateContext(sourceControllerState);
    }

    _setItemsAndUpdateContext(): void {
        const controllerState = this._sourceController.getState();
        // TODO items надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        this._items = controllerState.items;
        this._updateBreadcrumbsFromSourceController();
        this._updateContext(controllerState);
    }

    // Необходимо отслеживать оба события, т.к. не всегда оборачивают список в List:Container,
    // и dataContainer слушает напрямую список. Для нового грида это работает, а старый через модель сам
    // посылает события.
    _expandedItemsChanged(
        event: SyntheticEvent,
        expandedItems: CrudEntityKey[]
    ): void {
        // Если передают expandedItems в опции, то expandedItems применим на _beforeUpdate, чтобы прикладник мог повлиять
        if (
            this._shouldSetExpandedItemsOnUpdate ||
            this._options.hasOwnProperty('expandedItems')
        ) {
            // Обработали событие и стреляем новым, поэтому старое останавливаем. Иначе к прикладнику долетит 2 события:
            // одно от TreeControl, другое от DataContainer. От TreeControl долетит, т.к. DataContainer
            // и например treeGrid:View находятся на одной ноде.
            event?.stopPropagation();
            this._notify('expandedItemsChanged', [expandedItems], {
                bubbling: true,
            });
        } else if (this._expandedItems !== expandedItems) {
            this._sourceController.setExpandedItems(expandedItems);
            if (this._options.nodeHistoryId) {
                this._sourceController.updateExpandedItemsInUserStorage();
            }
            this._updateContext(this._sourceController.getState());
        }
    }

    private _getSourceControllerOptions(
        options: IDataOptions,
        receivedState?: object
    ): ISourceControllerOptions {
        if (receivedState?.expandedItems) {
            options.expandedItems = receivedState.expandedItems;
        }
        return {
            ...options,
            source: this._source,
            navigationParamsChangedCallback:
                this._notifyNavigationParamsChanged,
            filter: this._filter || options.filter,
            root: this._root,
            dataLoadCallback: this._dataLoadCallback,
        } as ISourceControllerOptions;
    }

    private _getSourceController(
        options: IDataOptions,
        receivedState?: object
    ): SourceController {
        const sourceController = new SourceController(
            this._getSourceControllerOptions(options, receivedState)
        );
        sourceController.subscribe('rootChanged', this._rootChanged.bind(this));
        return sourceController;
    }

    private _notifyNavigationParamsChanged(params: object): void {
        if (this._isMounted) {
            this._notify('navigationParamsChanged', [params]);
        }
    }

    // TODO https://online.sbis.ru/opendoc.html?guid=5f388a43-e529-464a-8e81-3e441ebcbb83&client=3
    protected _$react_componentWillUnmount(): void {
        this._unmount();
    }

    protected _beforeUnmount(): void {
        this._unmount();
    }

    private _unmount(): void {
        if (this._wasUnmount) {
            return;
        }
        this._wasUnmount = true;

        if (this._loadToDirectionRegister) {
            this._loadToDirectionRegister.destroy();
            this._loadToDirectionRegister = null;
        }
        if (this._sourceController) {
            this._toggleSourceControllerEvents(false);
            if (!this._options.sourceController) {
                this._sourceController.destroy();
            }
            this._sourceController = null;
        }
        UnregisterUtil(this, 'dataError');
    }

    _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void {
        this._loadToDirectionRegister.register(
            event,
            registerType,
            component,
            callback,
            config
        );
    }

    _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        config: object
    ): void {
        this._loadToDirectionRegister.unregister(event, component, config);
    }

    _filterChanged(
        event: SyntheticEvent,
        filter: QueryWhereExpression<unknown>
    ): void {
        this._filter = filter;
    }

    _rootChanged(event: SyntheticEvent, root: TKey): void {
        let rootChanged;
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        if (this._options.root === undefined) {
            rootChanged = this._root !== root;
            this._root = root;
            // root - не реактивное состояние, надо позвать forceUpdate
            this._forceUpdate();
        } else {
            rootChanged = this._options.root !== root;
        }
        if (rootChanged) {
            this._notify('rootChanged', [root]);
        }
    }

    // TODO сейчас есть подписка на itemsChanged из поиска. По хорошему не должно быть.
    _itemsChanged(event: SyntheticEvent, items: RecordSet): void {
        this._sourceController.cancelLoading();
        this._items = this._sourceController.setItems(items);
        this._updateBreadcrumbsFromSourceController();
        this._updateContext(this._sourceController.getState());
        event.stopPropagation();
    }

    private _dataLoadStart(event: SyntheticEvent, direction: Direction): void {
        if (!direction && !this._destroyed) {
            this._loading = true;
        }
    }

    private _updateContext(
        sourceControllerState: ISourceControllerState
    ): void {
        this._contextState = {
            ...sourceControllerState,
        };
        this._sourceControllerState = sourceControllerState;
        this._expandedItems = sourceControllerState.expandedItems;
    }

    // https://online.sbis.ru/opendoc.html?guid=e5351550-2075-4550-b3e7-be0b83b59cb9
    // https://online.sbis.ru/opendoc.html?guid=c1dc4b23-57cb-42c8-934f-634262ec3957
    private _fixRootForMemorySource(options: IDataOptions): void {
        if (
            !options.hasOwnProperty('root') &&
            options.source &&
            options.parentProperty &&
            Object.getPrototypeOf(options.source).constructor === Memory &&
            this._sourceController.getRoot() === null
        ) {
            this._root = undefined;
            this._sourceController.setRoot(undefined);
        }
    }

    private _reload(
        options: IDataOptions,
        config?: INavigationSourceConfig
    ): Promise<RecordSet | Error> {
        const currentRoot = this._sourceController.getRoot();
        this._fixRootForMemorySource(options);

        return this._sourceController
            .reload(config)
            .then((reloadResult) => {
                if (!options.hasOwnProperty('root')) {
                    this._sourceController.setRoot(currentRoot);
                }
                this._items = this._sourceController.getItems();
                this._updateBreadcrumbsFromSourceController();
                return reloadResult;
            })
            .catch((error) => {
                return this._processAndShowError({ error }).then(() => {
                    return error;
                });
            })
            .finally(() => {
                if (!this._destroyed) {
                    const controllerState = this._sourceController.getState();
                    this._updateContext(controllerState);
                    this._loading = false;
                }
            });
    }

    private _dataLoadCallback(
        items: RecordSet,
        direction: Direction,
        id?: string,
        navigation?: INavigationSourceConfig
    ): void {
        if (this._destroyed) {
            return;
        }

        const rootChanged =
            this._sourceController.getRoot() !== undefined &&
            this._root !== this._sourceController.getRoot();
        const needUpdateStateAfterLoad = rootChanged || this._loading;

        if (rootChanged) {
            this._sourceController.setRoot(this._root);
        }

        if (needUpdateStateAfterLoad) {
            const controllerState = this._sourceController.getState();
            this._updateContext(controllerState);
        }

        if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback(items, direction, id, navigation);
        }
    }

    /**
     * На основании текущего состояния sourceController обновляет информацию
     * для хлебных крошек. Так же стреляет событие об изменении данных
     * хлебных крошек.
     */
    private _updateBreadcrumbsFromSourceController(): void {
        const scState = this._sourceController.getState();

        // Если данные те же самые, то и незачем повторно пулять событие
        if (this._breadCrumbsItems === scState.breadCrumbsItems) {
            return;
        }

        this._breadCrumbsItems = scState.breadCrumbsItems;
        this._backButtonCaption = scState.backButtonCaption;
        this._breadCrumbsItemsWithoutBackButton =
            scState.breadCrumbsItemsWithoutBackButton;

        this._notifyAboutBreadcrumbsChanged();
    }

    private _notifyAboutBreadcrumbsChanged(): void {
        if (this._isMounted) {
            this._notify('breadCrumbsItemsChanged', [this._breadCrumbsItems]);
        }
    }

    private _onDataError(
        event: SyntheticEvent,
        errorConfig: ErrorViewConfig
    ): void {
        event?.stopPropagation();

        if (errorConfig?.mode) {
            this._processAndShowError(
                {
                    error: errorConfig.error,
                    mode: errorConfig.mode || ErrorViewMode.dialog,
                },
                {},
                this._options.theme
            );
        } else {
            process(errorConfig);
        }
    }

    private _onDataLoad(
        event: SyntheticEvent,
        result: RecordSet,
        direction: Direction
    ): void {
        this._loading = false;
        this._hideError();

        if (
            this._options.sourceController &&
            direction &&
            this._isSourceControllerStateChanged()
        ) {
            this._updateBySourceControllerState(
                this._sourceController.getState()
            );
        }
    }

    private _getOriginalSource(
        options: IDataOptions
    ): ICrudPlus | (ICrud & ICrudPlus & IData) {
        let source;

        if (options.source instanceof PrefetchProxy) {
            source = options.source.getOriginal();
        } else {
            source = options.source;
        }

        return source;
    }

    private _onDataLoadError(
        event: SyntheticEvent,
        error: Error,
        root: TKey,
        direction: Direction
    ): void {
        if (this._isMounted) {
            this._processAndShowError(
                { error },
                {
                    root: this._sourceController.getRoot(),
                    loadKey: root,
                    direction,
                }
            );
            this._loading = false;
        }
    }

    private _showError(errorConfig: ErrorViewConfig): void {
        this._errorConfig = errorConfig;
    }

    private _hideError(): void {
        this._errorConfig = null;
    }

    private _processAndShowError(
        config: ErrorViewConfig,
        queryConfig: TErrorQueryConfig = {},
        theme: string = this._options.theme
    ): Promise<unknown> {
        const errConfig = this._getErrorConfig(queryConfig);
        return processErrorHelper(
            this._errorController,
            { ...config, ...errConfig },
            theme
        ).then((errorConfig) => {
            if (errorConfig) {
                this._showError(errorConfig);
            }
            return errorConfig;
        });
    }

    private _getErrorConfig(
        queryConfig: TErrorQueryConfig
    ): Partial<ErrorViewConfig> {
        const errorConfig = getErrorConfigHelper(queryConfig);

        if (queryConfig.direction && queryConfig.root === queryConfig.loadKey) {
            errorConfig.templateOptions.action = () => {
                this._loadToDirectionRegister.start('down');
                return Promise.resolve();
            };
        }
        return errorConfig;
    }

    reload(config?: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._reload(this._options, config);
    }

    static getDefaultOptions(): object {
        return {
            filter: {},
        };
    }
}
