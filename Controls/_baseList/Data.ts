import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_baseList/Data');
import {RegisterClass, RegisterUtil, UnregisterUtil} from 'Controls/event';
import {RecordSet} from 'Types/collection';
import {QueryWhereExpression, PrefetchProxy, ICrud, ICrudPlus, IData, Memory, CrudEntityKey} from 'Types/source';
import {
   error as dataSourceError,
   ISourceControllerOptions,
   NewSourceController as SourceController, Path
} from 'Controls/dataSource';
import {ISourceControllerState} from 'Controls/dataSource';
import { IContextOptionsValue } from 'Controls/context';
import {
   ISourceOptions,
   IHierarchyOptions,
   IFilterOptions,
   INavigationOptions,
   ISortingOptions,
   TKey,
   Direction,
   IErrorControllerOptions
} from 'Controls/interface';
import {SyntheticEvent} from 'UI/Vdom';
import {isEqual} from 'Types/object';

export interface IDataOptions extends IControlOptions,
    ISourceOptions,
    IHierarchyOptions,
    IFilterOptions,
    INavigationOptions<unknown>,
    ISortingOptions,
    IErrorControllerOptions {
   dataLoadErrback?: Function;
   dataLoadCallback?: Function;
   root?: TKey;
   groupProperty?: string;
   groupingKeyCallback?: Function;
   groupHistoryId?: string;
   historyIdCollapsedGroups?: string;
   sourceController?: SourceController;
   expandedItems?: CrudEntityKey[];
   nodeHistoryId?: string;
   processError?: boolean;
}

export interface IDataContextOptions extends ISourceOptions,
    INavigationOptions<unknown>,
    IFilterOptions,
    ISortingOptions {
   keyProperty: string;
   items: RecordSet;
}

interface IReceivedState {
   items?: RecordSet | Error;
   expandedItems?: CrudEntityKey[];
   errorConfig?: dataSourceError.ViewConfig;
}

/**
 * Контрол-контейнер, предоставляющий контекстное поле "dataOptions" с необходимыми данными для дочерних контейнеров.
 *
 * @remark
 * Поле контекста "dataOptions" ожидает Controls/list:Container, который лежит внутри.
 *
 * Полезные ссылки:
 * * {@link /materials/Controls-demo/app/Controls-demo%2FFilterSearch%2FFilterSearch демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/897d41142ed56c25fcf1009263d06508aec93c32/Controls-default-theme/variables/_list.less переменные тем оформления}
 * * {@link Controls/list:Container}
 *
 * @class Controls/_list/Data
 * @mixes Controls/interface:IFilterChanged
 * @mixes Controls/interface:INavigation
 * @mixes Controls/interface:IHierarchy
 * @mixes Controls/interface:ISource
 * @mixes Controls/interface:ISelectFields
 * @extends UI/Base:Control
 *
 * @public
 * @author Герасимов А.М.
 */

/**
 * @name Controls/_list/Data#dataLoadCallback
 * @cfg {Function} Функция, которая вызывается каждый раз после загрузки данных из источника контрола.
 * Функцию можно использовать для изменения данных еще до того, как они будут отображены в контроле.
 * @remark
 * Функцию вызывается с двумя аргументами:
 * - items коллекция, загруженная из источника данных с типом {@link Types/collection:RecordSet}.
 * - direction направление загрузки данных (up/down), данный аргумент передаётся при подгрузке данных по скролу.
 * @example
 * <pre class="brush:html">
 *    <Controls.list:DataContainer dataLoadCallback="{{_myDataLoadCallback}}" />
 * </pre>
 * <pre class="brush:js">
 *    _myDataLoadCallback = function(items) {
 *       items.each(function(item) {
 *          item.set(field, value);
 *       });
 *    }
 * </pre>
 */

/*
 * Container component that provides a context field "dataOptions" with necessary data for child containers.
 *
 * Here you can see a <a href="/materials/Controls-demo/app/Controls-demo%2FFilterSearch%2FFilterSearch">demo</a>.
 *
 * @class Controls/_list/Data
 * @mixes Controls/interface:IFilterChanged
 * @mixes Controls/interface:INavigation
 * @mixes Controls/interface:IHierarchy
 * @mixes Controls/interface:ISource
 * @extends UI/Base:Control
 *
 * @public
 * @author Герасимов А.М.
 */

class Data extends Control<IDataOptions, IReceivedState>/** @lends Controls/_list/Data.prototype */{
   protected _template: TemplateFunction = template;
   protected _contextState: IContextOptionsValue;
   private _isMounted: boolean;
   private _loading: boolean = false;
   private _itemsReadyCallback: Function = null;
   private _loadToDirectionRegister: RegisterClass = null;
   private _sourceController: SourceController = null;
   private _source: ICrudPlus | ICrud & ICrudPlus & IData;
   private _sourceControllerState: ISourceControllerState;
   private _root: TKey = null;

