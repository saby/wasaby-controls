import { TemplateFunction } from 'UI/Base';

/**
 * @typedef {String} Controls/_columns/interface/IColumnsView/TColumnsPadding
 * @description Допустимые значения для свойств отступов в контроле Controls/columns:View.
 * @variant null Нулевой отступ
 * @variant 3xs Минимальный отступ
 * @variant 2xs Почти минимальный отступ
 * @variant xs Очень маленький отступ
 * @variant s Маленький отступ
 * @variant m Средний отступ
 * @variant l Большой отступ
 * @variant xl Отступ xl
 * @variant 2xl Отступ 2xl
 * @variant 3xl Отступ 3xl
 */

export type TColumnsPadding = null | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

/**
 * Интерфейс объекта для настройки вертикальных и горизонтальных отступов записи многоколоночного списка.
 * @interface Controls/_columns/interface/IColumnsView/IColumnsItemPadding
 * @public
 */
export interface IColumnsItemPadding {
    /**
     * Отступ сверху от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/interface/IColumnsView/TColumnsPadding.typedef}
     * @default m
     */
    top: TColumnsPadding;
    /**
     * Отступ справа от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/interface/IColumnsView/TColumnsPadding.typedef}
     * @default m
     */
    right: TColumnsPadding;
    /**
     * Отступ снизу от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/interface/IColumnsView/TColumnsPadding.typedef}
     * @default m
     */
    bottom: TColumnsPadding;
    /**
     * Отступ слева от записи. Если свойство принимает значение null, то отступ отсутствует.
     * @cfg {Controls/_columns/interface/IColumnsView/TColumnsPadding.typedef}
     * @default m
     */
    left: TColumnsPadding;
}

/**
 * @typedef {String} Controls/_columns/interface/IColumnsView/ColumnsMode
 * @variant auto Автоматическое распределение записей по колонкам.
 * @variant fixed Каждая запись располагается в заранее определенную колонку.
 */
export type ColumnsMode = 'auto' | 'fixed';

/**
 * @interface Controls/_columns/interface/IColumnsView
 * @public
 */
export interface IColumnsView {
    /**
     * @name Controls/_columns/interface/IColumnsView#itemTemplateProperty
     * @cfg {String} Имя поля элемента, которое содержит имя {@link Controls/_columns/interface/IColumnsView#itemTemplate шаблона отображения элемента}. С помощью этой настройки отдельным элементам можно задать собственный шаблон отображения.
     * @demo Controls-demo/list_new/ColumnsView/TemplateProperty/Index
     * @remark
     * Если не задано значение в опции itemTemplateProperty или в свойстве элемента, то используется шаблон из {@link Controls/_columns/interface/IColumnsView#itemTemplate itemTemplate}.
     * @see Controls/_columns/interface/IColumnsView#itemTemplate
     */
    itemTemplateProperty?: string;

    /**
     * @name Controls/_columns/interface/IColumnsView#itemTemplate
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
    itemTemplate?: TemplateFunction | string;

    /**
     * @name Controls/_columns/interface/IColumnsView#columnMinWidth
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
    columnMinWidth?: number;

    /**
     * @name Controls/_columns/interface/IColumnsView#columnMaxWidth
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
    columnMaxWidth?: number;

    /**
     * @name Controls/_columns/interface/IColumnsView#initialWidth
     * @cfg {Number} Начальная ширина, которая будет использоваться для расчетов при первом построении.
     * @default undefined
     * @see columnsCount
     */
    initialWidth?: number;

    /**
     * @name Controls/_columns/interface/IColumnsView#columnsCount
     * @cfg {Number} Используется для первого построения, если не задана опция {@link initialWidth}.
     * @default 2
     * @see initialWidth
     */
    columnsCount?: number;

    /**
     * @name Controls/_columns/interface/IColumnsView#columnProperty
     * @cfg {String} Свойство элемента данных, содержащее индекс колонки (начиная с 0),
     * в которую будет распределен элемент при {@link columnsMode}: 'fixed'.
     * @default column
     */
    columnProperty?: string;

    /**
     * @name Controls/_columns/interface/IColumnsView#columnsMode
     * @cfg {Controls/_columns/interface/IColumnsView/ColumnsMode.typedef} Режим распределения записей по колонкам.
     * @default auto
     * @remark
     * Дополнительно необходимо задать значение для опции {@link columnProperty}, а также для каждого элемента данных в соответствующем поле указать номер колонки.
     */
    columnsMode?: ColumnsMode;

    /**
     * @name Controls/_columns/interface/IColumnsView#itemPadding
     * @cfg {Controls/_columns/interface/IColumnsView/IColumnsItemPadding} Конфигурация отступов между записями.
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
     * @see itemsContainerPadding
     */
    itemPadding?: IColumnsItemPadding;

    /**
     * @name Controls/_columns/interface/IColumnsView#itemsContainerPadding
     * @cfg {Controls/_columns/interface/IColumnsView/IColumnsItemPadding} Конфигурация отступов между крайними записями и контейнером.
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
     * @see itemPadding
     */
    itemsContainerPadding: IColumnsItemPadding;

    /**
     * @name Controls/_columns/interface/IColumnsView#autoColumnsRecalculating
     * @cfg {Boolean} Если выставлено в true, то при добавлении/удалении итемов
     * коллекции мы полностью пересчитываем распределение итемов по колонкам
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.columns:View source="{{_viewSource}}
     *                        autoColumnsRecalculating={{true}}"/>
     * </pre>
     */
    autoColumnsRecalculating?: boolean;
}

/**
 * @event Controls/_columns/interface/IColumnsView#tagClick Происходит при клике на уголок-тег записи многоколоночного списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/_columns/interface/ItemTemplate#tagStyle tagStyle} шаблона записи или {@link Controls/_interface/ITagStyle#tagStyleProperty на списке.
 * @see tagStyle
 * @see tagHover
 */

/**
 * @event Controls/_columns/interface/IColumnsView#tagHover Происходит при наведении курсора мыши на тег-уголок записи многоколоночного списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/_columns/interface/ItemTemplate#tagStyle tagStyle} шаблона записи или {@link Controls/_interface/ITagStyle#tagStyleProperty на списке.
 * @see tagStyle
 * @see tagClick
 */