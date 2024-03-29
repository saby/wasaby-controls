/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { TemplateFunction } from 'UI/Base';
import { CrudEntityKey } from 'Types/source';
import { IItemActionsOptions } from 'Controls/itemActions';
import { IMarkerListOptions } from 'Controls/marker';
import {
    IItemPaddingOptions,
    INavigationSourceConfig,
    TOffsetSize,
} from 'Controls/interface';
import {
    Direction,
    IFontColorStyle,
    IItemTemplateOptions,
} from 'Controls/interface';
import { IMovableOptions } from './IMovableList';
import { RecordSet } from 'Types/collection';
import { TRowSeparatorVisibility } from 'Controls/display';

type TMultiSelectVisibility = 'visible' | 'onhover' | 'hidden';

type TListStyle = 'master' | 'default';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/ списков}.
 * @interface Controls/_list/interface/IList
 * @public
 */

/* ENG
 * Interface for lists.
 *
 * @interface Controls/_list/interface/IList
 * @public
 * @author Авраменко А.С.
 */

export interface IList
    extends IItemActionsOptions,
        IMarkerListOptions,
        IMovableOptions,
        IItemTemplateOptions,
        IItemPaddingOptions {
    rowSeparatorVisibility?: TRowSeparatorVisibility;
    attachLoadTopTriggerToNull?: boolean;
    emptyTemplate?: TemplateFunction | string;
    footerTemplate?: TemplateFunction | string;
    pagingLeftTemplate?: TemplateFunction | string;
    pagingRightTemplate?: TemplateFunction | string;
    multiSelectVisibility?: TMultiSelectVisibility;
    stickyMarkedItem?: boolean;
    uniqueKeys?: boolean;
    itemsReadyCallback?: (items: RecordSet) => void;
    dataLoadCallback?: (
        items: RecordSet,
        direction?: Direction,
        id?: string,
        navigationSourceConfig?: INavigationSourceConfig
    ) => void;
    dataLoadErrback?: (error: unknown) => void;
    style?: TListStyle;
    backgroundStyle?: string;
    hoverBackgroundStyle?: string;
    nodeConfig?: INodeConfig;

    pagingContentTemplate?: TemplateFunction | string;
    moreFontColorStyle?: IFontColorStyle;
    moreButtonTemplate?: TemplateFunction | string;
    stickyHeader?: boolean;
    stickyGroup?: boolean;
    stickyResults?: boolean;
    emptyTemplateOptions?: object;
    itemsSpacing?: TOffsetSize;
    keepScrollAfterReload?: boolean;
    activeElement?: CrudEntityKey;
}

/**
 * Интерфейс описывает структуру объекта конфигурации логики перезагрузки записи списка.
 * Который задается 2м аргументом в ф-ии {@link Controls/_list/interface/IList#reloadItem reloadItem} списков.
 *
 * @interface Controls/_list/interface/IReloadItemOptions
 * @public
 */
export interface IReloadItemOptions {
    /**
     * Метод с помощью которого будут запрошены данные с БЛ.
     */
    method?: 'read' | 'query';

    /**
     * Объект с метаданными, которые будут переданы в запросе к БЛ. Актуально указывать только в том случае если {@link Controls/_list/interface/IReloadItemOptions#method method} === 'read'.
     */
    readMeta?: object;

    /**
     * Определяет, как загруженный элемент будет применяться к коллекции.
     * Если параметр имеет значение true, элемент коллекции будет заменен загруженным элементом.
     * Если параметр имеет значение false (по умолчанию), загруженные элементы будут объединены в элемент коллекции.
     */
    replace?: boolean;

    /**
     * Определяет каким образом производить обновление записи в иерархических списках.
     * Если указано true, то будет отправлен запрос методом query на обновление всей иерархии которой принадлежит обновляемая запись.
     * В противном случае будет обновлена лишь сама запись.
     */
    hierarchyReload?: boolean;
}

