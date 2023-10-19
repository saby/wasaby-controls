/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/*
 * @typedef {String} TNavigationSource
 * @variant position Position-based navigation (cursor).
 * @variant page Page-based navigation.
 */
/**
 * @typedef {String} TNavigationSource
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationOptionValue#source source}.
 * @variant position  Навигация по курсору. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#cursor здесь}.
 * @variant page Навигация с фиксированным количеством загружаемых записей. {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#page здесь}.
 */
export type TNavigationSource = 'position' | 'page';

/*
 * @typedef {String} TNavigationView
 * @variant infinity Infinite scroll.
 * @variant pages Pages with paging control.
 * @variant demand Load next when requested (for example, hasMore button clicked).
 * @variant maxCount Load data until threshold value set in {@link Controls/_interface/INavigation/INavigationViewConfig.typedef maxCountValue}.
 */

/**
 * @typedef {String} TNavigationView
 * @description Виды {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/ визуального представления навигации}.
 * @variant infinity {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/ Бесконечная прокрутка}.
 * Список отображается в виде "бесконечной ленты" записей.
 * Загрузка данных происходит при прокрутке, когда пользователь достигает конца списка.
 * Можно настроить отображение панели с кнопками навигации и подсчетом общего количества записей.
 * @variant pages {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/data-pagination/ Постраничное отображение данных}.
 * Список отображает только одну страницу с записями.
 * Загрузка данных происходит при переходе между страницами.
 * Переход осуществляется с помощью панели с кнопками навигации, рядом с которыми можно настроить отображение количества всех записей и диапазона записей на странице.
 * @variant demand {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/button-more/ Навигация по кнопке "Ещё"}.
 * Список отображается в виде "бесконечной ленты" записей.
 * Загрузка данных происходит при нажатии на кнопку "Ещё", отображаемой в конце списка.
 * Можно настроить отображение числа оставшихся записей.
 * @variant maxCount {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/portion-loading/#max-count Загрузка до достижения заданного числа записей}.
 * Позволяет прекратить загрузку при достижении заданного количества записей.
 * @variant cut
 * Список отображает настроенное количество записей.
 * Загрузка оставшихся записей происходит по кнопке сворачивания/разворачивания.
 * При развернутом списке отображаются все записи, при свернутом количество записей настраивается в параметре pageSize.
 * Чтобы перерисовался cut при добавлении или удалении записей, нужно позвать {@link /docs/js/Controls/list/View/methods/reload/ reload}
 */
export type TNavigationView = 'infinity' | 'pages' | 'demand' | 'maxCount' | 'cut';

/**
 * @typedef {String} TNavigationDirection
 * @description Допустимые значения для свойства {@link Controls/interface:IBasePositionSourceConfig#direction direction}.
 * @variant forward Вниз.
 * @variant backward Вверх.
 * @variant bothways В обоих направлениях.
 */

/*
 * @typedef {String} TNavigationDirection
 * @variant forward loading data after positional record.
 * @variant backward loading data before positional record.
 * @variant bothways loading data in both directions relative to the positional record.
 */
export type TNavigationDirection = 'backward' | 'forward' | 'bothways';

/*
 * @typedef {Object} Controls/_interface/INavigation/IBasePositionSourceConfig
 * @description Конфигурация источника данных для перезагрузки при навигации по курсору.
 * Подробнее о данном типе навигации читайте {@link /doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/cursor/ здесь}.
 */
/**
 * @description Конфигурация источника данных для перезагрузки при {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#cursor навигации по курсору}.
 * @public
 * @see Controls/_interface/INavigation/INavigationPositionSourceConfig
 */
export interface IBasePositionSourceConfig {
    /**
     * Начальная позиция для курсора.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source-position здесь}.
     */
    position?: (string | number)[] | string | number;
    /**
     * Направление выборки.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source-direction здесь}.
     */
    direction?: TNavigationDirection;
    /**
     * Количество записей, которые запрашиваются при выборке.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source-limit здесь}.
     */
    limit?: number;
    /**
     * Включает режим {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/navigate/multinavigation/ множественной навигации}.
     * @default false
     * @example
     * <pre class="brush: html; highlight: [9]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:navigation source="position" view="infinity">
     *       <ws:sourceConfig
     *          field="id"
     *          position="{{_position}}"
     *          direction="bothways"
     *          limit="{{20}}"
     *          multiNavigation="{{true}}" />
     *       <ws:viewConfig totalInfo="basic"/>
     *    </ws:navigation>
     * </Controls.list:View>
     * </pre>
     */
    multiNavigation?: boolean;
}

/*
 * @name Controls/_interface/INavigation/INavigationPositionSourceConfig
 * @description Source configuration for position-based (cursor) navigation.
 */
