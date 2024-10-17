/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
export interface IPrefetchParams {
    PrefetchMethod: string;
    PrefetchPages?: number;
    PrefetchIdColumn?: string;
    PrefetchHierarchyColumn?: string;
    PrefetchSessionLiveTime?: Date;
}

export interface IPrefetchOptions {
    prefetchParams?: IPrefetchParams;
    prefetchSessionId?: string;
}

export interface IPrefetchHistoryParams {
    PrefetchSessionId: string;
    PrefetchDataValidUntil: Date;
}

/**
 * Интерфейс для контролов, поддерживающих кэширование данных.
 * @public
 */

export default interface IPrefetch {
    readonly '[Controls/_filter/IPrefetch]': boolean;
}
/**
 * @typedef {Object} Controls/filter:IPrefetch/PrefetchParams
 * @description Допустимые значения для опции {@link Controls/filter:IPrefetch#prefetchParams}.
 * @property {String} PrefetchMethod Метод, который необходимо вызвать для получения данных.
 * @property {Number} [PrefetchLevels=2] Количество кэшируемых уровней иерархии.
 * @property {String} [PrefetchHierarchyColumn="Раздел"] Имя поля иерархии (для иерархических данных).
 * @property {String} PrefetchIdColumn  Имя поля, идентифицирующего запись (для иерархических запросов). Если не передано, то берется первое поле из результата.
 * @property {Types/entity:TimeInterval} [PrefetchSessionLiveTime=1] Время жизни сессии.
 */

/**
 * @name Controls/filter:IPrefetch#prefetchSessionId
 * @cfg {String} Идентификатор сессии кэша.
 * @remark
 * Подробнее о механизме кэширования отчетов вы можете прочитать в разделе
 * <a href='/doc/platform/application-optimization/reports-caching/'>Платформенный механизм кэширования</a>.
 */

/**
 * @name Controls/filter:IPrefetch#prefetchParams
 * @cfg {Controls/filter:IPrefetch/PrefetchParams.typedef} Устанавливает конфигурацию для кэширования данных.
 * @remark
 * Подробнее о механизме кэширования отчетов вы можете прочитать в разделе
 * <a href='/doc/platform/application-optimization/reports-caching/'>Платформенный механизм кэширования</a>.
 */
