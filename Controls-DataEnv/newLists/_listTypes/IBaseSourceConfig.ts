/**
 *
 */
export type TNavigationDirection = 'backward' | 'forward' | 'bothways';

/**
 *
 */
export type IBaseSourceConfig = IBasePositionSourceConfig | IBasePageSourceConfig;

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
    position?: (string | number)[] | string | number | null;
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
     */
    multiNavigation?: boolean;
}

/**
 * @description Базовая конфигурация для {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#data-parametr Навигация с фиксированным количеством загружаемых записей}.
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
     */
    multiNavigation?: boolean;
}

/**
 * Параметры работы с источником данных, когда необходимо загрузить все записи без учёта настроенной навигации
 * @public
 */
export interface IIgnoreNavigationConfig {
    ignoreNavigation: boolean;
}

/**
 *
 */
export type INavigationSourceConfig =
    | INavigationPositionSourceConfig
    | INavigationPageSourceConfig
    | IIgnoreNavigationConfig;

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