/**
 * @description Параметры работы с источником данных для режима {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source Навигация по курсору}.
 * @public
 */
export interface INavigationPositionSourceConfig extends IBasePositionSourceConfig {
    /**
     * Имя поля или массив с именами полей, для которых в целевой таблице БД создан индекс.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source-field здесь}.
     */
    field: string[] | string;
}

/*
 * @typedef {Object} Controls/_interface/INavigation/IBasePageSourceConfig
 * @description Базовая конфигурация для {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
 * @property {Number} page Номер загружаемой страницы.
 * @property {Number} pageSize Размер загружаемой страницы.
 */

/**
 * @description Базовая конфигурация для {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
 *
 * @public
 */
export interface IBasePageSourceConfig {
    /**
     * Номер загружаемой страницы.
     */
    page?: number;
    /**
     * Размер загружаемой страницы.
     */
    pageSize: number;
    /**
     * Включает режим {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/navigate/multinavigation/ множественной навигации}.
     * @default false
     * @example
     * <pre class="brush: html; highlight: [8]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:navigation source="page" view="pages">
     *       <ws:sourceConfig
     *          pageSize="{{10}}"
     *          page="{{0}}"
     *          hasMore="{{false}}"
     *          multiNavigation="{{true}}" />
     *       <ws:viewConfig totalInfo="basic"/>
     *    </ws:navigation>
     * </Controls.list:View>
     * </pre>
     */
    multiNavigation?: boolean;
}

/*
 * @typedef {Object} Controls/_interface/INavigation/INavigationPageSourceConfig
 * @description Source configuration for page-based navigation.
 * @property {Number} page Loading page number.
 * @property {Number} pageSize Loading page size.
 * @property {Boolean} hasMore If hasMore field has false value, similar parameter is added to request. In response instead of receiving a flag for the presence of records (boolean value), the total count of records is expected (number value).
 */
/**
 * @description Параметры работы с источником данных для режима {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
 * @public
 */
export interface INavigationPageSourceConfig extends IBasePageSourceConfig {
    /**
     * Признак наличия записей для загрузки. Подробнее об использовании параметра читайте <a href="/doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#data-parametr-hasmore">здесь</a>.
     */
    hasMore?: boolean;
}

/**
 * Параметры работы с источником данных, когда необходимо загрузить все записи без учёта настроенной навигации
 * @public
 */
export interface IIgnoreNavigationConfig {
    ignoreNavigation: boolean;
}

/*
 * @typedef {Object} INavigationSourceConfig
 * @description Source configuration for both page-based and position-based (cursor) navigation.
 */
export type INavigationSourceConfig =
    | INavigationPositionSourceConfig
    | INavigationPageSourceConfig
    | IIgnoreNavigationConfig;

/**
 * @typedef Controls/_interface/INavigation/IBaseSourceConfig
 * @description
 * Конфигурация источника данных для навигации. Может быть объектом, реализующим один из двух интерфейсов:
 * * {@link Controls/interface:IBasePositionSourceConfig Конфигурация при курсорной навингации}.
 * * {@link Controls/interface:IBasePageSourceConfig Конфигурация c фиксированным количеством загружаемых записей}.
 * Также, в конфигурации можно передать опцию multiNavigation, если метод БЛ поддерживает работу с {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/managing-node-expand/#multi-navigation множественной навигацией}.
 */
export type IBaseSourceConfig = IBasePositionSourceConfig | IBasePageSourceConfig;

/**
 * @typedef {String} TNavigationTotalInfo
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#totalInfo totalInfo}.
 * @variant basic Отображается только общее число записей.
 * @variant extended Отображается общее число записей, номера первой и последней записей на текущей странице, а также размер страницы.
 */
export type TNavigationTotalInfo = 'basic' | 'extended';

/**
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#pagingMode pagingMode}.
 * @typedef {String} Controls/_interface/INavigation/TNavigationPagingMode
 * @variant hidden Предназначен для отключения отображения пейджинга в реестре.
 * @variant basic Предназначен для пейджинга в реестре с подгрузкой по скроллу.
 * @variant edge Предназначен для пейджинга с отображением одной команды прокрутки. Отображается кнопка в конец, либо в начало, в зависимости от положения.
 * @variant edges Предназначен для пейджинга с отображением двух команд прокрутки. Отображается кнопка в конец и в начало.
 * @variant end Предназначен для пейджинга с отображением одной команды прокрутки. Отображается только кнопка в конец.
 * @variant numbers Предназначен для пейджинга с подсчетом записей и страниц.
 * @variant direct Значение устарело и будет удалено. Используйте значение basic.
 */
export type TNavigationPagingMode =
    | 'hidden'
    | 'basic'
    | 'edge'
    | 'edges'
    | 'end'
    | 'numbers'
    | 'direct';