/**
 * @name Controls/_list/interface/IList#stickyHeader
 * @cfg {Boolean} Прилипание {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапки таблицы} и {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/ заголовков групп} при прокрутке {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы} или {@link /doc/platform/developmentapl/interface-development/controls/list/ списка}.
 * @description
 * При включенной {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группировке элементов} опция автоматически задает прилипание {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/ заголовков групп} при прокрутке {@link /doc/platform/developmentapl/interface-development/controls/list/ списка}.
 * Если для шапки списка и заголовков групп нужно разное поведение при прокрутке, то с помощью опции {@link Controls/_list/interface/IList#stickyGroup stickyGroup} можно отдельно регулировать прилипание заголовков групп.
 * @demo Controls-demo/list_new/Grouped/NoSticky/Index В демо-примере для {@link /doc/platform/developmentapl/interface-development/controls/list/list/ плоского списка} опция stickyHeader установлена в значение false. Заголовок группы не прилипает при прокрутке списка.
 * @demo Controls-demo/list_new/Grouped/Sticky/Index В демо-примере для плоского списка опция stickyHeader установлена в значение true. Заголовок группы прилипает при прокрутке списка.
 * @default true
 */

/**
 * @name Controls/_list/interface/IList#stickyGroup
 * @cfg {Boolean} При включенной {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группировке элементов} опция задает прилипание {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/ заголовков групп} при прокрутке {@link /doc/platform/developmentapl/interface-development/controls/list/ списка}.
 * @description
 * Заданное значение опции приоритетнее, чем {@link Controls/_list/interface/IList#stickyHeader stickyHeader}.
 * Если опция явно не задана, то её значение приравнивается в значению опции {@link Controls/_list/interface/IList#stickyHeader stickyHeader}.
 * @default undefined
 */

/**
 * @name Controls/_list/interface/IList#stickyResults
 * @cfg {Boolean} Прилипание {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ итогов} при прокрутке {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы}.
 * @default true
 */

/**
 * @name Controls/_list/interface/IList#moreFontColorStyle
 * @cfg {Controls/interface:IFontColorStyle/TFontColorStyle.typedef} Опция управляет стилем цвета текста для {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/button-more/ кнопки "Ещё"}.
 * @default listMore
 * @see IFontColorStyle
 */

/**
 * @name Controls/_list/interface/IList#moreButtonTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения кнопки подгрузки данных при навигации {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/button-more/ "по запросу"}
 * @default Controls/list:MoreButtonTemplate
 * @demo Controls-demo/list_new/Navigation/MoreButton/Template/Index
 */

/**
 * @name Controls/_list/interface/IList#pagingContentTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения слева от кнопки навигации. Используется для отображения {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/#button-number счетчика непрочитанных сообщений}.
 * @demo Controls-demo/list_new/Navigation/Paging/End/ContentTemplate/Index
 * @see pagingMode
 */

/**
 * @name Controls/_list/interface/IList#attachLoadTopTriggerToNull
 * @cfg {Boolean} При изначальной загрузке списка прижимать верхний триггер загрузки к нулевой позиции.
 * @remark
 * Позволяет при двусторонней навигации избегать повторной загрузки данных сразу после инициализации списка.
 * @default true
 */

/**
 * @name Controls/_list/interface/IList#loadingIndicatorTemplate
 * @cfg {String|TemplateFunction} Определяет шаблон индикатора загрузки данных при порционном поиске.
 * @default Controls/list:LoadingIndicatorTemplate
 * @demo Controls-demo/list_new/LoadingIndicator/Global/Index
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:loadingIndicatorTemplate>
 *         <ws:partial template="Controls/list:LoadingIndicatorTemplate"
 *                     message="{{loadingIndicatorTemplate.position === 'global' ? 'Пожалуйста, подождите...'}}"
 *                     scope="{{loadingIndicatorTemplate}}"/>
 *     </ws:loadingIndicatorTemplate>
 * </Controls.list:View>
 * </pre>
 */

/**
 * @name Controls/_list/interface/IList#iterativeLoadingTemplate
 * @cfg {String|TemplateFunction} Определяет шаблон индикатора загрузки данных при порционном поиске.
 * @default Controls/list:IterativeLoadingTemplate
 * @demo Controls-demo/list_new/Searching/PortionedSearch/Index
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:iterativeLoadingTemplate>
 *         <ws:partial template="Controls/list:IterativeLoadingTemplate"
 *                     scope="{{iterativeLoadingTemplate}}">
 *             <ws:footerTemplate>
 *                 <div>Дополнительная информация при итеративном поиске</div>
 *             </ws:footerTemplate>
 *         </ws:partial>
 *     </ws:iterativeLoadingTemplate>
 * </Controls.list:View>
 * </pre>
 */

/**
 * @name Controls/_list/interface/IList#continueSearchTemplate
 * @cfg {String|TemplateFunction} Пользовательский шаблон, который отображается под кнопкой "{@link /doc/platform/developmentapl/interface-development/controls/list/navigation/portion-loading/#batch-filtration-search Продолжить поиск}".
 * @default Controls/list:ContinueSearchTemplate
 * @demo Controls-demo/list_new/Searching/PortionedSearch/Index
 */

