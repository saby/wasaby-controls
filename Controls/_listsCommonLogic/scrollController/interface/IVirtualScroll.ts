/**
 * @kaizen_zone 7ce091f5-0f3b-4c44-b8c6-e36be72a137c
 */
export type IDirection = 'up' | 'down';
export type TVirtualScrollMode = 'remove' | 'hide';

/**
 * Конфигурация виртуального скролла
 * @interface Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig
 *
 * @public
 */

/*
 * Virtual scroll config
 * @interface Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig
 *
 * @public
 * @author Авраменко А.С.
 */
export interface IVirtualScrollConfig {
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#pageSize
     * @cfg {Number} Количество отображаемых элементов при инициализации списка.
     */
    pageSize?: number;
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#segmentSize
     * @cfg {Number} Количество подгружаемых элементов при скроллировании. По умолчанию равен четверти размера виртуальной страницы, который задан в опции pageSize.
     * @default {@link pageSize}/4
     */
    segmentSize?: number;
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#itemHeightProperty
     * @cfg {String} Имя поля, которое содержит высоту элемента.
     * @default undefined
     */
    itemHeightProperty?: string;
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#viewportHeight
     * @cfg {Number} Высота контейнера со списком.
     * @default undefined
     */
    viewportHeight?: number;
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#mode
     * @cfg {String} Режим управления элементами виртуального скролла.
     * @variant remove Скрытые элементы удаляются из DOM.
     * @variant hide Скрытые элементы скрываются из DOM с помощью ws-hidden.
     * @default remove
     */
    mode?: TVirtualScrollMode;
    /**
     * @name Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig#calcByOffset
     * @cfg {Boolean} Выполнять расчёты на основе отступов элементов (вместо их размеров).
     * @description https://online.sbis.ru/opendoc.html?guid=5621c068-ee66-45d7-b671-ebb54391d98a
     * @hidden
     */
    calcByOffset?: boolean;
}

/**
 * Интерфейс списков, поддерживающих {@link /doc/platform/developmentapl/interface-development/controls/list/performance-optimization/virtual-scroll/ виртуальное скроллирование}.
 * @public
 */
export interface IVirtualScroll {
    '[Controls/_list/interface/IVirtualScroll]': true;
}

/**
 * @name Controls/_baseList/interface/IVirtualScroll#virtualScrollConfig
 * @cfg {Controls/_baseList/interface/IVirtualScroll/IVirtualScrollConfig} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/performance-optimization/virtual-scroll/ виртуального скролла}.
 * @remark
 * Виртуальный скролл работает только при включенной {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в виде {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/ бесконечной прокрутки}.
 * @example
 * В следующем примере показана конфигурация виртуального скролла: в свойстве pageSize задан размер виртуальной страницы.
 * Также задана конфигурация навигации в опции navigation.
 * <pre class="brush: html; highlight: [4,5]">
 * <!-- WML -->
 * <Controls.scroll:Container ...>
 *     <Controls.list:View
 *         source="{{_viewSource}}"
 *         navigation="{{_options.navigation}}">
 *         <ws:virtualScrollConfig pageSize="{{100}}"/>
 *     </Controls.list:View>
 * </Controls.scroll:Container>
 * </pre>
 * @demo Controls-demo/list_new/VirtualScroll/ConstantHeights/Default/Index
 * @see Controls/interface:INavigation#navigation
 */

/**
 * @event Controls/_baseList/interface/IVirtualScroll#enableVirtualNavigation Происходит при использовании виртуального скролла, когда список находится в такой позиции, что сверху и снизу списка есть скрытые (или доступные для загрузки) элементы.
 * @remark По этому событию скрывается контент {@link Controls/scroll:VirtualScrollContainer} с опцией position, соответствующей параметру в событии.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {'top' | 'bottom'} position Положение, в котором будет скрыт контент Controls/scroll:VirtualScrollContainer.
 * @see disableVirtualNavigation
 */

/**
 * @event Controls/_baseList/interface/IVirtualScroll#disableVirtualNavigation Происходит при использовании виртуального скролла, когда список находится в такой позиции, что сверху или снизу списка нет скрытых (или доступных для загрузки) элементов.
 * @remark По этому событию показывается контент {@link Controls/scroll:VirtualScrollContainer} с опцией position соответствующей параметру в событии.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {'top' | 'bottom'} position Положение, в котором будет скрыт контент Controls/scroll:VirtualScrollContainer.
 * @see enableVirtualNavigation
 */
