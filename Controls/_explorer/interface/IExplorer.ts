/**
 * @kaizen_zone e8e36b1a-d1b2-42b9-a236-b49c3be0934f
 */
import {
    IDraggableOptions,
    IFilterOptions,
    INavigationOptionValue,
    INavigationSourceConfig,
    ISortingOptions,
    TTextTransform,
} from 'Controls/interface';
import { ICrudPlus } from 'Types/source';
import { TemplateFunction } from 'UI/Base';
import { IGridControl } from 'Controls/grid';
import { ITreeControlOptions } from 'Controls/tree';
import { IEditableListOptions, IList } from 'Controls/baseList';
import { TBackButtonIconViewMode } from 'Controls/heading';
import { ISearchBreadcrumbsOptions, TKey } from 'Controls/interface';
import { Path } from 'Controls/dataSource';

/**
 * Тип, описывающий допустимые значения опции {@link Controls/explorer:IExplorerOptions#viewMode viewMode} задающей режим отображения списка
 * @typedef Controls/_explorer/interface/IExplorer/TExplorerViewMode
 * @variant table
 * @variant tile
 * @variant list
 * @variant table
 * @variant search
 */
export type TExplorerViewMode = 'table' | 'search' | 'tile' | 'list';

/**
 * Тип, описывающий допустимые значения опции {@link Controls/explorer:IExplorerOptions#breadcrumbsVisibility breadcrumbsVisibility} задающей видимость хлебных крошек
 * @typedef Controls/_explorer/interface/IExplorer/TBreadcrumbsVisibility
 * @variant hidden
 * @variant visible
 * @variant onlyBackButton
 */
export type TBreadcrumbsVisibility = 'hidden' | 'visible' | 'onlyBackButton';

/**
 * Интерфейс для иерархических списков с возможностью проваливания в папки.
 * @public
 */
