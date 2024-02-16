/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

import { View as List, TItemsViewReceivedState } from 'Controls/baseList';
import TreeControl from 'Controls/_tree/TreeControl';
import { ITree, ITreeOptions, BaseTreeControlEmulationCompatibility } from 'Controls/baseTree';
import TreeView from 'Controls/_tree/TreeView';

import 'css!Controls/baseTree';

/**
 * Контрол "Дерево без колонок" позволяет отображать данные из различных источников в виде иерархического списка.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 * @remark
 * Дополнительно о контроле:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/ руководство разработчика}
 *
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IDraggable
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/grid:IPropStorage
 * @implements Controls/tree:ITree
 * @implements Controls/itemActions:IItemActions
 *
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility expandedItems hasChildrenProperty selectionType displayProperty groupHistoryId propStorageId parentProperty nodeProperty nodeHistoryType nodeHistoryId root nodeTypeProperty selectionCountMode markedKey
 *
 * @public
 */
export default class Tree extends List implements ITree {
    protected _compatibilityWrapper = BaseTreeControlEmulationCompatibility;
    protected _viewName: TemplateFunction = TreeView;
    protected _viewTemplate: TemplateFunction = TreeControl;

    protected _beforeMount(
        options: ITreeOptions,
        context?: object,
        receivedState?: TItemsViewReceivedState
    ): TItemsViewReceivedState {
        if (!options.nodeProperty && !options.storeId) {
            Logger.error(
                'Не задана опция nodeProperty, обязательная для работы Controls/tree:View',
                this
            );
        }

        if (!options.parentProperty && !options.storeId) {
            Logger.error(
                'Не задана опция parentProperty, обязательная для работы Controls/tree:View',
                this
            );
        }

        return super._beforeMount(options, context, receivedState);
    }

    toggleExpanded(key: CrudEntityKey): Promise<void> {
        // @ts-ignore
        return this._children.listControl.toggleExpanded(key);
    }

    goToPrev(): Model {
        return this._children.listControl.goToPrev();
    }

    goToNext(): Model {
        return this._children.listControl.goToNext();
    }

    getNextItem(key: CrudEntityKey): Model {
        return this._children.listControl.getNextItem(key);
    }

    getPrevItem(key: CrudEntityKey): Model {
        return this._children.listControl.getPrevItem(key);
    }

    getMarkedNodeKey(): CrudEntityKey | null {
        return this._children.listControl.getMarkedNodeKey();
    }

    protected _getModelConstructor(): string {
        return 'Controls/tree:TreeCollection';
    }
}

/**
 * @name Controls/_tree/Tree#itemTemplate
 * @cfg {TemplateFunction|String} Шаблон элемента списка.
 * @remark
 * По умолчанию используется шаблон "{@link Controls/tree:ItemTemplate Controls/tree:ItemTemplate}".
 *
 * Базовый шаблон itemTemplate поддерживает следующие параметры:
 * - contentTemplate {Function} — Шаблон содержимого элемента;
 * - highlightOnHover {Boolean} — Выделять элемент при наведении на него курсора мыши.
 * - cursor {TCursor} — Устанавливает вид {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора мыши} при наведении на строку.
 *
 * В области видимости шаблона доступен объект item, позволяющий получить доступ к данным рендеринга (например, элемент, ключ и т.д.).
 * Подробнее о работе с шаблоном читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/tree/item/">руководстве разработчика</a>.
 * @remark
 * Чтобы отобразить чекбоксы в режиме "только для чтения" воспользуйтесь опцией списка {@link Controls/_list/interface/IList#multiSelectAccessibilityProperty multiSelectAccessibilityProperty}
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree:View keyProperty="key"
 *                     source="{{_viewSource}}"
 *                     parentProperty="parent"
 *                     multiSelectVisibility="visible"
 *                     nodeProperty="type">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tree:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             <span>{{contentTemplate.item.contents.description}}</span>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.tree:View>
 * </pre>
 * @see Controls/tree:ItemTemplate
 * @see Controls/_list/interface/IList#multiSelectAccessibilityProperty
 */

