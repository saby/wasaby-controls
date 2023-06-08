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
 * @implements Controls/interface/IHierarchySearch
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
 * @cfg {Controls/filter:ControllerClass.typedef} Экземпляр класса фильтрации данных Controls/filter:ControllerClass.
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
 *        <Controls.list:Container>
 *           <Controls.list:View/>
 *        </Controls.list:Container>
 * </Controls.browser:Browser>
 * </pre>
 * @see {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ Управление данными для страниц и окон}
 */