/**
 * @name Controls/_list/interface/IList#emptyTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон отображения контрола без элементов.
 * @demo Controls-demo/list_new/EmptyList/Default/Index
 * @default undefined
 * @example
 * В следующем примере показана настройка шаблона отображения для пустого плоского списка.
 * <pre class="brush: html; highlight: [3-7]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:emptyTemplate>
 *         <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xl" bottomSpacing="l">
 *             <ws:contentTemplate>Нет данных</ws:contentTemplate>
 *         </ws:partial>
 *     </ws:emptyTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о настройка контрола без элементов читайте в соответствующих статьях для:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ плоского списка}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ таблицы}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/empty/ дерева}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/empty/ дерева c колонками}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/empty/ плитки}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/empty/ иерархического проводника}
 * * {@link /doc/platform/developmentapl/interface-development/controls/extends/help-system/pages/ подсказки на пустых страницах}
 */

/* ENG
 * @name Controls/_list/interface/IList#emptyTemplate
 * @cfg {TemplateFunction|String} Template for the empty list.
 * @remark
 * We recommend to use default template for emptyTemplate: Controls/list:EmptyTemplate
 * The template accepts the following options:
 * - contentTemplate content of emptyTemplate
 * - topSpacing Spacing between top border and content of emptyTemplate
 * - bottomSpacing Spacing between bottom border and content of emptyTemplate
 * @demo Controls-demo/list_new/EmptyList/Default/Index
 * @example
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}">
 *       <ws:emptyTemplate>
 *          <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xl" bottomSpacing="l">
 *             <ws:contentTemplate>Нет данных</ws:contentTemplate>
 *          </ws:partial>
 *       </ws:emptyTemplate>
 *    </Controls.list:View>
 * </pre>
 */

/**
 * @name Controls/_list/interface/IList#footerTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон отображения подвала контрола.
 * @demo Controls-demo/list_new/FooterTemplate/Index
 * @remark
 * Подробнее о настройка подвала читайте в соответствующих статьях для:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/list/footer/ плоского списка}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/grid/footer/ таблицы}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/footer/ дерева}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/footer/ дерева c колонками}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/footer/ плитки}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/footer/ иерархического проводника}
 */

/* ENG
 * @name Controls/_list/interface/IList#footerTemplate
 * @cfg {TemplateFunction|String} Template that will be rendered below the list.
 * @demo Controls-demo/list_new/FooterTemplate/Index
 */

/**
 * @name Controls/_list/interface/IList#pagingLeftTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон для отображения слева от {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/data-pagination/ постраничной навигации}.
 * @demo Controls-demo/list_new/Navigation/Paging/LeftTemplate/Index
 * @see pagingRightTemplate
 */

/* ENG
 * @name Controls/_list/interface/IList#pagingLeftTemplate
 * @cfg {TemplateFunction|String} Template to display to the left of page navigation.
 */

/**
 * @name Controls/_list/interface/IList#pagingRightTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон для отображения справа от {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/data-pagination/ постраничной навигации}.
 * @demo Controls-demo/list_new/Navigation/Paging/Position/RightTemplate/Index
 * @see pagingLeftTemplate
 */

/* ENG
 * @name Controls/_list/interface/IList#pagingRightTemplate
 * @cfg {TemplateFunction|String} Template to display to the right of page navigation.
 */

/**
 * @name Controls/_list/interface/IList#multiSelectTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон множественного выбора.
 * @demo Controls-demo/list_new/MultiSelect/CircleTemplate/Index
 * @demo Controls-demo/list_new/MultiSelect/AllSelected/Index
 * @description
 * Доступны следующие платформенные шаблоны множественного выбора:
 * 1. Controls/list:MultiSelectTemplate - множественный выбор при помощи чекбоксов (по умолчанию)
 * 2. Controls/list:MultiSelectCircleTemplate - множественный выбор при помощи radiobutton
 */

/**
 * @name Controls/_list/interface/IList#multiSelectVisibility
 * @cfg {String} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ чекбоксов}.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default hidden
 * @remark
 * В режиме onhover логика работы следующая:
 * * На Touch-устройствах чекбокс и место под него будет скрыто до тех пор, пока по любой записи не сделают свайп вправо
 * * На Desktop устройствах отображается место под чекбокс, но при наведении на запись отображается сам чекбокс.
 * @demo Controls-demo/list_new/MultiSelect/MultiSelectVisibility/OnHover/Index
 * @see multiSelectAccessibilityProperty
 * @see multiSelectPosition
 */

