/**
 * Интерфейс контролов, поддерживающих выбор из справочника
 * @public
 */
export default interface ISelector {
    selectorConfig: ISelectorConfig;
}

/**
 * Интерфейс конфигурации кнопки подтверждения на окне выбора
 * @public
 */
export interface IApplyButtonConfig {
    /**
     * Текст кнопки подтверждения
     */
    caption?: string;
    /**
     * Шаблон кнопки подтверждения на окне выбора
     * Используется, когда нужно отобразить свою кнопку
     */
    templateName?: string;
}

/**
 * Интерфейс конфигурации прикладной области
 * @private
 */
export interface IUserAreaConfig {
    /**
     * Название компонента для пользовательской области
     */
    templateName: string;
    /**
     * Объект с опциями, которые будут переданы в шаблон.
     */
    templateOptions?: Record<string, unknown>;
}

/**
 * Интерфейс конфигурации истории выбора
 * @private
 */
export interface IHistoryConfig {
    /**
     * Идентификатор, по которому хранится история выбора
     */
    historyId?: string;
}

/**
 * Интерфейс конфигурации фильтра и поиска
 * @private
 */
export interface IFilterConfig {
    /**
     * Настройка для компонента фильтра
     */
    filterTemplateOptions?: Record<string, unknown>;
    /**
     * Настройки для компонента поиска
     */
    searchTemplateOptions?: Record<string, unknown>;
}

/**
 * Интерфейс конфигурации загрузчиков
 * @private
 */
export interface IPrefetchConfig {
    /**
     * Имя модуля, у которого будет вызван метод getConfig
     */
    configLoader: string;
    /**
     * Аргументы, которые будут переданы в метод getConfig
     */
    configLoaderArguments?: unknown;
}

/**
 * Интерфейс конфигурации вкладки на окне выбора
 * @private
 */
export interface ISelectorTabConfig {
    /**
     * Путь до модуля, экспортирующего фабрики данных
     */
    prefetchConfig: string;
    /**
     * Текст корешка закладки
     */
    tabCaption?: string;
    /**
     * Конфигурация фильтра и поиска
     */
    filterConfig?: IFilterConfig;
    /**
     * Конфигурация рабочей области
     */
    workspaceConfig: IUserAreaConfig;
    /**
     * Конфигурация истории
     */
    historyConfig?: IHistoryConfig;
    /**
     * Конфигурация прикладной области слева от вкладок
     */
    beforeTabsConfig?: IUserAreaConfig;
    /**
     * Конфигурация прикладной области в шапке окна выбора
     */
    topTemplateConfig?: IUserAreaConfig;
}

/**
 * Интерфейс конфигурации окна выбора
 * @public
 */
export interface ISelectorConfig {
    /**
     * Идентификатор активной вкладки на окне выбора
     */
    initialKey?: string;
    /**
     * Конфигурация кнопки подтверждения на окне выбора
     */
    applyButtonConfig?: IApplyButtonConfig;
    /**
     * Фабрика выбора
     */
    selectFactory?: string;
    /**
     * Конфигурация справочников на окне выбора
     * Если справочников несколько, то на окне выбора будут построены вкладки
     */
    configs: Record<string, ISelectorTabConfig>;
}