/**
 * @name Controls/_tree/Tree#filter
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Object} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/ объекта фильтра}. Фильтр отправляется в запрос к источнику для получения данных.
 * @remark
 * При изменении фильтра важно передавать новый объект фильтра, изменение объекта по ссылке не приведет к желаемому результату.
 */

/**
 * @name Controls/_tree/Tree#navigation
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 */

/**
 * @name Controls/_tree/Tree#sorting
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Controls/_interface/ISorting/TSorting.typedef>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 * @demo Controls-demo/treeGridNew/Sorting/Index
 * @remark
 * Допустимы значения направления сортировки ASC/DESC.
 *
 * * В таблицах можно изменять сортировку нажатием кнопки сортировки в конкретной ячейке заголовкв таблицы. Для этого нужно в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ конфигурации ячейки шапки} задать свойство {@link Controls/grid:IHeaderCell#sortingProperty sortingProperty}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/sorting/ здесь}
 *
 * * При отсутствии заголовков в реестре можно воспользоваться кнопкой открытия меню сортировки. Для этого нужно добавить на страницу и настроить контрол {@link Controls/sorting:Selector}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/table/ здесь}
 *
 * Выбранную сортировку можно сохранять. Для этого используют опцию {@link Controls/grid:IPropStorage#propStorageId propStorageId}.
 */

/**
 * @name Controls/_tree/Tree#source
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 */

/**
 * @name Controls/_tree/Tree#keyProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 * Если keyProperty не задан, то значение будет взято из source.
 */
/**
 * @name Controls/_tree/Tree#selectedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#all выбранных элементов}.
 */

/**
 * @name Controls/_tree/Tree#excludedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#excluded-keys исключенных элементов}.
 */

/**
 * @name Controls/_tree/Tree#multiSelectVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
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

/**
 * @name Controls/_tree/Tree#markerVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
 * @default onactivated
 * @see markedKey
 * @see markedKeyChanged
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */

/**
 * @name  Controls/_tree/Tree#expandedItems
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
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
 * @name  Controls/_tree/Tree#hasChildrenProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле {@link Controls/tree:View дерева}.
 * @remark
 * Для работы опции hasChildrenProperty установите опцию {@link expanderVisibility} в значение "hasChildren".
 */

/**
 * @name  Controls/_tree/Tree#selectionType
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Тип записей, которые можно выбрать.
 * @default all
 * @variant node Только узлы доступны для выбора.
 * @variant leaf Только листья доступны для выбора.
 * @variant all Все типы записей доступны для выбора.
 * @remark Опция {@link Controls/_list/interface/IList#multiSelectAccessibilityProperty multiSelectAccessibilityProperty} преобладает над этой опцией
 */

/**
 * @name Controls/_tree/Tree#displayProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, содержимое которого будет отображаться по умолчанию.
 * @default title
 */

/**
 * @name Controls/_tree/Tree#groupHistoryId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
 */

/**
 * @name Controls/_tree/Tree#root
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Number|String} Идентификатор корневого узла.
 * Значение опции root добавляется в фильтре в поле {@link Controls/_tree/Tree#parentProperty parentProperty}.
 * @example
 * <pre class="brush: js; highlight: [5]">
 * <Controls.listDataOld:DataContainer
 *     keyProperty="id"
 *     filter="{{_filter}}"
 *     source="{{_source}}"
 *     root="Сотрудники"/>
 * </pre>
 */

/**
 * @name Controls/_tree/Tree#hasChildrenProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле {@link Controls/tree:View дерева}.
 * @remark
 * Для работы опции hasChildrenProperty установите опцию {@link expanderVisibility} в значение "hasChildren".
 */

/**
 * @name Controls/_tree/Tree#nodeHistoryId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее состояние развернутости узлов.
 */

/**
 * @name Controls/_tree/Tree#nodeHistoryType
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {TNodeHistoryType} Тип сохраняемых в историю узлов
 * @default group
 */