/* ENG
 * @typedef {String} Controls/_list/interface/IList/MultiSelectVisibility
 * @variant visible Show.
 * @variant hidden Do not show.
 * @variant onhover Show on hover.
 */

/* ENG
 * @name Controls/_list/interface/IList#multiSelectVisibility
 * @cfg {String} Whether multiple selection is enabled.
 * @demo Controls-demo/list_new/MultiSelect/MultiSelectVisibility/OnHover/Index
 * @default hidden
 */

/**
 * @name Controls/_list/interface/IList#multiSelectPosition
 * @cfg {String} Позиционирование {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ чекбокса}.
 * @variant custom Позиционирование чекбокса в произвольном месте пользовательского шаблона. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/position/ здесь}.
 * @variant default Стандартная позиция чекбоксов множественного выбора в начале строки.
 * @demo Controls-demo/list_new/MultiSelect/CustomPosition/Index
 * @default default
 * @see multiSelectAccessibilityProperty
 * @see multiSelectVisibility
 */

/* ENG
 * @name Controls/_list/interface/IList#multiSelectPosition
 * @cfg {String} Position of multiple selection checkboxes
 * @demo Controls-demo/list_new/MultiSelect/CustomPosition/Index
 * @default default
 * @variant custom A custom position for the multiple selection checkboxes. With this option value, the multiple selection template is passed to the item template and can be displayed anywhere in it
 * @variant default The standard position of the multiple selection checkboxes (at the beginning of the line)
 */

/**
 * @name Controls/_list/interface/IList#multiSelectAccessibilityProperty
 * @cfg {Controls/display:MultiSelectAccessibility} Имя поля записи, в котором хранится состояние видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ чекбокса}.
 * @remark Подробная настройка функционала описана {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/read-only/ здесь}.
 * @demo Controls-demo/list_new/ItemTemplate/MultiSelectAccessibilityProperty/Index
 * @see multiSelectVisibility
 * @see multiSelectPosition
 */

/**
 * @name Controls/_list/interface/IList#stickyMarkedItem
 * @cfg {Boolean} Позволяет включать/отключать прилипание выбранного элемента.
 * @remark
 * Опция актуальна только для стиля "Мастер".
 * @see style
 * @default true
 */

/**
 * @name Controls/_list/interface/IList#itemsReadyCallback
 * @cfg {Function} Функция, которая вызывается, когда экземпляр данных получен из источника и подготовлен к дальнейшей обработке контролом.
 * Функция единожды вызывается при построении контрола, а также в следующих случаях:
 * - RecordSet, по которому строится список был пересоздан
 * - Изменился конструктор модели списка (например, когда переключили вид списка)
 * - Изменилось название поля, содержащего ключ записи
 * @markdown
 * @remark
 * Единственный аргумент функции — **items** с типом данных {@link Types/collection:RecordSet}, где содержатся загруженные данные.
 * @example
 * В качестве примера используем функцию для того, чтобы сохранить ссылку на items, чтобы иметь возможноcть изменять items далее.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    itemsReadyCallback="{{_myItemsReadyCallback}}" />
 * </pre>
 * <pre class="brush:js">
 * _myItemsReadyCallback = function(items) {
 *    this._myItems = items;
 * }
 * </pre>
 * <pre class="brush:js">
 * deleteButtonClickHandler: function{
 *    this._myItems.removeAt(0);
 * }
 * </pre>
 * @see dataLoadCallback
 * @see dataLoadErrback
 */

/**
 * @name Controls/_list/interface/IList#sourceController
 * @cfg {Controls/dataSource/NewSourceController.typedef} Экземпляр класса загрузчика данных {@link Controls/dataSource:NewSourceController}.
 * @remark
 * Если вы используете {@link Controls/_browser/interface/IBrowser Browser}, то sourceController следует указывать в его опциях.
 * Если ваша страница строится на технологии sabyPage, то sourceController необходимо получить из результатов {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/ предзагрузки}.
 */

/**
 * @name Controls/_list/interface/IList#style
 * @cfg {String} Режим отображения списка.
 * @variant master Двухколоночный реестр.
 * @variant default Плоский список.
 * @default default
 */

/* ENG
 * @name Controls/_list/interface/IList#style
 * @cfg {String} Control styling
 * @variant master Stylizes control as MasterDetail
 * @variant default Simple list
 * @default default
 */

