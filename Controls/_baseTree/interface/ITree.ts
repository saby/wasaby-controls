/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import {
    IExpandedItemsOptions,
    IFilterOptions,
    IHierarchyOptions,
    ISelectionCountModeOptions,
    TKey,
    TSelectionType,
    TExpanderIconSize,
    TExpanderIconStyle,
} from 'Controls/interface';
import { TChildrenLoadMode } from '../display/interface/ITree';
import { IBaseControlOptions } from 'Controls/baseList';
import { CrudEntityKey } from 'Types/source';
import { TOldBaseTreeControlCompatibility } from '../compatibility/BaseTreeControlComponent';

export type TExpanderVisibility = 'visible' | 'hasChildren';

export type TNodeFooterVisibilityCallback = (item: Model) => boolean;

export type TNodeLoadCallback = (list: RecordSet, nodeKey: number | string) => void;

export type TExpanderPosition = 'default' | 'right' | 'custom';

/**
 * @interface Controls/_baseTree/interface/ITree/ITreeOptions
 * @embedded
 */
export interface IOptions
    extends IHierarchyOptions,
        IControlOptions,
        ISelectionCountModeOptions,
        IBaseControlOptions,
        IFilterOptions,
        IExpandedItemsOptions,
        TOldBaseTreeControlCompatibility {
    parentProperty?: string;
    markerMoveMode?: string;
    root?: TKey;
    canMoveMarker?: () => boolean;
    markedLeafChangeCallback?: Function;
    singleExpand?: boolean;
    // Опция была добавлена, чтобы запретить "разворачивание" записи при DnD в Explorer
    // при отображении записей списком, когда пользователь не ожидает разворачивание.
    supportExpand?: boolean;
    groupProperty?: string;
    nodeTypeProperty?: string;
    expandByItemClick?: boolean;
    expandedItems?: (number | string)[];
    collapsedItems?: (number | string)[];
    nodeFooterTemplate?: TemplateFunction;
    nodeHeaderTemplate?: TemplateFunction;
    nodeFooterVisibilityCallback?: TNodeFooterVisibilityCallback;
    hasChildrenProperty?: string;
    childrenProperty?: string;
    childrenCountProperty?: string;
    searchBreadCrumbsItemTemplate?: TemplateFunction;
    expanderVisibility?: TExpanderVisibility;
    nodeMoreCaption?: string;
    nodeLoadCallback?: TNodeLoadCallback;
    deepReload?: boolean;
    selectAncestors?: boolean;
    selectDescendants?: boolean;
    recursiveSelection?: boolean;
    selectionType?: TSelectionType;
    markItemByExpanderClick?: boolean;
    expanderSize?: 's' | 'm' | 'l' | 'xl';
    expanderIconSize?: TExpanderIconSize;
    expanderIcon?: string;
    expanderIconStyle?: TExpanderIconStyle;
    expanderPosition?: TExpanderPosition;
    loadNodeOnScroll?: boolean;
    /**
     * Режим загрузки дочерних элементов при развороте узла
     * @default once
     */
    childrenLoadMode?: TChildrenLoadMode;
    onExpandedItemsChanged?: (expandedItems: CrudEntityKey[]) => void;
    storeId?: string;
}

/**
 * @typedef {String} Controls/_baseTree/interface/ITree/HierarchyViewModeEnum
 * @variant tree Дерево.
 * @variant breadcrumbs Хлебные крошки.
 */

/*
 * @typedef {String} Controls/_baseTree/interface/ITree/HierarchyViewModeEnum
 * @variant tree Tree-like view.
 * @variant breadcrumbs Just leaves, folders as paths.
 */

/**
 * @name Controls/_baseTree/interface/ITree#itemTemplate
 * @cfg {Function} Пользовательский шаблон отображения элемента.
 * @default undefined
 * @markdown
 * @remark
 * Позволяет установить пользовательский шаблон отображения элемента. При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/tree:ItemTemplate}. Шаблон Controls/tree:ItemTemplate поддерживает {@link Controls/tree:ItemTemplate параметры}, с помощью которых можно изменить отображение элемента.
 *
 * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/tree/item/ руководстве разработчика}.
 * @example
 * <pre class="brush: html">
 * <Controls.tree:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tree:ItemTemplate" highlightOnHover="{{false}}" />
 *    </ws:itemTemplate>
 * </Controls.tree:View>
 * </pre>
 * @see Controls/_baseTree/interface/ITree#itemTemplateProperty
 * @see Controls/tree:ItemTemplate
 */

