import type { Model } from 'Types/entity';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';

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
 * Интерфейс конфигурации тулбара
 * @public
 */
export interface IToolbarConfig {
    /**
     * @cfg {String} Имя модуля, который экспортирует {@link /doc/platform/developmentapl/interface-development/context-data/actions/ массив действий} тулбара
     */
    actions?: string;
    /**
     * @cfg {String} Идентификатор фабрики данных.
     */
    storeId?: string;
}

/**
 * Интерфейс конфигурации прикладной области
 * @public
 */
export interface IUserAreaConfig {
    /**
     * Название компонента для пользовательской области
     */
    templateName?: string;
    /**
     * Объект с опциями, которые будут переданы в шаблон.
     */
    templateOptions?: Record<string, unknown>;
}

/**
 * Интерфейс конфигурации контентной области
 * @public
 */
export interface IContentAreaConfig {
    /**
     * Конфигурация рабочей области окна выбора
     */
    workspaceConfig: IUserAreaConfig;
    /**
     * Конфигурация тулбара
     */
    toolbarConfig?: IToolbarConfig;
}

/**
 * Интерфейс конфигурации истории выбора
 * @public
 */
export interface IHistoryConfig {
    /**
     * Идентификатор, по которому хранится история выбора
     */
    historyId?: string;
    /**
     * Метод получения загруженных записей
     */
    getMethod?: 'query' | 'meta';
    /**
     * Кастомный загрузчик записей истории, конфигурируемый в формате фабрики
     */
    loader?: IDataConfig;
    /**
     * Вид отображения записей истории (в виде списка | в виде плитки)
     */
    viewMode?: 'list' | 'tile';
    /**
     * Путь до шаблона элемента истории
     */
    itemTemplate?: string;
    /**
     * Флаг, настраиваюший возможность запинивания записей истории
     */
    allowPin?: boolean;
}

/**
 * Интерфейс конфигурации фильтра и поиска
 * @public
 */
export interface IFilterConfig {
    /**
     * Настройка для компонента фильтра
     */
    filterTemplateOptions?: {
        storeId?: string;
        [key: string]: unknown;
    };
    /**
     * Настройки для компонента поиска
     */
    searchTemplateOptions?: Record<string, unknown>;
}

/**
 * Интерфейс конфигурации загрузчиков
 * @public
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

export interface IAddButtonConfig {
    /**
     * Путь до функции, которая будет вызвана для получения опций для отображения меню. Функция должна вернуть объект с полями контрола {@link /docs/js/Controls/dropdown/Button/ Controls/dropdown:Button}.
     */
    menuConfigGetter: string;

    /**
     * Аргументы, которые будут переданы в menuConfigGetter.
     */
    menuConfigGetterArguments?: Record<string, unknown>;
    /**
     *  Путь до функции, которая будет вызвана при нажатии на элемент меню
     */
    activateHandler: string;
}

/**
 * Интерфейс конфигурации вкладки на окне выбора
 * @public
 */
export interface ISelectorTabConfig {
    /**
     * Путь до модуля, экспортирующего фабрики данных
     */
    prefetchConfig: IPrefetchConfig;
    /**
     * Идентификатор списочного слайса в контексте
     */
    storeId: string;
    /**
     * Текст корешка закладки
     */
    tabCaption?: string;
    /**
     * Текст заголовка
     */
    caption?: string;
    /**
     * Конфигурация фильтра и поиска
     */
    filterConfig?: IFilterConfig;
    /**
     * Конфигурация кнопки "+"
     */
    addButtonConfig?: IAddButtonConfig;
    /**
     * Конфигурация рабочей области
     */
    contentConfig: IContentAreaConfig;
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
    /**
     * Задаёт порядок вкладок на окне выбора
     */
    order?: number;
    /**
     * Тип выбираемых записей
     */
    selectionType?: ['leaf' | 'node' | 'hiddenNode'];
    /**
     * Функция обратного вызова, с помощью которой происходит фильтрация выбранных записей для вкладки
     */
    selectionFilter?: (item: Model, index: number) => boolean;
}

/**
 * Тип конфигурации справочников на окне выбора
 * @public
 */
export type TSelectorTabsConfigs = Record<string, ISelectorTabConfig>;

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
     * Единичный/множественный выбор
     */
    multiSelect?: boolean;
    /**
     * Конфигурация справочников на окне выбора
     * Если справочников несколько, то на окне выбора будут построены вкладки
     */
    configs: TSelectorTabsConfigs;
}
