/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Модуль для работы с кэшированием данных на {@link /doc/platform/application-optimization/reports-caching/ сервисе кэширования}.
 * @library
 * @includes Prefetch Controls/filter:Prefetch
 * @includes IPrefetch Controls/filter:IPrefetch
 * @public
 */

export { default as Prefetch } from 'Controls-ListEnv/_filterPrefetch/Prefetch';
export {
    default as IPrefetch,
    IPrefetchParams,
    IPrefetchOptions,
    IPrefetchHistoryParams,
} from 'Controls-ListEnv/_filterPrefetch/IPrefetch';