/**
 * @name Controls/_baseTree/interface/ITree#itemTemplateProperty
 * @cfg {String} Имя поля элемента, которое содержит Путь к {@link Controls/_baseTree/interface/ITree#itemTemplate шаблону отображения элемента}. С помощью этой настройки отдельным элементам можно задать собственный шаблон отображения.
 * @remark
 * Если не задано значение в опции itemTemplateProperty или в свойстве элемента, то используется шаблон из {@link Controls/_baseTree/interface/ITree#itemTemplate itemTemplate}.
 * @see Controls/_baseTree/interface/ITree#itemTemplate
 */

/**
 * @name Controls/_baseTree/interface/ITree#expandByItemClick
 * @cfg {Boolean} Развертывание узлов кликом по элементу в {@link Controls/tree:View дереве}.
 * @default false
 * @variant true Развертывание происходит кликом по элементу, а также кликом по кнопке-экспандеру.
 * @variant false Развертывание происходит только кликом по {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/expander/ кнопке-экспандеру}.
 * @see expandedItems
 * @see expanderVisibility
 */

/*
 * @name Controls/_baseTree/interface/ITree#expandByItemClick
 * @cfg {Boolean} Defines the mode of node expanding.
 * @variant true Toggle node by click on it's whole area.
 * @variant false Toggle node by click on only it's expander.
 * @default false
 */

/**
 * @name Controls/_baseTree/interface/ITree#collapsedItems
 * @cfg {Array.<String>|undefined} Идентификаторы свернутых узлов в {@link Controls/tree:View дереве}.
 * @remark
 * Этот параметр используется, когда {@link expandedItems} установлена в значение [null].
 * @see expandedItems
 */

/*
 * @name Controls/_baseTree/interface/ITree#collapsedItems
 * @cfg {Array.<String>|Array.<Number>} Array of identifiers of collapsed items.
 * This option is used only when the value of {@link Controls/_baseTree/interface/ITree#expandedItems expandedItems} is [null].
 * @notice Without binding this option will be static. Use binding to allow expanding/collapsing nodes.
 * @example
 * <pre>
 *      <Controls.tree:View
 *           bind:expandedItems="_expandedItems"
 *           bind:collapsedItems="_collapsedItems">
 *      </Controls.tree:View>
 *  </pre>
 *  @see collapsedItems
 */

/**
 * @name Controls/_baseTree/interface/ITree#expandedItems
 * @cfg {Array.<String>|undefined} Идентификаторы развернутых узлов в {@link Controls/tree:View дереве}.
 * @default undefined
 * @remark
 * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
 * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
 * @see expandByItemClick
 * @see expanderVisibility
 * @see collapsedItems
 */

/**
 * @name Controls/_baseTree/interface/ITree#nodeFooterTemplate
 * @cfg {TemplateFunction|String|Controls/tree:NodeFooterTemplate} Пользовательский шаблон подвала развернутого узла в {@link Controls/tree:View дереве}.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **item**. Метод **item.getNode()** возвращает узел, внутри которого отображается шаблон.
 *
 * @demo Controls-demo/treeGridNew/NodeFooter/NodeFooterTemplate/Index
 * @see nodeFooterVisibilityCallback
 * @see nodeLoadCallback
 * @see nodeHeaderTemplate
 */

/**
 * @name Controls/_baseTree/interface/ITree#nodeHeaderTemplate
 * @cfg {TemplateFunction|String|Controls/tree:NodeHeaderTemplate} Пользовательский шаблон шапки развернутого узла в {@link Controls/tree:View дереве}.
 * @default undefined
 * @remark
 * В области видимости шаблона доступен объект **item**. Метод **item.getNode()** возвращает узел, внутри которого отображается шаблон.
 *
 * @see nodeLoadCallback
 * @see nodeFooterTemplate
 */

/*
 * @name Controls/_baseTree/interface/ITree#nodeFooterTemplate
 * @cfg {Function} Sets footer template that will be shown for every node.
 * @demo Controls-demo/treeGridNew/NodeFooter/NodeFooterTemplate/Index
 */

/**
 * @name Controls/_baseTree/interface/ITree#nodeMoreCaption
 * @cfg {String} Пользовательский текст кнопки, расположенной в узле дерева и предназначенной для загрузки очередной пачки данных узла.
 * @default undefined
 * @see nodeLoadCallback
 */

