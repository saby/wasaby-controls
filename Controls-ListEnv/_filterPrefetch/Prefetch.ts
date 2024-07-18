/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Модуль, который экспортирует набор функций-хэлперов для работы с кэшированием данных на {@link /doc/platform/application-optimization/reports-caching/ сервисе кэширования}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filter.less переменные тем оформления}
 *
 * @class Controls-ListEnv/_filterPrefetch/Prefetch
 * @private
 *
 */

/**
 * Возвращает дату создания кэша из метаданных переданного рекордсета
 * @function Controls-ListEnv/_filterPrefetch/Prefetch#getPrefetchDataCreatedFromItems
 * @param {Types/collection:RecordSet} items
 * @returns {Date|null}
 * @example
 * <pre>
 *     import {Prefetch} from 'Controls-ListEnv/filterPrefetch'
 *     const createDate = Prefetch.getPrefetchDataCreatedFromItems(loadedItems);
 * </pre>
 */

import { RecordSet } from 'Types/Collection';
import { Record } from 'Types/entity';
import { IPrefetchHistoryParams } from 'Controls/filter';
import { TFilter } from 'Controls/interface';

const PREFETCH_SESSION_ERROR = '00000000-0000-0000-0000-000000000000';
const PREFETCH_SESSION_FIELD = 'PrefetchSessionId';
const PREFETCH_DATA_VALID_FIELD = 'PrefetchDataValidUntil';
const PREFETCH_DATA_CREATED = 'PrefetchDataCreated';

function isPrefetchParamsValid(items: RecordSet): boolean {
    let sessionId;

    if (getPrefetchMeta(items)) {
        sessionId = getSessionId(items);
    }

    return sessionId && sessionId !== PREFETCH_SESSION_ERROR;
}

function getPrefetchMeta(items: RecordSet): Record {
    return items.getMetaData().results;
}

function getSessionId(items: RecordSet): string {
    return getPrefetchMeta(items).get(PREFETCH_SESSION_FIELD);
}

function getDataValid(items: RecordSet): Date {
    return getPrefetchMeta(items).get(PREFETCH_DATA_VALID_FIELD);
}

function getPrefetchFromHistory({ prefetchParams }): IPrefetchHistoryParams | undefined {
    return prefetchParams;
}

function addPrefetchToHistory<T>(
    history: T,
    prefetchParams: IPrefetchHistoryParams | undefined
): T {
    if (history && prefetchParams) {
        history.prefetchParams = prefetchParams;
    }
    return history;
}

function getPrefetchParamsForSave(items: RecordSet): IPrefetchHistoryParams | undefined {
    if (isPrefetchParamsValid(items)) {
        return {
            PrefetchSessionId: getSessionId(items),
            PrefetchDataValidUntil: getDataValid(items),
        };
    }
}

function applyPrefetchFromHistory(filter: TFilter, history: THistoryData): TFilter {
    const prefetchParams = getPrefetchFromHistory(history);
    let resultFilter;

    if (prefetchParams) {
        resultFilter = { ...filter };
        resultFilter[PREFETCH_SESSION_FIELD] = prefetchParams[PREFETCH_SESSION_FIELD];
    } else {
        resultFilter = filter;
    }

    return resultFilter;
}

function applyPrefetchFromItems(filter: TFilter, items: RecordSet): TFilter {
    if (isPrefetchParamsValid(items)) {
        const sessionId = getSessionId(items);

        if (sessionId) {
            filter[PREFETCH_SESSION_FIELD] = sessionId;
        }
    }

    return filter;
}

function prepareFilter(
    filter: TFilter,
    prefetchParams: IPrefetchHistoryParams,
    prefetchSessionId?: string
): TFilter {
    const resultFilter = { ...filter, ...(prefetchParams || {}) };
    const prefetchSession = prefetchSessionId || filter[PREFETCH_SESSION_FIELD];

    if (prefetchSessionId) {
        resultFilter[PREFETCH_SESSION_FIELD] = prefetchSession;
    }

    return resultFilter;
}

function needInvalidatePrefetch(history: object): boolean {
    const prefetchParams = getPrefetchFromHistory(history);
    let result = false;
    if (prefetchParams) {
        result = prefetchParams[PREFETCH_DATA_VALID_FIELD] < new Date();
    }
    return result;
}

function clearPrefetchSession(filter: TFilter): TFilter {
    const resultFilter = filter;
    delete filter[PREFETCH_SESSION_FIELD];
    return resultFilter;
}

function getPrefetchDataCreatedFromItems(items: RecordSet): Date | null {
    const prefetchMeta = getPrefetchMeta(items);
    let result = null;

    if (prefetchMeta) {
        result = prefetchMeta.get(PREFETCH_DATA_CREATED);
    }

    return result;
}

export default {
    applyPrefetchFromItems,
    applyPrefetchFromHistory,
    getPrefetchParamsForSave,
    addPrefetchToHistory,
    needInvalidatePrefetch,
    prepareFilter,
    clearPrefetchSession,
    getPrefetchFromHistory,
    getPrefetchDataCreatedFromItems,
    PREFETCH_SESSION_FIELD,
};