/**
 * @typedef {String} Controls/_list/interface/IList/ReloadType
 * @variant query Элемент будет перезагружен с помощью метода "Поисковый запрос".
 * @variant read Элемент будет перезагружен с помощью метода "Прочитать".
 */

/* ENG
 * @typedef {String} Controls/_list/interface/IList/ReloadType
 * @variant query Item will be reloaded with query method
 * @variant read Item will be reloaded with read method
 */

/**
 * Загружает модель из {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}, объединяет изменения в текущих данных и отображает элемент.
 * @function Controls/_list/interface/IList#reloadItem
 * @param {String|Number} key Идентификатор элемента коллекции, который должен быть перезагружен из источника.
 * @param {Controls/_list/interface/IReloadItemOptions} options Настройки перезагрузки итема.
 * @remark Возвращаемый результат зависит от указанного в options значения {@link Controls/_list/interface/IReloadItemOptions#method method}.
 * При значении 'read' возвращается запрошенная запись, а при значении 'query' возвращается RecordSet с дочерними элементами для загруженного узла.
 * @returns {Promise<Model | RecordSet>} В случае успешной загрузки возвращается запрошенная запись или RecordSet с дочерними элементами для загруженного узла.
 * @example
 * <pre class="brush: js">
 * _itemUpdated: function(id) {
 *    var list = this._children.myList;
 *    list.reloadItem(id);
 * }
 * </pre>
 */

/**
 * Возвращает рекордсет, на основании которого в данный момент строится список.
 * @function Controls/_list/interface/IList#getItems
 * @return {RecordSet} Список элементов.
 * @example
 * <pre class="brush: js">
 * _getItems(): RecordSet {
 *    var list = this._children.myList;
 *    return list.getItems();
 * }
 * </pre>
 */

/**
 * @typedef {String} Controls/_list/interface/IList/TScrollPosition
 * @description Варианты значений позиции скролла для метода doScroll.
 * @variant begin Начало списка
 * @variant end Конец списка
 * @variant top Вверх
 * @variant bottom Вниз
 * @variant item К элементу (дополнительно передаются params)
 * @variant nextPage к следующей странице
 * @variant prevPage к предыдущей странице
 */

/**
 * @typedef {Object} Controls/_list/interface/IList/TScrollToParams
 * @description Дополнительные параметры для метода doScroll.
 * @property {Types/source:ICrud#CrudEntityKey} key Ключ элемента, к которому нужно проскроллить.
 * @property {String} [position='top'] Целевое положение элемента, к которому происходит скроллирование. Допустимые значения: top, bottom, center.
 * @property {boolean} [force=false] Определяет форсированность скролла. Если true, то подскролл произойдет в любом случае. Если false, то подскролл произойдет только в случае, если элемент частично или полностью скрыт за пределами области прокрутки.
 */

/**
 * Публичный метод для управления скроллом в списке.
 * @function Controls/_list/interface/IList#scrollTo
 * @param {Controls/_list/interface/IList/TScrollPosition} where Позиция скролла.
 * @param {Controls/_list/interface/IList/TScrollToParams} params Дополнительные параметры.
 * @example
 * Вызов следующего метода расположит целевой элемент посередине вьюпорта.
 * <pre class="brush: js">
 * protected _scrollToItem(event: SyntheticEvent, key: number): void {
 *     this._children.list.scrollTo('item', {
 *          key,
 *          position: 'center',
 *
 *     });
 * }
 * </pre>
 */

/**
 * Прокручивает список к указанному элементу.
 * @function Controls/_list/interface/IList#scrollToItem
 * @param {String|Number} key Идентификатор элемента коллекции, к которому происходит прокручивание.
 * @param {String} [position='top'] Целевое положение элемента, к которому происходит скроллирование. Допустимые значения: top, bottom, center.
 * @param {Boolean} [force=false] Определяет форсированность скролла. Если true, то подскролл произойдет в любом случае. Если false, то подскролл произойдет только в случае, если элемент частично или полностью скрыт за пределами области прокрутки.
 * @param {Boolean} [allowLoad=false] Разрешает загрузку целевой записи в случае отсутствия её в рекордсете (используется навигация по курсору, подробнее в {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/ статье}).
 * @demo Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/Index В следующем примере под списком находится кнопка, при клике по которой вызывается обработчик и метод scrollToItem().
 * @example
 * Вызов следующего метода расположит целевой элемент у верхней границы вьюпорта.
 * <pre class="brush: js">
 * protected _scrollToItem(event: SyntheticEvent, key: number): void {
 *     this._children.list.scrollToItem(key, 'top', true);
 * }
 * </pre>
 */