/**
 * @name Controls/_baseTree/interface/ITree#nodeFooterVisibilityCallback
 * @cfg {Function} Функция обратного вызова для определения видимости шаблона подвала развернутого узла в {@link Controls/tree:View дереве}.
 * @remark
 * Функция принимает единственный аргумент:
 *
 * * item — модель (см. {@link Types/entity:Model}), содержащая данные узла, для которого определяется видимость шаблона подвала.
 *
 * Для видимости шаблона подвала, из функции следует вернуть true.
 * @example
 * Шаблон подвал скрыт для узлов, у которых свойство footerVisible === false.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree:View
 *     attr:class="demo-Tree"
 *     source="{{_source}}"
 *     nodeFooterVisibilityCallback="{{_nodeFooterVisibilityCallback}}"
 *     ...
 * </Controls.list:View>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * ...
 * private _nodeFooterVisibilityCallback(item: Model): boolean {
 *   return item.get('footerVisible') !== false;
 * }
 * ...
 * </pre>
 * @see nodeFooterTemplate
 * @see nodeLoadCallback
 */

/**
 * @name Controls/_baseTree/interface/ITree#hasChildrenProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле {@link Controls/tree:View дерева}.
 * @remark
 * Для работы опции hasChildrenProperty установите опцию {@link expanderVisibility} в значение "hasChildren".
 */

/*
 * @name Controls/_baseTree/interface/ITree#hasChildrenProperty
 * @cfg {String} Name of the field that contains information whether the node has children.
 */

/**
 * @typedef {String} Controls/_baseTree/interface/ITree/ExpanderVisibility
 * @description Допустимые значения для опции {@link expanderVisibility}.
 * @variant visible Всегда показывать кнопку-экспандер для узлов и отступ для листьев.
 * @variant hasChildren Показывать кнопку-экспандер только для узлов с дочерними элементами. В этом значении опция, также, отключает отступ для листьев, если в текущей папке нет записей с дочерними элементами.
 */

/**
 * Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/expander/ кнопки разворота узла} в {@link Controls/tree:View дереве}.
 * @remark
 * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
 * Для того, чтобы убрать этот отступ, необходимо в {@link resultsTemplateOptions опциях шаблона строки итогов} или в {@link Controls/_grid/display/interface/IColumn#resultTemplateOptions опциях ячейки строки итогов} в передать параметр withoutExpanderPadding и присвоить ему значение true.
 * @name Controls/_baseTree/interface/ITree#expanderVisibility
 * @cfg {Controls/_baseTree/interface/ITree/ExpanderVisibility.typedef}
 * @default visible
 * @demo Controls-demo/treeGridNew/Expander/Node/Index В следующем примере для контрола опция expanderVisibility установлена в значение visible.
 * @demo Controls-demo/treeGridNew/Expander/ExpanderVisibility/HasChildren/Index В следующем примере для контрола опция expanderVisibility установлена в значение hasChildren.
 * @see expanderIcon
 * @see expanderSize
 */

/**
 * @typedef {String} TExpanderPosition
 * @variant default Стандартное расположение иконки узла.
 * @variant right Расположение иконки узла справа.
 * @variant custom Произвольное расположение иконки узла. При данном значении опции, шаблон иконки передается в прикладной шаблон и может быть выведен в любом месте записи.
 */

/**
 * @name Controls/_baseTree/interface/ITree#expanderPosition
 * @cfg {TExpanderPosition} Расположение иконки для узла и скрытого узла.
 * @default default
 * @demo Controls-demo/treeGridNew/Expander/ExpanderPosition/Custom/Index В следующем примере для контрола опция expanderPosition установлена в значение custom.
 * @demo Controls-demo/treeGridNew/Expander/ExpanderPosition/Right/Index В следующем примере для контрола опция expanderPosition установлена в значение right.
 */

/**
 * @name Controls/_baseTree/interface/ITree#nodeLoadCallback
 * @cfg {Function} Функция обратного вызова для определения загрузки содержимого узла в {@link Controls/tree:View дереве}.
 * @default undefined
 * @see nodeFooterTemplate
 * @see nodeFooterVisibilityCallback
 */

/*
 * @name Controls/_baseTree/interface/ITree#nodeLoadCallback
 * @cfg {Function} Callback function that will be called when node data loaded by source.
 * @see nodeFooterTemplate
 * @see nodeFooterVisibilityCallback
 */

