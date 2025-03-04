import type { CrudEntityKey } from 'Types/source';
import type { DateTime, Date as EntityDate } from 'Types/entity';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationOptionValue#source source}.
 * @variant position  Навигация по курсору. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#cursor здесь}.
 * @variant page Навигация с фиксированным количеством загружаемых записей. {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#page здесь}.
 */
export type TNavigationSource = 'position' | 'page';

/**
 * Виды {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/ визуального представления навигации}.
 * @variant infinity {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/infinite-scrolling/ Бесконечная прокрутка}.
 * Список отображается в виде "бесконечной ленты" записей.
 * Загрузка данных происходит при прокрутке, когда пользователь достигает конца списка.
 * Можно настроить отображение панели с кнопками навигации и подсчетом общего количества записей.
 * @variant pages {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/data-pagination/ Постраничное отображение данных}.
 * Список отображает только одну страницу с записями.
 * Загрузка данных происходит при переходе между страницами.
 * Переход осуществляется с помощью панели с кнопками навигации, рядом с которыми можно настроить отображение количества всех записей и диапазона записей на странице.
 * @variant demand {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/button-more/ Навигация по кнопке "Ещё"}.
 * Список отображается в виде "бесконечной ленты" записей.
 * Загрузка данных происходит при нажатии на кнопку "Ещё", отображаемой в конце списка.
 * Можно настроить отображение числа оставшихся записей.
 * @variant maxCount {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/portion-loading/#max-count Загрузка до достижения заданного числа записей}.
 * Позволяет прекратить загрузку при достижении заданного количества записей.
 * @variant cut
 * Список отображает настроенное количество записей.
 * Загрузка оставшихся записей происходит по кнопке сворачивания/разворачивания.
 * При развернутом списке отображаются все записи, при свернутом количество записей настраивается в параметре pageSize.
 * Чтобы перерисовался cut при добавлении или удалении записей, нужно позвать {@link /docs/js/Controls-DataEnv/list/View/methods/reload/ reload}
 */
export type TNavigationView = 'infinity' | 'pages' | 'demand' | 'maxCount' | 'cut';

/**
 * @variant forward loading data after positional record.
 * @variant backward loading data before positional record.
 * @variant bothways loading data in both directions relative to the positional record.
 */
export type TNavigationDirection = 'backward' | 'forward' | 'bothways';

/**
 * Тип для функции обратного вызова, которая принимает в аргумент номер страницы и возвращает эмодзи.
 * Используется для {@link INavigationViewConfig Конфигурации визуального представления навигации}.
 */
export type TDigitRenderCallback = (index: number) => {};

/**
 * Тип курсора
 */
export type TPosition = string | number | Date | EntityDate | DateTime;
/**
 * Начальная позиция для курсора.
 * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source-position здесь}.
 */
export type TPositionField = TPosition | TPosition[] | null;

/**
 * Конфигурация источника данных для перезагрузки при {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#cursor навигации по курсору}.
 */
export interface IBasePositionSourceConfig {
    /**
     * Начальная позиция для курсора.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source-position здесь}.
     */
    position?: TPositionField;
    /**
     * Направление выборки.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source-direction здесь}.
     */
    direction?: TNavigationDirection;
    /**
     * Количество записей, которые запрашиваются при выборке.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source-limit здесь}.
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

/**
 * Параметры работы с источником данных для режима {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source Навигация по курсору}.
 */
export interface INavigationPositionSourceConfig extends IBasePositionSourceConfig {
    /**
     * Имя поля или массив с именами полей, для которых в целевой таблице БД создан индекс.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#parametr-source-field здесь}.
     */
    field: string[] | string;
}

/*
 * @typedef {Object} Controls-DataEnv/_interface/INavigation/IBasePageSourceConfig
 * @description Базовая конфигурация для {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
 * @property {Number} page Номер загружаемой страницы.
 * @property {Number} pageSize Размер загружаемой страницы.
 */

/**
 * Базовая конфигурация для {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
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

/**
 * Параметры работы с источником данных для режима {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
 */
export interface INavigationPageSourceConfig extends IBasePageSourceConfig {
    /**
     * Признак наличия записей для загрузки. Подробнее об использовании параметра читайте <a href="/doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/#data-parametr-hasmore">здесь</a>.
     */
    hasMore?: boolean;
}

/**
 * Параметры работы с источником данных, когда необходимо загрузить все записи без учёта настроенной навигации
 */
export interface IIgnoreNavigationConfig {
    ignoreNavigation: boolean;
}

/**
 * Source configuration for both page-based and position-based (cursor) navigation.
 */
export type INavigationSourceConfig =
    | INavigationPositionSourceConfig
    | INavigationPageSourceConfig
    | IIgnoreNavigationConfig;

/**
 * Конфигурация источника данных для навигации. Может быть объектом, реализующим один из двух интерфейсов:
 * * {@link Controls-DataEnv/listTypes:IBasePositionSourceConfig Конфигурация при курсорной навингации}.
 * * {@link Controls-DataEnv/listTypes:IBasePageSourceConfig Конфигурация c фиксированным количеством загружаемых записей}.
 * Также, в конфигурации можно передать опцию multiNavigation, если метод БЛ поддерживает работу с {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/tree-column/node/managing-node-expand/#multi-navigation множественной навигацией}.
 */
export type IBaseSourceConfig = IBasePositionSourceConfig | IBasePageSourceConfig;

/**
 * Конфигурация источника данных для навигации по узлам дерева.
 * Задаётся в виде {@link Map https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):
 * ключ - идентификатор узла или null (для корня дерева)
 * значение - {@link конфигурация Controls-DataEnv/_interface/INavigation/IBaseSourceConfig.typedef} источника данных для навигации
 *
 * Конфигурация источника данных для навигации должна быть одного типа (постраничная или по курсору) для всех узлов.
 * @example
 * <pre>
 *     const navSourceConfig = new Map();
 *
 *     // зададим навигацию для корня
 *     navSourceConfig.set(null, { position: 'myKey', limit: 100 });
 *
 *     // зададим навигацию для папки
 *     navSourceConfig.set('folderId', { position: null, limit: 200 });
 *
 *     grid.reload(true, navSourceConfig);
 * </pre>
 */
export type IMultiBaseSourceConfig<T extends IBaseSourceConfig = IBaseSourceConfig> = Map<
    CrudEntityKey,
    T
>;

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#totalInfo totalInfo}.
 * @variant basic Отображается только общее число записей.
 * @variant extended Отображается общее число записей, номера первой и последней записей на текущей странице, а также размер страницы.
 */
export type TNavigationTotalInfo = 'basic' | 'extended';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#pagingMode pagingMode}.
 * @variant hidden Предназначен для отключения отображения пейджинга в реестре.
 * @variant basic Предназначен для пейджинга в реестре с подгрузкой по скроллу.
 * @variant viewport Предназначен для пейджинга с отображением только двух кнопок.
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
    | 'direct'
    | 'viewport';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#pagingPadding pagingPadding}.
 * @variant default Предназначен для отображения отступа под пэйджинг.
 * @variant null Предназначен для отключения отображения отступа под пэйджинг.
 */
export type TNavigationPagingPadding = 'default' | 'null';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#pagingPosition pagingPosition}.
 * @variant left Отображения пэйджинга слева.
 * @variant right Отображения пэйджинга справа.
 */
export type TNavigationPagingPosition = 'left' | 'right';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#resetButtonMode resetButtonMode}.
 * @variant home Отображение кнопки возврата к исходной позиции в виде иконки домика.
 * @variant day Отображение кнопки возврата к исходной позиции в виде иконки с сегодняшним числа.
 */
export type TNavigationResetButtonMode = 'home' | 'day';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationViewConfig#buttonView buttonView}.
 * @variant separator кнопка подгрузки данных в виде {@link Controls-DataEnv/ShowMoreButton разделителя с тремя точками}
 * @variant link кнопка подгрузки данных в виде текстовой ссылки
 */
export type TNavigationButtonView = 'separator' | 'link';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationButtonConfig#size size}.
 * @variant s малый
 * @variant m средний
 * @variant l большой
 */
export type TNavigationButtonSize = 's' | 'm' | 'l';

/**
 * Допустимые значения для параметра {@link Controls-DataEnv/listTypes:INavigationButtonConfig#buttonPosition buttonPosition}.
 * @variant start по левому краю контентной области
 * @variant center по центру контентной области
 * @variant custom расположение кнопки по своему усмотрению
 */
export type TNavigationButtonPosition = 'start' | 'center' | 'custom';

/**
 * Конфигурация кнопки подгрузки данных.
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
 * Параметры для конфигурации {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/ визуального представления навигации}.
 */
export interface INavigationViewConfig {
    /**
     * Внешний вид пэйджинга. Позволяет для каждого конкретного реестра задать внешний вид в зависимости от требований к интерфейсу.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/ здесь}.
     * @default hidden
     */
    pagingMode?: TNavigationPagingMode;
    /**
     * Режим отображения информационной подписи.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/data-pagination/ здесь}.
     * @default basic
     */
    totalInfo?: TNavigationTotalInfo;
    /**
     * Предельное число записей, по достижении которого подгрузка записей прекращается.
     * Подробнее об использовании свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/portion-loading/#max-count здесь}.
     */
    maxCountValue?: number;
    /**
     * Видимость кнопки перехода в конец списка.
     * Когда параметр принимает значение true, кнопка отображается.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/infinite-scrolling/ здесь}.
     * @default false
     */
    showEndButton?: boolean;
    /**
     * Режим отображения кнопки возврата к начальной позиции.
     * Если не указывать значение из допустимых, кнопка не отображается.
     * Пример использования свойства читайте {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/infinite-scrolling/ здесь}.
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
    /**
     * Опция, позволяющая задавать отображение эмодзи вместо номеров страниц
     * Колбэк - функция, устанавливает соотвествие между номером страницы и эмодзи
     * @demo Controls-demo/list_new/Navigation/Paging/WI/DigitsView/Index
     */
    digitRenderCallback?: TDigitRenderCallback;
}

/**
 * Конфигурация {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/ списке}.
 */
export interface INavigationOptionValue<U> {
    /**
     * Режим {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/ работы с источником данных}.
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
     * Вид {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/ визуального представления навигации}.
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
     * Конфигурация режима {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/data-source/ работы с источником данных}.
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
     * Конфигурация вида {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/visual-mode/ визуального представления навигации}.
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

/**
 * Часть общей конфигурации отвечающая за навигацию в списке
 * */
export interface INavigationOptions<U> {
    navigation?: INavigationOptionValue<U>;
}

/**
 * Интерфейс для контролов, поддерживающих {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/ навигацию}.
 */
export default interface INavigation {
    readonly '[Controls-DataEnv/_interface/INavigation]': boolean;
}

/**
 * Конфигурация {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/Controls-DataEnv/list/ списке}.
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
