/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

/**
 * Параметры prefetch функции
 * */
export interface IPrefetchParams {
    PrefetchMethod: string;
    PrefetchPages?: number;
    PrefetchIdColumn?: string;
    PrefetchHierarchyColumn?: string;
    PrefetchSessionLiveTime?: Date;
}

/**
 * Часть конфигурации для контролов, поддерживающих кэширование данных
 * */
export interface IPrefetchOptions {
    prefetchParams?: IPrefetchParams;
    prefetchSessionId?: string;
}

/**
 * Параметры prefetch функции
 * */
export interface IPrefetchHistoryParams {
    PrefetchSessionId: string;
    PrefetchDataValidUntil: Date;
}

/**
 * Интерфейс для контролов, поддерживающих кэширование данных.
 * @public
 */
export default interface IPrefetch {
    readonly '[Controls-DataEnv/newLists/_listTypes/IPrefetch]': boolean;
}
/**
 * @typedef {Object} Controls-DataEnv/listTypes:IPrefetch/PrefetchParams
 * @description Допустимые значения для опции {@link Controls-DataEnv/listTypes:IPrefetch#prefetchParams}.
 * @property {String} PrefetchMethod Метод, который необходимо вызвать для получения данных.
 * @property {Number} [PrefetchLevels=2] Количество кэшируемых уровней иерархии.
 * @property {String} [PrefetchHierarchyColumn="Раздел"] Имя поля иерархии (для иерархических данных).
 * @property {String} PrefetchIdColumn  Имя поля, идентифицирующего запись (для иерархических запросов). Если не передано, то берется первое поле из результата.
 * @property {Types/entity:TimeInterval} [PrefetchSessionLiveTime=1] Время жизни сессии.
 */

/**
 * @name Controls-DataEnv/listTypes:IPrefetch#prefetchSessionId
 * @cfg {String} Идентификатор сессии кэша.
 * @remark
 * Подробнее о механизме кэширования отчетов вы можете прочитать в разделе
 * <a href='/doc/platform/application-optimization/reports-caching/'>Платформенный механизм кэширования</a>.
 */

/**
 * @name Controls-DataEnv/listTypes:IPrefetch#prefetchParams
 * @cfg {Controls-DataEnv/listTypes:IPrefetch/PrefetchParams.typedef} Устанавливает конфигурацию для кэширования данных.
 * @remark
 * Подробнее о механизме кэширования отчетов вы можете прочитать в разделе
 * <a href='/doc/platform/application-optimization/reports-caching/'>Платформенный механизм кэширования</a>.
 */