/**
 * @name Controls/_baseTree/interface/ITree#deepReload
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Boolean}
 * @description
 * Определяет, нужно ли выполнять перезагрузку с сохранением развернутых узлов.
 * Подробно про мультинавигацию можно прочесть в статьях:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/node/managing-node-expand/#multi-navigation Перезагрузка дерева с сохранением развернутых узлов},
 * * {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/contract/#request-navigation-page-multinavigation Контракт списочного контрола},
 * * {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/navigate/multinavigation/ Множественная навигация в списочных контролах}.
 *
 * @remark
 * Перезагрузка выполняется с сохранением развернутых узлов, даже при изменении опций filter, source, sorting и тд.
 * В поле фильтра, указанное в parentProperty будет отправлен массив развернутых узлов.
 * Если в результате запроса для этих узлов будут присланы дочерние элементы, то узлы останутся развернутыми, иначе они будут свёрнуты.
 * **Примечание.** Постраничная навигация в запросе передается для корня и её параметр {@link Controls/_interface/INavigation/INavigationPageSourceConfig.typedef pageSize} необходимо применять для всех узлов.
 * @example
 * Пример списочного метода БЛ
 * <pre class="brush: python">
 * def Test.MultiRoot(ДопПоля, Фильтр, Сортировка, Навигация):
 *      rs = RecordSet(CurrentMethodResultFormat())
 *      if Навигация.Type() == NavigationType.ntMULTI_ROOT:
 *          nav_result = {}
 *          for id, nav in Навигация.Roots().items():
 *              # Запрашиваем данные по одному разделу.
 *              Фильтр.Раздел = id
 *              tmp_rs = Test.MultiRoot(ДопПоля, Фильтр, Сортировка, nav)
 *              # Склеиваем результаты.
 *              for rec in tmp_rs:
 *                  rs.AddRow(rec)
 *              # Формируем общий результат навигации по всем разделам.
 *              nav_result[ id ] = tmp_rs.nav_result
 *          rs.nav_result = NavigationResult(nav_result)
 *      else:
 *          # Тут обработка обычной навигации, например, вызов декларативного списка.
 *          rs = Test.DeclList(ДопПоля, Фильтр, Сортировка, Навигация)
 *      return rs
 * </pre>
 * @see Controls/interface:IBasePositionSourceConfig#multiNavigation
 */

/**
 * @name Controls/_baseTree/interface/ITree#selectAncestors
 * @cfg {Boolean} Определяет, будут ли отмечаться родительские узлы при {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ отметке дочернего узла чекбоксом}.
 * @default true
 * @demo Controls-demo/treeGridNew/MultiSelect/SelectAncestors/DoNotSelectAncestors/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree.View selectAncestors="{{false}}"/>
 * </pre>
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @see selectDescendants
 */

/**
 * @name Controls/_baseTree/interface/ITree#selectDescendants
 * @cfg {Boolean} Определяет, будут ли отмечаться дочерние элементы при {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ отметке узла чекбоксом}.
 * @default true
 * @demo Controls-demo/treeGridNew/MultiSelect/SelectDescendants/DoNotSelectDescendants/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree.View selectDescendants="{{false}}"/>
 * </pre>
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @see selectAncestors
 */

/**
 * @name Controls/_baseTree/interface/ITree#childrenCountProperty
 * @cfg {string} Свойство узла, которое содержит количество детей. Применяется при включенной {@link Controls-ListEnv/operationsPanelConnected:View панели операций}
 * @default ''
 * @demo Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/Index
 * @remark При навигации по узлам контроллер будет запоминать кол-во для каждой выбранной записи.
 * Это позволяет считать количество выбранных записей полностью на клиенте. Но функционал имеет ограничение во время фильтрации.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree.View childrenCountProperty="childrenCount"/>
 * </pre>
 */

/**
 * @name Controls/_baseTree/interface/ITree#markItemByExpanderClick
 * @cfg {Boolean} Определяет, нужно ли выделять узел {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @default true
 * @remark Узел отмечается маркером при клике на иконку разворота узла, если значение true.
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 */

/**
 * @typedef {String} Controls/_baseTree/interface/ITree/TOffset
 * @description Допустимые значения для опций, которые задают размер отступа.
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 */