   private _items: RecordSet;
   protected _breadCrumbsItems: Path;
   protected _backButtonCaption: string;
   protected _breadCrumbsItemsWithoutBackButton: Path;
   protected _expandedItems: CrudEntityKey[];
   protected _shouldSetExpandedItemsOnUpdate: boolean;
   protected _errorController: dataSourceError.Controller;
   protected _errorConfig: dataSourceError.ViewConfig;

   private _filter: QueryWhereExpression<unknown>;

   _beforeMount(
       options: IDataOptions,
       context?: object,
       receivedState?: IReceivedState
   ): Promise<IReceivedState>|void {
      this._itemsReadyCallback = this._itemsReadyCallbackHandler.bind(this);
      this._dataLoadCallback = this._dataLoadCallback.bind(this);
      this._notifyNavigationParamsChanged = this._notifyNavigationParamsChanged.bind(this);
      this._errorController = options.errorController || new dataSourceError.Controller({});
      this._loadToDirectionRegister = new RegisterClass({register: 'loadToDirection'});

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

      // TODO filter надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
      this._filter = controllerState.filter;

      if (options.sourceController) {
         // Если контроллер задан выше, чем появилось дерево, то надо установить в него expandedItems из опций
         if (options.expandedItems && !controllerState.expandedItems) {
            options.sourceController.setExpandedItems(options.expandedItems);
         }
         if (!controllerState.dataLoadCallback && options.dataLoadCallback) {
            options.dataLoadCallback(options.sourceController.getItems());
         }
         this._setItemsAndUpdateContext();
      } else if (receivedState?.items instanceof RecordSet) {
         if (options.source && options.dataLoadCallback) {
            options.dataLoadCallback(receivedState.items);
         }
         sourceController.setItems(receivedState.items);
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
                   expandedItems: state.expandedItems
                };
             })
             .catch((error) => {
                if (options.processError) {
                   return this._processError({error}).then((errorConfig) => {
                      this._showError(errorConfig);
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
      RegisterUtil(this, 'dataError', this._onDataError.bind(this));
   }

   protected _beforeUpdate(newOptions: IDataOptions): void|Promise<RecordSet|Error> {
      let updateResult;

      if (this._options.sourceController !== newOptions.sourceController) {
         this._sourceController = newOptions.sourceController;
      }

      if (this._sourceController && (this._sourceController.getItems() !== this._items)) {
         this._items = this._sourceController.getItems();
      }

      if (this._sourceController) {
         if (newOptions.sourceController) {
            updateResult = this._updateWithSourceControllerInOptions(newOptions);
         } else {
            updateResult = this._updateWithoutSourceControllerInOptions(newOptions);
         }
      }

      if (!isEqual(newOptions.expandedItems, this._options.expandedItems) && !newOptions.nodeHistoryId) {
         this._expandedItems = newOptions.expandedItems;
      }

      return updateResult;
   }

   private _initSourceController(options: IDataOptions, receivedState: IReceivedState): void {
      const sourceController = options.sourceController || this._getSourceController(options, receivedState);
      this._sourceController = sourceController;
      this._fixRootForMemorySource(options);
      // Подпишемся на изменение данных хлебных крошек для того, что бы если пользователь
      // руками меняет path в RecordSet то эти изменения долетели до контролов
      sourceController.subscribe('breadcrumbsDataChanged', () => {
         this._updateBreadcrumbsFromSourceController();
      });
      sourceController.subscribe('dataLoadError', (event, error, root, direction) => {
         if (this._isMounted) {
            this._processAndShowError(
                {error, ...this._getErrorConfig(sourceController.getRoot(), root, direction)}
            );
         }
      });
      this._sourceController.subscribe('dataLoad', () => {
         this._hideError();
      });
   }

   _updateWithoutSourceControllerInOptions(newOptions: IDataOptions): void|Promise<RecordSet|Error> {
      let filterChanged;
      let expandedItemsChanged;

      if (this._options.source !== newOptions.source) {
         this._source = newOptions.source;
      }

      if (this._options.root !== newOptions.root) {
         this._root = newOptions.root;
      }

      if (!isEqual(this._options.filter, newOptions.filter)) {
         this._filter = newOptions.filter;
         filterChanged = true;
      }

      if (this._shouldSetExpandedItemsOnUpdate && !isEqual(newOptions.expandedItems, this._options.expandedItems)) {
         expandedItemsChanged = true;
      }

      const isChanged = this._sourceController.updateOptions(this._getSourceControllerOptions(newOptions));

      if (isChanged) {
         return this._reload(newOptions);
      } else if (filterChanged) {
         this._filter = this._sourceController.getFilter();
         this._updateContext(this._sourceController.getState());
      } else if (expandedItemsChanged) {
         if (newOptions.nodeHistoryId) {
            this._sourceController.updateExpandedItemsInUserStorage();
         }
         this._updateContext(this._sourceController.getState());
      }
   }

   _updateWithSourceControllerInOptions(newOptions: IDataOptions): void {
      const sourceControllerState = this._sourceController.getState();

      if (!isEqual(sourceControllerState, this._sourceControllerState) && !this._sourceController.isLoading()) {
         this._filter = sourceControllerState.filter;
         this._items = sourceControllerState.items;
         if (this._shouldSetExpandedItemsOnUpdate) {
            this._expandedItems = sourceControllerState.expandedItems;
         }
         this._updateBreadcrumbsFromSourceController();
         this._updateContext(sourceControllerState);
      }
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
   _expandedItemsChanged(event: SyntheticEvent, expandedItems: CrudEntityKey[]): void {
      // Если передают expandedItems в опции, то expandedItems применим на _beforeUpdate, чтобы прикладник мог повлиять
      if (this._shouldSetExpandedItemsOnUpdate || this._options.hasOwnProperty('expandedItems')) {
         // Обработали событие и стреляем новым, поэтому старое останавливаем. Иначе к прикладнику долетит 2 события:
         // одно от TreeControl, другое от DataContainer. От TreeControl долетит, т.к. DataContainer
         // и например treeGrid:View находятся на одной ноде.
         event.stopPropagation();
         this._notify('expandedItemsChanged', [expandedItems], { bubbling: true });
      } else if (this._expandedItems !== expandedItems) {
         this._sourceController.setExpandedItems(expandedItems);
         if (this._options.nodeHistoryId) {
            this._sourceController.updateExpandedItemsInUserStorage();
         }
         this._updateContext(this._sourceController.getState());
      }
   }

   private _getSourceControllerOptions(options: IDataOptions, receivedState?: object): ISourceControllerOptions {
      if (receivedState?.expandedItems) {
         options.expandedItems = receivedState.expandedItems;
      }
      return {
         ...options,
         source: this._source,
         navigationParamsChangedCallback: this._notifyNavigationParamsChanged,
         filter: this._filter || options.filter,
         root: this._root,
         dataLoadCallback: this._dataLoadCallback
      } as ISourceControllerOptions;
   }

   private _getSourceController(options: IDataOptions, receivedState?: object): SourceController {
      const sourceController = new SourceController(this._getSourceControllerOptions(options, receivedState));
      sourceController.subscribe('rootChanged', this._rootChanged.bind(this));
      return sourceController;
   }

   private _notifyNavigationParamsChanged(params): void {
      if (this._isMounted) {
         this._notify('navigationParamsChanged', [params]);
      }
   }

   _beforeUnmount(): void {
      if (this._loadToDirectionRegister) {
         this._loadToDirectionRegister.destroy();
         this._loadToDirectionRegister = null;
      }
      if (this._sourceController) {
         if (!this._options.sourceController) {
            this._sourceController.destroy();
         }
         this._sourceController = null;
     }
      UnregisterUtil(this, 'dataError');
   }

   _registerHandler(event, registerType, component, callback, config): void {
      this._loadToDirectionRegister.register(event, registerType, component, callback, config);
   }

   _unregisterHandler(event, registerType, component, config): void {
      this._loadToDirectionRegister.unregister(event, component, config);
   }

   _itemsReadyCallbackHandler(items): void {
      if (this._items !== items) {
         this._items = this._sourceController.setItems(items);
         this._updateBreadcrumbsFromSourceController();

         this._contextState = {
            ...this._contextState,
            items: this._items
         };
      }

      if (this._options.itemsReadyCallback) {
         this._options.itemsReadyCallback(items);
      }
   }

   _filterChanged(event, filter): void {
      this._filter = filter;
   }

   _rootChanged(event, root): void {
      const rootChanged = this._root !== root;
      if (this._options.root === undefined) {
         this._root = root;
         // root - не реактивное состояние, надо позвать forceUpdate
         this._forceUpdate();
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

   private _updateContext(sourceControllerState: ISourceControllerState): void {
      this._contextState = {
         ...sourceControllerState
      };
      this._sourceControllerState = sourceControllerState;
      this._expandedItems = sourceControllerState.expandedItems;
   }

   // https://online.sbis.ru/opendoc.html?guid=e5351550-2075-4550-b3e7-be0b83b59cb9
   // https://online.sbis.ru/opendoc.html?guid=c1dc4b23-57cb-42c8-934f-634262ec3957
   private _fixRootForMemorySource(options: IDataOptions): void {
      if (!options.hasOwnProperty('root') &&
          options.source &&
          Object.getPrototypeOf(options.source).constructor === Memory &&
          this._sourceController.getRoot() === null) {
         this._root = undefined;
         this._sourceController.setRoot(undefined);
      }
   }

   private _reload(options: IDataOptions): Promise<RecordSet|Error> {
      const currentRoot = this._sourceController.getRoot();
      this._fixRootForMemorySource(options);

      this._loading = true;
      return this._sourceController.reload()
          .then((reloadResult) => {
             if (!options.hasOwnProperty('root')) {
                this._sourceController.setRoot(currentRoot);
             }
             this._items = this._sourceController.getItems();
             this._updateBreadcrumbsFromSourceController();
             return reloadResult;
          })
          .catch((error) => {
             return this._processAndShowError({error}).then(() => {
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

   private _dataLoadCallback(items: RecordSet, direction: Direction): void {
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
         this._options.dataLoadCallback(items, direction);
      }
   }

   /**
    * На основании текущего состояния sourceController обновляет информацию
    * для хлебных крошек. Так же стреляет событие об изменении данных
    * хлебных крошек.
    */
   private _updateBreadcrumbsFromSourceController(): void {
      const scState = this._sourceController.getState();

      this._breadCrumbsItems = scState.breadCrumbsItems;
      this._backButtonCaption = scState.backButtonCaption;
      this._breadCrumbsItemsWithoutBackButton = scState.breadCrumbsItemsWithoutBackButton;

      this._notifyAboutBreadcrumbsChanged();
   }

   private _notifyAboutBreadcrumbsChanged(): void {
      if (this._isMounted) {
         this._notify('breadCrumbsItemsChanged', [this._breadCrumbsItems]);
      }
   }

   private _onDataError(errorConfig): void {
      if (this._options.processError) {
         this._processAndShowError({
            error: errorConfig.error,
            mode: errorConfig.mode || dataSourceError.Mode.dialog
         });
      }
   }

   private _showError(errorConfig: dataSourceError.ViewConfig): void {
      this._errorConfig = errorConfig;
   }

   private _hideError(): void {
      this._errorConfig = null;
   }

   private _processError(config): Promise<dataSourceError.ViewConfig> {
      if (config.error.canceled || config.error.isCanceled) {
         return Promise.resolve();
      }
      return this._errorController.process({
         error: config.error,
         theme: this._options.theme,
         mode: config.mode || dataSourceError.Mode.include
      }).then((errorConfig) => {
         if (errorConfig && config.templateOptions) {
            Object.assign(errorConfig.options, config.templateOptions);
         }

         return errorConfig as dataSourceError.ViewConfig;
      });
   }

   private _processAndShowError(config: dataSourceError.ViewConfig): Promise<unknown> {
      return this._processError(config).then((errorConfig) => {
         if (errorConfig) {
            this._showError(errorConfig);
         }
         return errorConfig;
      });
   }

   private _getErrorConfig(currentRoot: TKey, root: TKey, direction: Direction): Partial<dataSourceError.ViewConfig> {
      const errorConfig = {
         mode: Data._getErrorViewMode(currentRoot, root, direction),
         templateOptions: {
            showInDirection: direction
         }
      };

      if (direction) {
         errorConfig.templateOptions.action = () => {
            this._loadToDirectionRegister.start('down');
            return Promise.resolve();
         };
      }
      return errorConfig;
   }

   private static _getErrorViewMode(currentRoot?: TKey, root?: TKey, direction?: Direction): dataSourceError.Mode {
      let errorViewMode;

      if (direction && root === currentRoot) {
         errorViewMode = dataSourceError.Mode.inlist;
      } else if (root !== currentRoot) {
         errorViewMode = dataSourceError.Mode.dialog;
      } else {
         errorViewMode = dataSourceError.Mode.include;
      }

      return errorViewMode;
   }

   static getDefaultOptions(): object {
      return {
         filter: {}
      };
   }
}


Object.defineProperty(Data, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return Data.getDefaultOptions();
   }
});


/**
 * @name Controls/_list/Data#root
 * @cfg {Number|String} Идентификатор корневого узла.
 * Значение опции root добавляется в фильтре в поле {@link Controls/_interface/IHierarchy#parentProperty parentProperty}.
 * @example
 * <pre class="brush: js; highlight: [5]">
 * <Controls.list:DataContainer
 *     keyProperty="id"
 *     filter="{{_filter}}"
 *     source="{{_source}}"
 *     root="Сотрудники"/>
 * </pre>
 */

/**
 * @event Происходит при изменении корня иерархии.
 * @name Controls/_list/Data#rootChanged
 * @param event {eventObject} Дескриптор события.
 * @param root {String|Number} Идентификатор корневой записи.
 */

export default Data;