/* ENG
 * Loads model from data source, merges changes into the current data and renders the item.
 * @function Controls/_list/interface/IList#reloadItem
 * @param {String|Number} key Identifier of the collection item, that should be reloaded from source.
 * @param {Controls/_list/interface/IReloadItemOptions} options reload config.
 * @example
 * <pre class="brush: js">
 * _buttonClick: function() {
 *    var list = this._children.myList;
 *    list.scrollToItem(this._firstItemKey);
 * }
 * </pre>
 */

/**
 * @name Controls/_list/interface/IList#backgroundStyle
 * @cfg {String} Префикс стиля для настройки фона внутренних компонентов списочного контрола с фиксированным или абсолютным позиционированием.
 * @variant master Предназначен для настройки фона master в masterDetail (Берётся из свойства style)
 * @variant detail Предназначен для настройки фона detail в masterDetail
 * @variant infoBox Предназначен для настройки фона infoBox.
 * @variant stack Предназначен для настройки фона стековой панели.
 * @variant detailContrast Определяет контрастность фона для области detail по отношению к окружению.
 * @variant listItem Предназначен для настройки фона элементов списка.
 * @variant stackHeader Предназначен для настройки фона шапки стековой панели.
 * @variant default Фон списка по умолчанию.
 * @default default
 * @remark
 * Согласно {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/ документации} поддерживаются любые произвольные значения опции.
 */

/* ENG
 * @name Controls/_list/interface/IList#backgroundStyle
 * @cfg {String} Style prefix to configure background for inner list control components with static or absolute positioning.
 * @default default (theme background)
 */

/**
 * @name Controls/_list/interface/IList#rowSeparatorSize
 * @cfg {String} Высота {@link /doc/platform/developmentapl/interface-development/controls/list/grid/separator/#row линии-разделителя строк}.
 * @variant s Размер тонкой линии-разделителя.
 * @variant l Размер толстой линии-разделителя.
 * @variant null Без линии-разделителя. Значение передается строкой.
 * @default null
 */

/*
 * @name Controls/_list/interface/IList#rowSeparatorSize
 * @cfg {String} set row separator height.
 * @variant s Thin row separator line.
 * @variant l Wide row separator line.
 * @variant null Without row separator line
 * @default null
 */

/**
 * @name Controls/_list/interface/IList#rowSeparatorVisibility
 * @cfg {Controls/display/TRowSeparatorVisibility.typedef} Настройка видимости {@link /doc/platform/developmentapl/interface-development/controls/list/grid/separator/#row линий-разделителей строк} по краям и внутри списка.
 * @default all
 */

/**
 * @name Controls/_list/interface/IList#hoverBackgroundStyle
 * @cfg {String} Стиль подсветки строки при наведении курсора мыши.
 * @default default
 * @remark
 * Позволяет определить произвольный {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/#hover фон записи при наведении}.
 * Поддерживается стандартная палитра цветов ховера.
 * Для отключения цвета при наведении используйте значение "transparent"
 * Для определения собственных цветов при наведении, необходимо указать специальный hoverBackgroundStyle, а
 * также определить в своем less-файле стиль controls-hover-background-@{yourBackgroundStyle}.
 * Фон при наведении на запись можно также установить индивидуально для каждой строки в опции шаблона строки hoverBackgroundStyle.
 * @example
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    hoverBackgroundStyle="primary" />
 * </pre>
 */

/**
 * @name Controls/_list/interface/IList#roundBorder
 * @cfg {Controls/_interface/IRoundBorder} Cкругление углов элемента списка.
 * Также устанавливает скругление углов для блока операций над записью.
 * @demo Controls-demo/listTemplates/ListItemTemplate/RoundBorders/Index
 * @demo Controls-demo/list_new/RoundBorder/Index
 */

/**
 * @name Controls/_list/interface/IList#urlProperty
 * @cfg {String} Имя поля записи, в котором содержится ссылка для открытия в новой вкладке.
 * @default url
 */

/**
 * @name Controls/_list/interface/IList#activeElement
 * @cfg {Types/source:ICrud#CrudEntityKey} Ключ текущего активного элемента
 * @remark Активным элементом считается последний элемент, который находится выше середины вьюпорта.
 * Для высчитывания активного элемента в списочном контроле должен быть включен виртуальный скроллинг.
 * @see activeElementChanged
 */