/**
 * @name Controls/_baseTree/interface/ITree#expanderSize
 * @cfg {Controls/_baseTree/interface/ITree/TOffset.typedef} Размер области, который отведён под иконку узла или скрытого узла.
 * @default s
 * @remark
 * Опции expanderSize на контроле и {@link Controls/treeGrid:ItemTemplate#expanderSize expanderSize на шаблоне элемента} не являются взаимоисключающими.
 * Опция expanderSize на контроле определяет размер области, отведённой под иконку узла или скрытого узла для всего списка, включая автоматическую конфигурацию {@link nodeFooterTemplate шаблона подвалов узлов}.
 * Опция {@link Controls/treeGrid:ItemTemplate#expanderSize expanderSize на шаблоне элемента} приоритетнее, чем expanderSize на контроле.
 * В случае, если для разных элементов дерева заданы разные значения опции, то для корректного выравнивания подвалов узлов необходимо продублировать опцию на {@link nodeFooterTemplate шаблоне подвалов узлов}.
 * Размер области xs рекомендуется задавать только вместе с иконкой разворота {@link Controls/_baseTree/interface/ITree#expanderIconSize размера} 2xs
 * @see expanderIcon
 * @see expanderVisibility
 * @see expanderIconSize
 */

/**
 * @name Controls/_baseTree/interface/ITree#expanderIcon
 * @cfg {String|undefined} Стиль отображения иконки для всех узлов и скрытых узлов дерева.
 * @variant none Иконки всех узлов и скрытых узлов не отображаются.
 * @variant node Иконки всех узлов и скрытых узлов отображаются как иконки узлов.
 * @variant hiddenNode Иконки всех узлов и скрытых узлов отображаются как иконки скрытых узлов.
 * @variant emptyNode Иконки всех узлов отображаются как иконки пустых узлов.
 * @default undefined
 * @remark
 * Когда в опции задано undefined, используются иконки узлов и скрытых узлов.
 * Опции expanderIcon на контроле и {@link Controls/treeGrid:ItemTemplate#expanderIcon expanderIcon на шаблоне элемента} не являются взаимоисключающими.
 * Опции expanderIcon на контроле определяет стиль отображения иконки для узла и скрытого узла для всего списка, включая автоматическую конфигурацию {@link nodeFooterTemplate шаблона подвалов узлов}.
 * Опция {@link Controls/treeGrid:ItemTemplate#expanderIcon expanderIcon на шаблоне элемента} приоритетнее, чем expanderIcon на контроле.
 * В случае, если для разных элементов дерева заданы разные значения опции, то для корректного выравнивания подвалов узлов необходимо продублировать опцию на {@link nodeFooterTemplate шаблоне подвалов узлов}.
 * @see expanderSize
 * @see expanderVisibility
 */

/**
 * @name Controls/_baseTree/interface/ITree#expanderIconStyle
 * @cfg {Controls/_interface/IExpandedItems/TExpanderIconStyle.typedef} Стиль цвета иконки разворота узлов дерева
 * @default default
 */

/**
 * @name Controls/_baseTree/interface/ITree#expanderIconSize
 * @cfg {Controls/_interface/IExpandedItems/TExpanderIconSize.typedef} Размер иконки разворота узлов дерева
 * @default default
 * @see expanderSize
 */

/**
 * @name Controls/_baseTree/interface/ITree#selectionType
 * @cfg {String} Тип записей, которые можно выбрать.
 * @default all
 * @variant node Только узлы доступны для выбора.
 * @variant leaf Только листья доступны для выбора.
 * @variant all Все типы записей доступны для выбора.
 * @remark Опция {@link Controls/_list/interface/IList#multiSelectAccessibilityProperty multiSelectAccessibilityProperty} преобладает над этой опцией
 */

/**
 * @name Controls/_baseTree/interface/ITree#singleExpand
 * @cfg {Boolean} Режим единого развернутого узла.
 * @remark
 * В дереве можно задать такое поведение, при котором единовременно может быть развернут только один узел в рамках одного уровня иерархии. При развертывании нового узла предыдущий будет автоматически сворачиваться.
 * @default false
 * @variant true
 * @variant false
 * @demo Controls-demo/treeGridNew/ReverseType/SingleExpand/Index
 */

/**
 * Возвращает ключ родителя, в котором по-умолчанию следует начинать добавление по месту.
 * @name Controls/_baseTree/interface/ITree#getMarkedNodeKey
 * @remark
 * Если в дереве маркер стоит на развернутом узле или на его дочерних записях/свёрнутых узлах,
 * то позиция по-умолчанию для добавляемой записи - этот раскрытый узел.
 * Во всех остальных случаях позицией будет текущий корень дерева.
 * @function
 * @returns {null|string|number}
 */