/**
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#pagingPadding pagingPadding}.
 * @typedef {String} TNavigationPagingPadding
 * @variant default Предназначен для отображения отступа под пэйджинг.
 * @variant null Предназначен для отключения отображения отступа под пэйджинг.
 */
export type TNavigationPagingPadding = 'default' | 'null';

/**
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#pagingPosition pagingPosition}.
 * @typedef {String} TNavigationPagingPosition
 * @variant left Отображения пэйджинга слева.
 * @variant right Отображения пэйджинга справа.
 */
export type TNavigationPagingPosition = 'left' | 'right';

/**
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#resetButtonMode resetButtonMode}.
 * @typedef {String} TNavigationResetButtonMode
 * @variant home Отображение кнопки возврата к исходной позиции в виде иконки домика.
 * @variant day Отображение кнопки возврата к исходной позиции в виде иконки с сегодняшним числа.
 */
export type TNavigationResetButtonMode = 'home' | 'day';

/**
 * @typedef {String} TNavigationButtonView
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationViewConfig#buttonView buttonView}.
 * @variant separator кнопка подгрузки данных в виде {@link Controls/ShowMoreButton разделителя с тремя точками}
 * @variant link кнопка подгрузки данных в виде текстовой ссылки
 */
export type TNavigationButtonView = 'separator' | 'link';

/**
 * @typedef {String} TNavigationButtonSize
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationButtonConfig#size size}.
 * @variant s малый
 * @variant m средний
 * @variant l большой
 */
export type TNavigationButtonSize = 's' | 'm' | 'l';

/**
 * @typedef {String} TNavigationButtonPosition
 * @description Допустимые значения для параметра {@link Controls/interface:INavigationButtonConfig#buttonPosition buttonPosition}.
 * @variant start по левому краю контентной области
 * @variant center по центру контентной области
 */
export type TNavigationButtonPosition = 'start' | 'center';

/**
 * @description Конфигурация кнопки подгрузки данных.
 * @public
 */
export interface INavigationButtonConfig {
    /**
     * Положение кнопки развертывания.
     * @default center
     */
    buttonPosition?: TNavigationButtonPosition;

    /**
     * Размер кнопки развертывания.
     * @default m
     */
    size?: TNavigationButtonSize;

    /**
     * Флаг, определяющий контрастность фона.
     * @default true
     */
    contrastBackground?: boolean;
}

/**
 * @description Параметры для конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/ визуального представления навигации}.
 * @public
 */
export interface INavigationViewConfig {
    /**
     * Внешний вид пэйджинга. Позволяет для каждого конкретного реестра задать внешний вид в зависимости от требований к интерфейсу.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/ здесь}.
     * @default hidden
     */
    pagingMode?: TNavigationPagingMode;
    /**
     * Режим отображения информационной подписи.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/data-pagination/ здесь}.
     * @default basic
     */
    totalInfo?: TNavigationTotalInfo;
    /**
     * Предельное число записей, по достижении которого подгрузка записей прекращается.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/portion-loading/#max-count здесь}.
     */
    maxCountValue?: number;
    /**
     * Видимость кнопки перехода в конец списка.
     * Когда параметр принимает значение true, кнопка отображается.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/ здесь}.
     * @default false
     */
    showEndButton?: boolean;
    /**
     * Режим отображения кнопки возврата к начальной позиции.
     * Если не указывать значение из допустимых, кнопка не отображается.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/ здесь}.
     */
    resetButtonMode?: TNavigationResetButtonMode;
    /**
     * Опция управляет отображением отступа под пэйджинг.
     * @default default
     */
    pagingPadding?: TNavigationPagingPadding;
    /**
     * Опция управляет позицией пэйджинга.
     * @default right
     */
    pagingPosition?: TNavigationPagingPosition;
    /**
     * Вид кнопки подгрузки данных
     * @default default
     */
    buttonView?: TNavigationButtonView;
    /**
     * Настройки кнопки подгрузки данных
     * @see buttonView
     */
    buttonConfig?: INavigationButtonConfig;
}

/**
 * @description Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 * @public
 */