/**
 * @name Controls/_list/interface/IList#fadedKeys
 * @cfg {Array.<String|number>|undefined} Массив с идентификаторами высвеченных записей.
 * @default undefined
 */

/**
 * @name Controls/_list/interface/IList#keepScrollAfterReload
 * @cfg {boolean} Сохранять ли позицию скролла после перезагрузки
 * @default false
 */

/**
 * @name Controls/_list/interface/IList#stickyCallback
 * @cfg {String} Функция обратного вызова для определения залипания элемента списка.
 * В зависимости от возвращаемого значения может контролировать залипание элемента списка:
 * <ul>
 *     <li>top - элемент списка залипает только у верхней границы списка</li>
 *     <li>bottom - элемент списка залипает только у нижней границы списка</li>
 *     <li>topBottom - элемент списка залипает и у верхней и у нижней границы списка</li>
 * </ul>
 * @demo Controls-demo/list_new/StickyCallback/Index
 */

/**
 * @name Controls/_list/interface/IList#stickyFooter
 * @cfg {Boolean} Закрепляет {@link /doc/platform/developmentapl/interface-development/controls/list/list/footer/ подвал} списка.
 * @default false
 */

/**
 * @name Controls/_list/interface/IList#itemsSpacing
 * @cfg {Controls/interface/TOffsetSize.typedef} Размер отступа между записями списка
 * @default undefined
 */

/**
 * @name Controls/_list/interface/IList#iterativeLoadPageSize
 * @cfg {number} Размер пачки записей, которую мы пытаемся загрузить за {@link Controls/list:IList#iterativeLoadTimeout отведенное время}.
 * @remark По дефолту берем кол-во загружаемых записей в {@link Controls/_interface/INavigation/INavigationOptionValue навигации}.
 * @default undefined
 * @demo Controls-demo/list_new/Searching/IterativeLoadPageSize/Index
 */

/**
 * @name Controls/_list/interface/IList#iterativeLoadTimeout
 * @cfg {number} Время итеративной загрузки, за которое мы пытаемся загрузить {@link Controls/list:IList#iterativeLoadPageSize пачку записей}.
 * @remark Указывается в секундах.
 * @default 30
 * @demo Controls-demo/list_new/Searching/IterativeLoadTimeout/Index
 */

/**
 * @typedef {String} Controls/_list/interface/IList/ButtonName
 * @description Допустимые значения для аргумента события {@link Controls/list:IList#pagingArrowClick pagingArrowClick}.
 * @variant Begin Кнопка "В начало".
 * @variant End Кнопка "В конец".
 */

/**
 * @event pagingArrowClick Происходит при клике по кнопкам перехода к первой и последней странице.
 * @name Controls/_list/interface/IList#pagingArrowClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_list/interface/IList/ButtonName.typedef} buttonName Кнопка, по которой кликнули.
 */

/**
 * @event selectedLimitChanged Происходит при изменении лимита при выборе записей пачками в ПМО.
 * @name Controls/_list/interface/IList#selectedLimitChanged
 * @param {UI/Events:SyntheticEvent<Event>} event Дескриптор события.
 * @param {Number} limit Лимит на количество записей.
 * @example
 * В следующем примере показано, как подписаться на событие изменения лимита и обработать его.
 * Требуется для того, чтобы в дальнейшем передать лимит на БЛ, т.к. выбрано записей может быть больше, чем загружено.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View on:selectedLimitChanged="selectedLimitChanged()"/>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * class MyClass {
 *    private _limit: number;
 *
 *    protected selectedLimitChanged(e: Event, limit: number) {
 *       this._limit = limit;
 *    }
 * }
 * </pre>
 */

/**
 * @event itemMouseEnter Происходит в момент, когда курсор оказывается над элементом списка.
 * @name Controls/_list/interface/IList#itemMouseEnter
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр записи, на которую был наведен курсор.
 * @param {UI/Events:SyntheticEvent} nativeEvent Дескриптор события мыши.
 */

/* ENG
 * @event Occurs when the cursor is over the list item.
 * @name Controls/_list/interface/IList#itemMouseEnter
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Model} item Instance of the item that the cursor was over.
 * @param {UI/Events:SyntheticEvent} nativeEvent Descriptor of the mouse event
 */

/**
 * @event itemMouseLeave Происходит в момент, когда курсор уходит за пределы элемента списка.
 * @name Controls/_list/interface/IList#itemMouseLeave
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр записи, за пределы которой ушел курсор.
 * @param {UI/Events:SyntheticEvent} nativeEvent Дескриптор события мыши.
 */

