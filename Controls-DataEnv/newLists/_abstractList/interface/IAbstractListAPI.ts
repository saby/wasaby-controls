import type { CrudEntityKey } from 'Types/source';
import type {
    TSelectionOptions,
    TSelectionRecordContent,
    TViewCommand,
} from 'Controls-DataEnv/listTypes';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';

/**
 * API абстрактного интерактора любого списка.
 *
 * Включает в себя непосредственно API ViewModel'и списка и API списочной раскладки ({@link Controls-ListEnv/operationsPanelConnected:View ПМО}, {@link Controls-ListEnv/filterPanelConnected:View панель фильтров} и т.д.).
 */
export interface IAbstractListAPI extends IListOwnAPI, IListEnvAPI, IListTestsApi {}

/**
 * API списочной раскладки
 */
export interface IListEnvAPI {
    /**
     * Открыть {@link Controls-ListEnv/operationsPanelConnected:View панель массовых операций}
     */
    openOperationsPanel(): void;

    /**
     * Закрыть {@link Controls-ListEnv/operationsPanelConnected:View панель массовых операций}
     */
    closeOperationsPanel(): void;

    /**
     * Открыть {@link Controls-ListEnv/filterPanelConnected:View панель фильтров}
     */
    openFilterDetailPanel(): void;

    /**
     * Закрыть {@link Controls-ListEnv/filterPanelConnected:View панель фильтров}
     */
    closeFilterDetailPanel(): void;
}

/**
 * API ViewModel'и списка
 */
export interface IListOwnAPI {
    /**
     * Установить подключение слоя представления к интерактору
     */
    connect(): void;

    /**
     * Отключает слой представления от интерактора
     */
    disconnect(): void;

    /**
     * Выделить элемент
     */
    select(key: CrudEntityKey, options?: TSelectionOptions): void;

    /**
     * Выделить все элементы
     */
    selectAll(): void;

    /**
     * Сбросить выделение
     */
    resetSelection(): void;

    /**
     * Инвертировать выделение
     */
    invertSelection(): void;

    /**
     * Отметить элемент
     */
    mark(key: TKey | undefined): void;

    /**
     * Сменить текущий корень списка
     */
    changeRoot(key: TKey): void;

    /**
     * Раскрыть узел
     * @param key Ключ узла
     * @param params Дополнительные параметры
     */
    expand(key: CrudEntityKey, params?: TExpandCollapseParams): void;

    /**
     * Свернуть узел
     * @param key Ключ узла
     * @param params Дополнительные параметры
     */
    collapse(key: CrudEntityKey, params?: TExpandCollapseParams): void;

    /**
     * Загрузить предыдущую "пачку" данных.
     * Опционально принимает ключ записи для которой следует грузить данные.
     * По умолчанию грузит данные в корень.
     */
    prev(key?: TKey): void;

    /**
     * Загрузить следующую "пачку" данных.
     * Опционально принимает ключ записи для которой следует грузить данные.
     * По умолчанию грузит данные в корень.
     */
    next(key?: TKey): void;

    /**
     * Получить текущее состояние множественного выделения в списке
     */
    getSelection(): Promise<TSelectionRecordContent>;

    /**
     * Запустить поиск
     */
    search(searchValue: string): void;

    /**
     * Сбросить поиск с очисткой строки поиска
     */
    resetSearch(): void;

    /**
     * Установить фильтр
     */
    setFilter(filter: TFilter): void;

    onExecutedViewCommand(command: TViewCommand): void;
}

/**
 * API утилит для автотестов
 */
export interface IListTestsApi {
    isIdle(): boolean;
}

/**
 * Тип дополнительных параметров, передаваемых в методы для разворота и сворачивания узлов
 */
export type TExpandCollapseParams = {
    /**
     * Флаг, определяющий, следует ли отмечать узел
     */
    markItem?: boolean;
};
