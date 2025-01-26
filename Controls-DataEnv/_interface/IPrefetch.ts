/**
 * Параметры конфигурации кэширования
 * */
export interface IPrefetchParams {
    PrefetchMethod: string;
    PrefetchPages?: number;
    PrefetchIdColumn?: string;
    PrefetchHierarchyColumn?: string;
    PrefetchSessionLiveTime?: Date;
}

/**
 * Параметры конфигурации для контролов, поддерживающих кэширование данных
 * */
export interface IPrefetchOptions {
    prefetchParams?: IPrefetchParams;
    prefetchSessionId?: string;
}