export interface IExplorerOptions
    extends ITreeControlOptions,
        IDraggableOptions,
        IList,
        IEditableListOptions,
        IGridControl,
        IFilterOptions,
        ISortingOptions,
        ISearchBreadcrumbsOptions {
    /**
     * @cfg
     * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/ Режим отображения} иерархического проводника.
     * @default table Таблица.
     * @demo Controls-demo/Explorer/Explorer
     */
    viewMode?: TExplorerViewMode;

    /**
     * @cfg
     * Режим поиска в иерархическом проводнике.
     * * root Поиск происходит в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/root/ корне}.
     * * current Поиск происходит в текущем разделе.
     * @default root
     */
    searchStartingWith?: 'root' | 'current';

    /**
     * @cfg
     * Идентификатор узла, содержимое которого отображается в иерархическом проводнике.
     * @default null
     */
    root?: TKey;

    /**
     * @cfg
     * Видимость хлебных крошек и кнопки "Назад".
     * Если в вашем реестре не подразумевается использование встроенных крошек и кнопки "Назад", то лучше выставить эту опцию в 'hidden' т.к. это предотвратит загрузку лишних модулей и расчет дополнительных величин для корректной работы.
     * * hidden - хлебные крошки и кнопка "Назад" полностью скрываются
     * * visible - хлебные крошки и кнопка "Назад" показываются по стандартной логике
     * * onlyBackButton - видна только кнопка "Назад", крошки скрываются
     *
     * @default visible
     */
    breadcrumbsVisibility?: TBreadcrumbsVisibility;

    /**
     * @cfg
     * Режим вывода строки с хлебными крошками в результатах поиска.
     * @default row
     *
     * @remark
     * Данная опция позволяет сконфигурировать вывод строки с хлебными крошками. Возможны 2 варианта:
     *
     * * row - все ячейки строки с хлебными крошками объединяются в одну ячейку в которой выводятся хлебные крошки.
     * * cell - ячейки строки с хлебными крошками не объединяются, выводятся в соответствии с заданной конфигурацией колонок. При таком режиме прикладной разработчик может задать кастомное содержимое для ячеек строки с хлебными крошками.
     */
    breadCrumbsMode?: 'row' | 'cell';

    /**
     * @cfg
     * Отображение крошек в несколько строк {@link Controls/breadcrumbs:HeadingPath#displayMode}
     * @default default
     */
    breadcrumbsDisplayMode?: 'default' | 'multiline';

    /**
     * @cfg
     * Пользовательский шаблон, который будет выведен справа от {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/breadcrumbs/ хлебных крошек}.
     */
    afterBreadCrumbsTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Флаг, переключающий списочное представление в многоколоночный режим
     */
    useColumns?: boolean;

    /**
     * @cfg
     * Шаблон отображения заголовка группы
     */
    groupTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Шаблон отображения элемента в режиме "Плитка".
     *
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения элемента (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/tile:ItemTemplate}.
     *
     * Также шаблон Controls/tile:ItemTemplate поддерживает {@link Controls/tile:ItemTemplate параметры}, с помощью которых можно изменить отображение элемента.
     *
     * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию tileItemTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/tile:ItemTemplate.
     *
     * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/item/ руководстве разработчика}.
     * @example
     * <pre class="brush: html; highlight: [3-5]">
     * <!-- WML -->
     * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="table" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
     *     <ws:tileItemTemplate>
     *         <ws:partial template="Controls/tile:ItemTemplate" highlightOnHover="{{false}}" />
     *     </ws:tileItemTemplate>
     * </Controls.explorer:View>
     * </pre>
     * @see Controls/explorer:IExplorerOptions#itemTemplate
     * @see Controls/explorer:IExplorerOptions#itemTemplateProperty
     */
    tileItemTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Шаблон отображения группы в режиме "Плитка".
     *
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения группы (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/list:GroupTemplate}.
     * @example
     * <pre class="brush: html;">
     * <!-- WML -->
     * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="table" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
     *     <ws:tileGroupTemplate>
     *         <ws:partial template="Controls/list:GroupTemplate"/>
     *     </ws:tileGroupTemplate>
     * </Controls.explorer:View>
     * </pre>
     * @see Controls/explorer:IExplorerOptions#itemTemplate
     * @see Controls/explorer:IExplorerOptions#itemTemplateProperty
     */
    tileGroupTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Пользовательский шаблон отображения {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ пустого списка}, используемый в {@link viewMode режиме "Плоский список"}.
     * @demo Controls-demo/list_new/EmptyList/Default/Index
     *
     * @example
     * <pre class="brush: html; highlight: [2-6]">
     * <!-- WML -->
     * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="list" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
     *     <ws:listEmptyTemplate>
     *         <ws:partial template="Controls/list:EmptyTemplate" topSpacing="xl" bottomSpacing="l">
     *             <ws:contentTemplate>Нет данных</ws:contentTemplate>
     *         </ws:partial>
     *     </ws:listEmptyTemplate>
     * </Controls.explorer:View>
     * </pre>
     *
     * @remark
     * Пользовательский шаблон получается путем конфигурации базового шаблона {@link Controls/list:EmptyTemplate}.
     */
    listEmptyTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Шаблон отображения элемента в режиме "Список".
     *
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения элемента (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/list:ItemTemplate}.
     *
     * Также шаблон Controls/list:ItemTemplate поддерживает {@link Controls/list:ItemTemplate параметры}, с помощью которых можно изменить отображение элемента.
     *
     * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию listItemTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/list:ItemTemplate.
     *
     * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/item/ руководстве разработчика}.
     * @example
     * <pre class="brush: html; highlight: [3-5]">
     * <!-- WML -->
     * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="table" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
     *     <ws:listItemTemplate>
     *         <ws:partial template="Controls/list:ItemTemplate" highlightOnHover="{{false}}" />
     *     </ws:listItemTemplate>
     * </Controls.explorer:View>
     * </pre>
     * @see Controls/explorer:IExplorerOptions#itemTemplate
     * @see Controls/explorer:IExplorerOptions#itemTemplateProperty
     */
    listItemTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Кастомный шаблон, который выводится перед заголовком кнопки назад в хлебных крошках.
     * В шаблон передается опция item в которой содержится запись хлебной крошки.
     */
    backButtonBeforeCaptionTemplate?: string | TemplateFunction;

    /**
     * @cfg
     * Задает режим отображения заголовка в кнопке "Назад".
     * Вместе с установкой преобразования текста, меняется так же расстояние между буквами.
     */
    backButtonTextTransform?: TTextTransform;

    /**
     * @cfg
     * Стиль отображения иконки кнопки "Назад".
     * @see Controls/_heading/Back#iconStyle
     */
    backButtonIconStyle?: string;

    /**
     * @cfg
     * Стиль цвета кнопки "Назад".
     * @see Controls/_heading/Back#fontColorStyle
     */
    backButtonFontColorStyle?: string;

    /**
     * @cfg {String} Задает режим отображения иконки кнопки "Назад".
     * @variant default - иконка кнопки отображается без обводки.
     * @variant functionalButton - иконка кнопки отображается с обводкой.
     * @default default
     */
    backButtonIconViewMode?: TBackButtonIconViewMode;

    /**
     * @cfg
     * Определяет, должна ли отображаться стрелка-шеврон рядом с кнопкой "Назад".
     * @default false
     */
    showActionButton?: boolean;

    /**
     * @cfg
     * Имя свойства узла дерева, которое определяет, что при поиске этот узел должен быть показан отдельной хлебной крошкой.
     */
    dedicatedItemProperty?: string;

    /**
     * @cfg
     * Источник данных для кнопки навигационного меню, которая отображается в блоке с хлебными крошками.
     * По умолчанию для навигационного меню используется тот же источник данных, который был передан для работы со списком.
     * В случае если query-метод основного источника данных слишком тяжелый то для кнопки навигационного меню рекомендуется использовать отдельный источник с облегченным query-методом.
     */
    pathButtonSource?: ICrudPlus;

    /**
     * @cfg
     * Задает видимость кнопки {@link Controls/breadcrumbs:PathButton навигационного меню}.
     * Если значение опции установлено в true, то вместо иконки "домик" будет выведена кнопка вызова навигационного меню. При этом кнопка вызова навигационного меню видна всегда вне зависимости от текущего уровня иерархии.
     * @default false
     */
    pathButtonVisible?: boolean;

    /**
     * @cfg
     * Имя свойства элемента, содержимое которого будет отображаться.
     * @remark Поле используется для вывода хлебных крошек.
     * @example
     * <pre class="brush: html; highlight: [2]">
     * <!-- WML -->
     * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="table" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
     *     ...
     * </Controls.explorer:View>
     * </pre>
     */
    displayProperty?: string;

    /**
     * Позиция строки итогов
     */
    resultsPosition?: 'top' | 'bottom';

    /**
     * Шаблон строки итогов
     */
    resultsTemplate?: string | TemplateFunction;

    /**
     * Дополнительные опции шаблона строки итогов
     */
    resultsTemplateOptions?: { [key: string]: unknown };

    /**
     * Видимость строки итогов
     * * hasdata - больше 1 записи в талице
     */
    resultsVisibility?: 'hasdata' | 'visible' | 'hidden';

    newColumnScroll?: boolean;

    dragControlId?: string;

    itemOpenHandler?: Function;

    _navigation?: INavigationOptionValue<INavigationSourceConfig>;

    task1185938417?: boolean;

    storeId?: string;
    // Будет удалено по задаче https://online.sbis.ru/opendoc.html?guid=6d528c23-44db-4b61-98e2-49f9c001810f&client=3
    // Добавлено для совместимости
    // breadCrumbsItems - опция у внутреннего представления, которое строится по данным из контекста
    breadCrumbsItems?: Path;
}

/**
 * @name Controls/explorer:IExplorerOptions#searchBreadCrumbsItemTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон отображения элемента с хлебными крошками в {@link Controls/treeGrid:View дереве с колонками} при {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/#search режиме поиска}.
 * @default undefined
 * @remark
 * По умолчанию используется базовый шаблон "Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate"
 */

/*
 * @name Controls/explorer:IExplorerOptions#displayProperty
 * @cfg {string} sets the property to be displayed in search results
 * @example
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.explorer:View source="{{_viewSource}}" columns="{{_columns}}" viewMode="table" displayProperty="title" parentProperty="parent" nodeProperty="parent@">
 *     ...
 * </Controls.explorer:View>
 * </pre>
 */

/**
 * @name Controls/explorer:IExplorerOptions#itemPadding
 * @cfg {Controls/_tile/interface/ITile/TileItemPadding.typedef|Controls/_interface/IItemPadding/ItemPadding.typedef} Отступы элементов.
 * @description
 * Поведение реестра при настройке этой опции зависит от {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/ режима отображения}.
 * В режиме плитки эта опция повлияет на отступы между записями и принимает объект {@link Controls/_tile/interface/ITile/TileItemPadding.typedef TileItemPadding}.
 * В прочих режимах эта опция повлияет на отступы внутри записи и принимает объект {@link Controls/_interface/IItemPadding/ItemPadding.typedef ItemPadding}.
 */