/**
 * @name Controls/_baseTree/interface/ITree#source
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект, реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 * @example
 * В приведённом примере для контрола {@link Controls/list:View} в опцию source передаётся {@link Types/source:HierarchicalMemory} источник.
 * Контрол получит данные из источника и выведет их.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree:View
 *    source="{{_viewSource}}"
 *    parentProperty="parent"
 *    nodeProperty="type" />
 * </pre>
 *
 * <pre class="brush: js">
 * import {HierarchicalMemory} from "Types/source";
 *
 * _source: null,
 * _beforeMount: function() {
 *     this._source = new HierarchicalMemory({
 *         keyProperty: 'key',
 *         parentProperty: 'parent',
 *         data: [
 *             {
 *                 key: '1',
 *                 title: 'Ярославль',
 *                 parent: null,
 *                 '@parent': true,
 *                 type: true,
 *                 hasChild: true
 *             },
 *             {
 *                 key: 11,
 *                 title: 'Smartphones1',
 *                 parent: 1,
 *                 type: true,
 *                 rating: '9.2',hasChild: true
 *             },
 *         ]
 *     });
 * }
 * </pre>
 * @see Types/source:ICrud
 */

/**
 * @event Controls/_baseTree/interface/ITree#afterItemExpand Происходит после развертывания узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Развёрнутый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @see beforeItemExpand
 */

/**
 * @event Controls/_baseTree/interface/ITree#beforeItemExpand Происходит перед развертыванием узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Разворачиваемый узел.
 * @remark
 * Если во время разворота необходимо выполнить какое-то асинхронное действие, можно вернуть из обработчика события Promise<void>.
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @see afterItemExpand
 */

/**
 * @event Controls/_baseTree/interface/ITree#itemExpand Происходит перед развертыванием узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Разворачиваемый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @deprecated Событие устарело и в ближайшее время его поддержка будет прекращена. Используйте {@link Controls/_baseTree/interface/ITree#beforeItemExpand beforeItemExpand}.
 */

/**
 * @event Controls/_baseTree/interface/ITree#itemExpanded Происходит после развертывания узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Развёрнутый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @deprecated Событие устарело и в ближайшее время его поддержка будет прекращена. Используйте {@link Controls/_baseTree/interface/ITree#afterItemExpand afterItemExpand}.
 */

/*
 * @event itemExpanded Occurs after node expansion.
 * @name Controls/_baseTree/interface/ITree#itemExpanded
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {Types/entity:Model} node Expanded node.
 */

/**
 * @event Controls/_baseTree/interface/ITree#afterItemCollapse Происходит после сворачивания узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Свёрнутый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 */

/**
 * @event Controls/_baseTree/interface/ITree#itemCollapse Происходит перед сворачиванием узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Сворачиваемый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @deprecated Событие устарело и в ближайшее время его поддержка будет прекращена. Используйте {@link Controls/_baseTree/interface/ITree#beforeItemCollapse beforeItemCollapse}.
 */

/**
 * @event Controls/_baseTree/interface/ITree#beforeItemCollapse Происходит перед сворачиванием узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Сворачиваемый узел.
 * @remark
 * Если во время сворачивания необходимо выполнить какое-то асинхронное действие, можно вернуть из обработчика события Promise<void>.
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @see itemCollapsed
 */

/**
 * @event Controls/_baseTree/interface/ITree#itemCollapsed Происходит после сворачивания узла.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} node Свёрнутый узел.
 * @remark
 * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
 * @deprecated Событие устарело и в ближайшее время его поддержка будет прекращена. Используйте {@link Controls/_baseTree/interface/ITree#afterItemCollapse afterItemCollapse}.
 */

/*
 * @event itemCollapsed Occurs after node collapse.
 * @name Controls/_baseTree/interface/ITree#itemCollapsed
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {Types/entity:Model} node Collapsed node.
 */

/**
 * @event Controls/_baseTree/interface/ITree#collapsedItemsChanged Происходит при изменении набора свернутых узлов.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} expandedItems Идентификаторы свернутых узлов.
 * @see expandedItemsChanged
 */

/**
 * Интерфейс дерева
 * @implements Controls/interface/IGroupedList
 * @implements Controls/_baseTree/interface/ITree/ITreeOptions
 * @implements Controls/interface:IExpandedItemsOptions
 *
 * @public
 */
export default interface ITree {
    readonly '[Controls/_baseTree/interface/ITree]': true;
}