/**
 * @name Controls/_tree/Tree#nodeProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится информация о {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy типе элемента} (лист, узел, скрытый узел).
 * @example
 * В данном примере элемент с id: 4 является родителем для элементов с id: 5, 6, 7.
 * <pre classs="brush: html; highlight: [6]">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *     keyProperty="id"
 *     source="{{_source}}"
 *     parentProperty="parent"
 *     nodeProperty="parent@"/>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    data: [
 *       { id: 1, title: 'Task in development', parent: null, 'parent@': false },
 *       { id: 2, title: 'Error in development', parent: null, 'parent@': false },
 *       { id: 3, title: 'Application', parent: null, 'parent@': false },
 *       { id: 4, title: 'Assignment', parent: null, 'parent@': true },
 *       { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
 *       { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
 *       { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
 *    ],
 *    keyProperty: 'id'
 * });
 * </pre>
 */

/**
 * @name Controls/_tree/Tree#parentProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится информация о родительском узле элемента.
 * @example
 * В данном примере элемент с id: 4 является родителем для элементов с id: 5, 6, 7.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *     keyProperty="id"
 *     source="{{_source}}"
 *     parentProperty="parent"
 *     nodeProperty="parent@"/>
 * </pre>
 * <pre class="brush: js;"">
 * // JavaScript
 * this._source = new Memory({
 *    data: [
 *       { id: 1, title: 'Task in development', parent: null, 'parent@': false },
 *       { id: 2, title: 'Error in development', parent: null, 'parent@': false },
 *       { id: 3, title: 'Application', parent: null, 'parent@': false },
 *       { id: 4, title: 'Assignment', parent: null, 'parent@': true },
 *       { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
 *       { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
 *       { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
 *    ],
 *    keyProperty: 'id'
 * });
 * </pre>
 */

/**
 * @name Controls/_tree/Tree#propStorageId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Уникальный идентификатор, по которому будут сохраняться параметры контрола в хранилище данных.
 * @remark
 * Какой параметр будет сохраняться в хранилище данных — зависит от конкретного контрола.
 * Например, для {@link Controls/masterDetail:Base} сохраняется ширина контрола, чтобы после перезагрузки веб-страницы её можно было восстановить.
 */

/**
 * @name Controls/_tree/Tree#nodeTypeProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя свойства, содержащего информацию о типе узла.
 * @remark
 * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
 * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
 * При любом другом значении узел отображается как обычно с учётом nodeProperty
 * @example
 * В следующем примере показано, как настроить список на использование узлов-групп
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *    source="{{_source}}"
 *    nodeProperty="{{parent@}}"
 *    parentProperty="{{parent}}"
 *    nodeTypeProperty="customNodeType"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * class MyControl extends Control<IControlOptions> {
 *    _source: new Memory({
 *        keyProperty: 'id',
 *        data: [
 *            {
 *                id: 1,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *            {
 *                id: 2,
 *                customNodeType: null,
 *                ...
 *            },
 *            {
 *                id: 3,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *        ]
 *    })
 * }
 * </pre>
 */

/**
 * @name Controls/_tree/Tree#selectionCountMode
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/_interface/ISelectionCountModeOptions/TSelectionCountMode.typedef} Тип подсчитываемых записей.
 * @default all
 * @demo Controls-ListEnv-demo/OperationsPanel/SelectionCountMode/Index
 * @example
 * В этом примере для подсчета будут доступны только листья.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionCountMode="leaf">
 *     <ws:content>
 *         <Controls.treeGrid:View />
 *     </ws:content>
 * </Layout.Selector.Browser>
 * </pre>
 */

/**
 * @name Controls/_tree/Tree#markedKey
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud#CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @remark
 * Если сделан bind на эту опцию, но она передана изначально в значении undefined,
 * то установка маркера работает аналогично тому, как если бы bind не был задан (по внутреннему состоянию контрола).
 * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
 * @see markerVisibility
 * @see markedKeyChanged
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */
