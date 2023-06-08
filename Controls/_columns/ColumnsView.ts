/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Списочный контрол, который позволяет расположить записи в нескольких столбцах в зависимости от доступной ширины.
 *
 * @remark
 * Переменные тем оформления:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_columns.less набор переменных columns}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less набор переменных list}
 *
 * @class Controls/columns:View
 * @extends UI/Base:Control
 * @implements Controls/list:IListNavigation
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/list:IEditableList
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IReloadableList
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IRemovableList
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/marker:IMarkerList
 * @implements Controls/interface:ITagStyle
 * @public
 * @example
 * Пример базовой конфигурации:
 * <pre class="brush: html;">
 * <Controls.columns:View
 *     keyProperty="id"
 *     source="{{_viewSource}}" />
 * </pre>
 * @demo Controls-demo/list_new/ColumnsView/Default/Index
 */

/**
 * @name Controls/columns:View#itemTemplateProperty
 * @cfg {String} Имя поля элемента, которое содержит имя {@link Controls/columns:View#itemTemplate шаблона отображения элемента}. С помощью этой настройки отдельным элементам можно задать собственный шаблон отображения.
 * @demo Controls-demo/list_new/ColumnsView/TemplateProperty/Index
 * @remark
 * Если не задано значение в опции itemTemplateProperty или в свойстве элемента, то используется шаблон из {@link Controls/columns:View#itemTemplate itemTemplate}.
 * @see Controls/columns:View#itemTemplate
 */

/**
 * @name Controls/columns:View#itemTemplate
 * @cfg {Base/Ui:TemplateFunction|String} Шаблон элемента многоколоночного списка.
 * @remark
 * По умолчанию используется шаблон "Controls/columns:ItemTemplate".
 *
 * Базовый шаблон itemTemplate поддерживает следующие параметры:
 * * contentTemplate {Function} — Шаблон содержимого элемента;
 * * highlightOnHover {Boolean} — Выделять элемент при наведении на него курсора мыши.
 * * shadowVisibility {'visible'|'hidden'} - Видимость тени вокруг записи. По умолчанию 'visible'.
 * * cursor {TCursor} — Устанавливает вид {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора мыши} при наведении на строку.
 *
 * В области видимости шаблона доступен объект item, позволяющий получить доступ к данным рендеринга (например, элемент, ключ и т.д.).
 * @example
 * <pre class="brush: html; highlight: [5,6,7,8,9,10,11]">
 * <Controls.columns:View
 *     keyProperty="id"
 *     source="{{_viewSource}}">
 *     <ws:itemTemplate>
 *         <ws:partial template="Controls/columns:ItemTemplate">
 *             <ws:contentTemplate>
 *                 {{itemTemplate.item.getContents().get('title')}}
 *             </ws:contentTemplate>
 *         </ws:partial>
 *     </ws:itemTemplate>
 * </Controls.columns:View>
 * </pre>
 */

/**
 * @name Controls/columns:View#columnMinWidth
 * @cfg {Number} Минимальная ширина колонки.
 * @default 270
 * @example
 * <pre class="brush: html;">
 * <Controls.columns:View
 *     keyProperty="id"
 *     columnMinWidth="{{300}}"
 *     columnMaxWidth="{{500}}"
 *     source="{{ _viewSource }}"/>
 * </pre>
 * @see columnMaxWidth
 */

/**
 * @name Controls/columns:View#columnMaxWidth
 * @cfg {Number} Максимальная ширина колонки.
 * @default 400
 * @example
 * <pre class="brush: html;">
 * <Controls.columns:View
 *     keyProperty="id"
 *     columnMinWidth="{{300}}"
 *     columnMaxWidth="{{500}}"
 *     source="{{_viewSource}}"/>
 * </pre>
 * @see columnMinWidth
 */

/**
 * @name Controls/columns:View#initialWidth
 * @cfg {Number} Начальная ширина, которая будет использоваться для расчетов при первом построении.
 * @default undefined
 * @see columnsCount
 */

/**
 * @name Controls/columns:View#columnsCount
 * @cfg {Number} Используется для первого построения, если не задана опция {@link initialWidth}.
 * @default 2
 * @see initialWidth
 */

/**
 * @typedef {String} Controls/columns:View/ColumnsMode
 * @variant auto Автоматическое распределение записей по колонкам.
 * @variant fixed Каждая запись располагается в заранее определенную колонку.
 */

/**
 * @name Controls/columns:View#columnProperty
 * @cfg {String} Свойство элемента данных, содержащее индекс колонки (начиная с 0),
 * в которую будет распределен элемент при {@link columnsMode}: 'fixed'.
 * @default column
 */

/**
 * @name Controls/columns:View#columnsMode
 * @cfg {Controls/columns:View/ColumnsMode.typedef} Режим распределения записей по колонкам.
 * @default auto
 * @remark
 * Дополнительно необходимо задать значение для опции {@link columnProperty}, а также для каждого элемента данных в соответствующем поле указать номер колонки.
 */

/**
 * @typedef {String} Controls/_columns/View/TColumnsPadding
 * @description Допустимые значения для свойств отступов в контроле Controls/columns:View.
 * @variant null Нулевой отступ
 * @variant 3xs Минимальный отступ
 * @variant 2xs Почти минимальный отступ
 * @variant xs Очень маленький отступ
 * @variant s Маленький отступ
 * @variant m Средний отступ
 * @variant l Большой отступ
 * @variant xl Очень большой отступ
 * @variant 2xl Максимальный отступ
 */
export type TColumnsPadding = null | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';

/**
 * Интерфейс объекта для настройки вертикальных и горизонтальных отступов записи многоколоночного списка.
 * @interface Controls/_columns/View/IColumnsItemPadding
 * @public
 */
export interface IColumnsItemPadding {
    /**
     * Отступ сверху от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/View/TColumnsPadding.typedef}
     * @default m
     */
    top: TColumnsPadding;
    /**
     * Отступ справа от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/View/TColumnsPadding.typedef}
     * @default m
     */
    right: TColumnsPadding;
    /**
     * Отступ снизу от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/View/TColumnsPadding.typedef}
     * @default m
     */
    bottom: TColumnsPadding;
    /**
     * Отступ слева от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/View/TColumnsPadding.typedef}
     * @default m
     */
    left: TColumnsPadding;
}

/**
 * @name Controls/columns:View#itemPadding
 * @cfg {Controls/_columns/View/IColumnsItemPadding} Конфигурация отступов между записями.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.columns:View source="{{_viewSource}}">
 *    <ws:itemPadding
 *       top="l"
 *       bottom="l"
 *       left="l"
 *       right="l"/>
 * </Controls.columns:View>
 * </pre>
 */

/**
 * @name Controls/columns:View#itemsContainerPadding
 * @cfg {Controls/_columns/View/IColumnsItemPadding} Конфигурация отступов между крайними записями и контейнером.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.columns:View source="{{_viewSource}}">
 *    <ws:itemsContainerPadding
 *       top="l"
 *       bottom="l"
 *       left="l"
 *       right="l"/>
 * </Controls.columns:View>
 * </pre>
 */

/**
 * @event tagClick Происходит при клике на уголок-тег записи многоколоночного списка.
 * @name Controls/columns:View#tagClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/_columns/interface/ItemTemplate#tagStyle tagStyle} шаблона записи или {@link Controls/_interface/ITagStyle#tagStyleProperty на списке.
 * @see tagStyle
 * @see tagHover
 */

/**
 * @event tagHover Происходит при наведении курсора мыши на тег-уголок записи многоколоночного списка.
 * @name Controls/columns:View#tagHover
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/_columns/interface/ItemTemplate#tagStyle tagStyle} шаблона записи или {@link Controls/_interface/ITagStyle#tagStyleProperty на списке.
 * @see tagClick
 */
