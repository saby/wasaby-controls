import { DataSet, Memory, Query, IMemoryOptions } from 'Types/source';

interface IItem {
    key: number;
    title: string;
}

export interface IOptions extends IMemoryOptions {
    direction: string;
    loadTimeout?: number;
    longLoadTimeout?: number;
    fastLoadTimeout?: number;
    // Число записей, которые будет возвращать источник.
    // Используется в любом режиме, кроме "меньше данных" и "больше данных".
    responseItemsCount?: number;
    // Возвращает результат сразу. Не используется в режиме поиска.
    immediateResult?: boolean;
    // Отложенный ответ (разрешение промиса управляется вручную). Используется только в режиме поиска
    deferSearchResponse?: boolean;
}

// Всего записей, которые вернёт источник
const ITEMS_TOTAL = 100;
// Записей в одной порции
const ITEMS_COUNT_DEFAULT = 3;
// Записей в одной порции, когда включен режим "Больше записей"
const ITEMS_COUNT_MORE = 30;
// Если требуется вернуть очень мало данных
const ITEMS_COUNT_LESS = 3;
// Малая задержка ответа источника (не имеет значения, когда включен отложенный ответ)
const FAST_SEARCH_DELAY = 800;
// Обычная задержка ответа источника (не имеет значения, когда включен отложенный ответ)
const SEARCH_DELAY = 2500;
// Большая задержка ответа источника (не имеет значения, когда включен отложенный ответ)
const LONG_SEARCH_DELAY = 10000;

export default class PortionedSearchMemory extends Memory {
    private _longLoad: boolean = false;
    private _fastLoad: boolean = false;
    private _immediateResult: boolean = false;
    private _moreDataOnLoad: boolean;
    private _filterMoreData: boolean;
    private _iterativeValue: boolean = true;
    private _returnAlreadyExistedRecord: boolean = false;

    private readonly _loadTimeout: number;
    private readonly _longLoadTimeout: number;
    private readonly _fastLoadTimeout: number;
    private readonly _direction: string;
    private readonly _deferSearchResponse: boolean;

    private _deferredResponse: Function;
    private _responseItemsCount: number;

    constructor(options: IOptions) {
        super(options);
        this._loadTimeout = options.loadTimeout || SEARCH_DELAY;
        this._longLoadTimeout = options.longLoadTimeout || LONG_SEARCH_DELAY;
        this._fastLoadTimeout = options.fastLoadTimeout || FAST_SEARCH_DELAY;
        this._direction = options.direction;
        this._deferSearchResponse = options.deferSearchResponse;
        this._responseItemsCount =
            options.responseItemsCount || ITEMS_COUNT_DEFAULT;
        this._immediateResult = options.immediateResult;
    }

    setLongLoad(longLoad: boolean): void {
        this._longLoad = longLoad;
    }

    setFastLoad(fastLoad: boolean): void {
        this._fastLoad = fastLoad;
    }

    setMoreDataOnLoad(newValue: boolean): void {
        this._moreDataOnLoad = newValue;
    }

    callDeferredResponse(): void {
        if (this._deferredResponse) {
            this._deferredResponse();
            this._deferredResponse = null;
        }
    }

    setResponseItemsCount(count: number): void {
        this._responseItemsCount = count;
    }

    setIterativeValue(value: boolean): void {
        this._iterativeValue = value;
    }

    setResponseAlreadyExistedRecord(value: boolean): void {
        this._returnAlreadyExistedRecord = value;
    }

    query(query?: Query<unknown>): Promise<DataSet> {
        const where = query.getWhere();
        let limit = query.getLimit();

        const isSearch = where.title !== undefined;
        const filterFewItems = where.filter === 'few-items';

        let isPrepend = typeof where['key<='] !== 'undefined';
        const isAppend = typeof where['key>='] !== 'undefined';
        const isPosition = typeof where['key~'] !== 'undefined';
        let position = where['key<='] || where['key>='] || where['key~'] || 0;

        if (query.getWhere().filter === 'many-items') {
            this._moreDataOnLoad = this._filterMoreData = true;
        } else if (this._filterMoreData) {
            this._moreDataOnLoad = this._filterMoreData = false;
        }

        if (this._direction === 'up' && isSearch) {
            limit = this._responseItemsCount;
            isPrepend = true;
        }

        if (isAppend) {
            position++;
        }
        if (isPrepend) {
            position -= limit;
        }

        if (filterFewItems) {
            const items = this._getItems(position, ITEMS_COUNT_LESS);
            const result = this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: false,
                        more: false,
                    },
                },
                null
            );
            return Promise.resolve(result);
        } else if (isSearch) {
            return this._getSearchItems(position).then((items) => {
                const nextPosition =
                    (this._direction === 'up' ? -1 : 1) * items.length +
                    position;
                const hasMore =
                    this._direction === 'up'
                        ? nextPosition > -1 * ITEMS_TOTAL
                        : nextPosition < ITEMS_TOTAL;
                return this._prepareQueryResult(
                    {
                        items,
                        meta: {
                            total: isPosition
                                ? { before: true, after: true }
                                : hasMore,
                            more: hasMore,
                            iterative: this._iterativeValue && hasMore, // находим всего 100 записей
                        },
                    },
                    null
                );
            });
        } else {
            const items = this._getItems(position, limit);
            const result = this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition
                            ? { before: true, after: true }
                            : true,
                    },
                },
                null
            );
            return new Promise((resolve) => {
                if (this._immediateResult) {
                    resolve(result);
                } else {
                    setTimeout(() => {
                        resolve(result);
                    }, 2000);
                }
            });
        }
    }

    private _getItems(position: number, limit: number): IItem[] {
        const items: IItem[] = [];

        while (
            (this._direction === 'up' ? -1 : 1) * position + limit >
            ITEMS_TOTAL
        ) {
            limit--;
        }

        if (this._direction === 'up') {
            position -= limit;
        }

        for (let i = 0; i < limit; i++, ++position) {
            items.push({
                key: position,
                title: `Запись #${position}`,
            });
        }

        return items;
    }

    private _getSearchItems(position: number): Promise<IItem[]> {
        let delay = this._loadTimeout;
        if (this._fastLoad) {
            delay = this._fastLoadTimeout;
        } else if (this._longLoad) {
            delay = this._longLoadTimeout;
        }

        return new Promise((resolve) => {
            const resolver = () => {
                const itemsCount = this._moreDataOnLoad
                    ? ITEMS_COUNT_MORE
                    : this._responseItemsCount;
                const correctedPosition = this._returnAlreadyExistedRecord
                    ? Math.max(position - itemsCount, 0)
                    : position;
                const items = this._getItems(correctedPosition, itemsCount);
                resolve(items);
            };
            if (this._deferSearchResponse) {
                this._deferredResponse = resolver;
            } else {
                setTimeout(resolver, delay);
            }
        });
    }
}