export interface INavigationOptionValue<U> {
    /**
     * @name Controls/_interface/INavigation/INavigationOptionValue#source
     * @cfg {Controls/interface:INavigation/TNavigationSource.typedef} Режим {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/ работы с источником данных}.
     * @example
     * <pre class="brush: html; highlight: [3]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     * <ws:navigation source="position" view="pages">
     *     <ws:sourceConfig
     *         pageSize="{{25}}"
     *         page="{{0}}"
     *         hasMore="{{false}}"/>
     * </ws:navigation>
     * </Controls.list:View>
     * </pre>
     */
    source?: TNavigationSource;
    /**
     * @name Controls/_interface/INavigation/INavigationOptionValue#view
     * @cfg {Controls/interface:INavigation/TNavigationView.typedef} Вид {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/ визуального представления навигации}.
     * @example
     * <pre class="brush: html; highlight: [4]">
     * <!-- WML -->
     * <Controls.scroll:Container>
     *     <Controls.list:View source="{{_viewSource}}">
     *         <ws:navigation source="page" view="infinity"/>
     *     </Controls.list:View>
     * </Controls.scroll:Container>
     * </pre>
     */
    view?: TNavigationView;
    /**
     * @name Controls/_interface/INavigation/INavigationOptionValue#sourceConfig
     * @cfg {Controls/interface:INavigationPositionSourceConfig | Controls/interface:INavigationPageSourceConfig} Конфигурация режима {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/ работы с источником данных}.
     * @example
     * Пример конфигурации режима работы с источником данных для навигации по курсору.
     * <pre class="brush: html; highlight: [4]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:navigation source="position" view="infinity">
     *       <ws:sourceConfig field="id" position="{{_position}}" direction="bothways" limit="{{20}}"/>
     *    </ws:navigation>
     * </Controls.list:View>
     * </pre>
     * Пример конфигурации режима  работы с источником данных для навигации с фиксированным количеством загружаемых записей.
     * <pre class="brush: html; highlight: [4]">
     * <!-- WML -->
     * <Controls.list:View keyProperty="id" source="{{_viewSource}}">
     *    <ws:navigation source="page" view="pages">
     *       <ws:sourceConfig pageSize="{{25}}" page="{{0}}" hasMore="{{false}}"/>
     *       <ws:viewConfig pagingMode="basic" totalInfo="basic"/>
     *    </ws:navigation>
     * </Controls.list:View>
     * </pre>
     */
    sourceConfig?: U;
    /**
     * @name Controls/_interface/INavigation/INavigationOptionValue#viewConfig
     * @cfg {Controls/interface:INavigationViewConfig} Конфигурация вида {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/ визуального представления навигации}.
     * @example
     * <pre class="brush: html; highlight: [5]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *     <ws:navigation source="page" view="pages">
     *         <ws:sourceConfig pageSize="{{10}}" page="{{0}}" hasMore="{{false}}"/>
     *         <ws:viewConfig totalInfo="basic"/>
     *     </ws:navigation>
     * </Controls.list:View>
     * </pre>
     */
    viewConfig?: INavigationViewConfig;
}

export interface INavigationOptions<U> {
    navigation?: INavigationOptionValue<U>;
}

/*
 * Interface for list navigation.
 *
 * @interface Controls/_interface/INavigation
 * @public
 * @author Крайнов Д.О.
 */

/**
 * Интерфейс для контролов, поддерживающих {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигацию}.
 *
 * @public
 */
export default interface INavigation {
    readonly '[Controls/_interface/INavigation]': boolean;
}

/**
 * @name Controls/_interface/INavigation#navigation
 * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 * @example
 * В этом примере в списке будут отображаться 2 элемента.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_source}}"
 *    navigation="{{_navigation}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * _beforeMount: function(options) {
 *    this._source = new Memory({
 *      keyProperty: 'id',
 *      data: [
 *         {
 *            id: '1',
 *            title: 'Yaroslavl'
 *         },
 *         {
 *            id: '2',
 *            title: 'Moscow'
 *         },
 *         {
 *            id: '3',
 *            title: 'St-Petersburg'
 *         }
 *      ]
 *    });
 *    this._navigation: INavigationOptionValue<INavigationPageSourceConfig> = {
 *       source: 'page',
 *       view: 'pages',
 *       sourceConfig: {
 *          pageSize: 2,
 *          page: 0
 *       }
 *    };
 * }
 * </pre>
 * @demo Controls-demo/list_new/Navigation/ScrollPaging/Index
 */

/*
 * @name Controls/_interface/INavigation#navigation
 * @cfg {Navigation} List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.)
 * @example
 * In this example, 2 items will be displayed in the list.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View
 *    keyProperty="id"
 *    source="{{_source}}"
 *    navigation="{{_navigation}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * _beforeMount: function(options) {
 *    this._source = new Memory({
 *      keyProperty: 'id',
 *      data: [
 *         {
 *            id: '1',
 *            title: 'Yaroslavl'
 *         },
 *         {
 *            id: '2',
 *            title: 'Moscow'
 *         },
 *         {
 *            id: '3',
 *            title: 'St-Petersburg'
 *         }
 *      ]
 *    });
 *    this._navigation: INavigationOptionValue<INavigationPageSourceConfig> = {
 *       source: 'page',
 *       view: 'pages',
 *       sourceConfig: {
 *          pageSize: 2,
 *          page: 0
 *       }
 *    };
 * }
 * </pre>
 */