/* ENG
 * @event Occurs when the cursor leaves the list item.
 * @name Controls/_list/interface/IList#itemMouseLeave
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Model} item Instance of the item that the cursor was over.
 * @param {UI/Events:SyntheticEvent} nativeEvent Descriptor of the mouse event
 */

/**
 * @event itemMouseMove Происходит в момент, когда курсор двигается по элементам списка.
 * @name Controls/_list/interface/IList#itemMouseMove
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр записи, по которой двигается курсор.
 * @param {UI/Events:SyntheticEvent} nativeEvent Дескриптор события мыши.
 */

/* ENG
 * @event Occurs when the cursor moves over list items.
 * @name Controls/_list/interface/IList#itemMouseMove
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Model} item Instance of the item that the cursor is moving along.
 * @param {UI/Events:SyntheticEvent} nativeEvent Descriptor of the mouse event
 */

/**
 * @event itemLongTap Происходит при долгом тапе на элементе списка на touch устройствах.
 * @name Controls/_list/interface/IList#itemLongTap
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Types/entity:Record} item Элемент, на котором произошёл долгий тап.
 * @param {Object} nativeEvent Объект нативного события браузера.
 */

/**
 * @event itemMouseDown Происходит в момент нажатия на кнопку мыши над элементом списка.
 * @name Controls/_list/interface/IList#itemMouseDown
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Types/entity:Record} item Элемент, над которым произошло нажатие на кнопку мыши.
 * @param {Object} nativeEvent Объект нативного события браузера.
 * @remark
 * От события {@link Controls/_list/interface/IClickableView#itemClick itemClick} данное событие отличается следующим:
 *
 * 1. Происходит при нажатии на любую кнопку мыши (левую, правую, среднюю);
 * 2. Происходит в момент нажатия кнопки (itemClick срабатывает уже после её отпускания).
 */

/**
 * @event itemSwipe Происходит при {@link /doc/platform/developmentapl/interface-development/controls/list/actions/swipe/ свайпе} на элементе списка.
 * @name Controls/_list/interface/IList#itemSwipe
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, по которому производим свайп.
 * @param {Object} nativeEvent Объект нативного события браузера.
 * @remark
 * Если в обработчике события вернуть false, событие не будет обработано платформой
 */

/* ENG
 * @event Occurs when list item is swiped.
 * @name Controls/_list/interface/IList#itemSwipe
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Model} item Instance of the swiped item.
 * @param {Object} nativeEvent Descriptor of the original event. It is useful if you want to get direction or target.
 * @remark
 * If custom event handler returns false platform won't handle it
 */

/**
 * @event hoveredItemChanged Происходит при наведении курсора мыши на элемент списка.
 * @name Controls/_list/interface/IList#hoveredItemChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента, на который наводим курсор.
 * @param {HTMLElement} itemContainer Контейнер элемента.
 */

/**
 * @event activeElementChanged Происходит при смене активного элемента в процессе скроллирования.
 * @name Controls/_list/interface/IList#activeElementChanged
 * @param {UI/Events:SyntheticEvent<Event>} event Дескриптор события.
 * @param {String} key Ключ активного элемента.
 * @remark Активным элементом считается последний элемент, который находится выше середины вьюпорта.
 * Для высчитывания активного элемента в списочном контроле должен быть включен виртуальный скроллинг.
 * @see shouldCheckActiveElement
 */

/* ENG
 * @event The event fires when the user hovers over a list item with a cursor.
 * @name Controls/_list/interface/IList#hoveredItemChanged
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Model} item Instance of the item whose action was clicked.
 * @param {HTMLElement} itemContainer Container of the item.
 */

/**
 * @event drawItems Происходит при отрисовке очередного набора данных.
 * @name Controls/_list/interface/IList#drawItems
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/* ENG
 * @event Occurs when the next batch of data is drawn.
 * @name Controls/_list/interface/IList#drawItems
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 */

/**
 * @event itemActivate Происходит при активации элемента.
 * @name Controls/_list/interface/IList#itemActivate
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому кликнули.
 * @param {Object} nativeEvent Объект нативного события браузера.
 * @param {Number} columnIndex Индекс колонки, по которой кликнули. Параметр актуален только для {@link Controls/grid:View} и {@link Controls/treeGrid:View}.
 * @remark
 * Активация происходит при клике по элементу.
 * Событие не происходит, если:
 *
 * * элемент нельзя отметить {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * * при клике начинается {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
 */
