/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Интерфейс опций для контрола "Браузер".
 * @interface Controls/_browser/interface/IBrowser
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IHierarchy
 * @implements Controls/searchDeprecated:IHierarchySearch
 * @implements Controls/interface:ISelectFields
 * @implements Controls/marker:IMarkerList
 * @implements Controls/scroll:IShadows
 * @implements Controls/interface:ISearchValue
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IPromiseSelectable
 * @implements Controls/filter:IPrefetch
 * @implements Controls/interface:INavigation
 * @ignoreOptions searchDelay
 * @public
 */

/**
 * @name Controls/_browser/interface/IBrowser#filterButtonSource
 * @cfg {Array.<Controls/filter:IFilterItem>} Элемент или функция FilterButton, которая возвращает элемент FilterButton.
 */

/**
 * @name Controls/_browser/interface/IBrowser#historyId
 * @cfg {String} Идентификатор, под которым будет сохранена история фильтра.
 */

/**
 * @name Controls/_browser/interface/IBrowser#root
 * @cfg {Number|String} Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy/#parentProperty parentProperty}.
 */

/**
 * @name Controls/_browser/interface/IBrowser#sourceControllerId
 * @cfg {String} Идентификатор, по которому будет получен sourceController из контекста.
 * @remark Опцию следует задавать, если в конексте передаётся несколько sourceController'ов
 */

/**
 * @name Controls/_browser/interface/IBrowser#sourceController
 * @cfg {Controls/dataSource:NewSourceController.typedef} Экземпляр класса загрузчика данных {@link Controls/dataSource:NewSourceController}.
 * @remark
 * Если ваша страница строится на технологии sabyPage, то sourceController необходимо получить из результатов {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/ предзагрузки}.
 */

/**
 * @name Controls/_browser/interface/IBrowser#filterController
 * @cfg {Controls/filterOld:ControllerClass.typedef} Экземпляр класса фильтрации данных Controls/filterOld:ControllerClass.
 * @remark
 * Если ваша страница строится на технологии sabyPage, то filterController необходимо получить из результатов {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/ предзагрузки}.
 */

/**
 * @name Controls/_browser/interface/IBrowser#listActions
 * @cfg {Array<Controls/actions:IListActionOptions>} Набор экшенов для панели массовых операций.
 */

/**
 * @name Controls/_browser/interface/IBrowser#dataStoreId
 * @cfg {String} Уникальный строковый идентификатор, который предназначен для привязки данных.
 * @remark
 * Опцию надо использовать:
 * - когда на странице используются контролы поиска/фильтра, которые связаны со списком с помощью опции storeId. (подробнее: {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ новый механизм работы с данными})
 *
 * Не используйте, если:
 * - контролы поиска/фильтра лежат внутри Browser'a и обернуты в контейнеры
 * - контролы поиска/фильтра связаны со списком с помощью опции useStore
 * @example
 * <pre class="brush: js; highlight: [2, 4]">
 * <Controls-ListEnv.searchConnected:Input
 *      storeId='myDataStore'/>
 * <Controls.browser:Browser
 *     dataStoreId='myDataStore'
 *     source="{{_source}}"
 *     searchParam="title">
 *        <Controls.listDataOld:ListContainer>
 *           <Controls.list:View/>
 *        </Controls.listDataOld:ListContainer>
 * </Controls.browser:Browser>
 * </pre>
 * @see {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ Управление данными для страниц и окон}
 */

/**
 * @name Controls/_browser/interface/IBrowser#historyItems
 * @cfg {Array.<Controls/filter:IFilterItem>>} Заменяет набор последних применненых фильтров из истории.
 * @remark
 * Используется в случае, если требуется переопределить последний примененный фильтр из истории.
 * Если опцию передать как пустой массив, то фильтр из истории не будет применяться.
 * @example
 * В приведенном примере контрол будет загружаться без применения последнего активного фильтра в истории.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.browser:Browser filterDescription="{{_filterDescription}}" historyId="myHistoryId" historyItems="{{[]}}">
 *     ...
 * </Controls.browser:Browser>
 * </pre>
 * <pre class="brush: js;">
 * protected _beforeMount() {
 *     this._filterDescription = [{
 *         id: '1',
 *         resetValue: 'Yaroslavl'
 *     }];
 * }
 * </pre>
 * @see filterButton
 * @see historyId
 */
