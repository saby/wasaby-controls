import { DataSet, IMemoryOptions, Memory, Query } from 'Types/source';

interface IItem {
    key: number;
    country: string;
    capital: string;
}

export interface IOptions extends IMemoryOptions {
    // Отложенный ответ (разрешение промиса управляется вручную). Используется только в режиме поиска
    deferResponse?: boolean;
}

// Если отложенный ответ придёт на SSR, то страница тупо зависнет.
function isClientRendering(): boolean {
    return typeof window !== 'undefined';
}

// Обычная задержка ответа источника (не имеет значения, когда включен отложенный ответ)
const SEARCH_DELAY = 500;

export default class PositionSourceMemory extends Memory {
    private readonly _deferResponse: boolean;
    protected _moduleName: string =
        'Controls-ListEnv-demo/Search/Grid/LoadingIndicatorDown/PortionedSearchMemory';

    private _deferredResponse: Function;

    constructor(options: IOptions) {
        super(options);
        this._deferResponse = options.deferResponse;
    }

    callDeferredResponse(): void {
        if (this._deferredResponse) {
            this._deferredResponse();
            this._deferredResponse = null;
        }
    }

    query(query?: Query<unknown>): Promise<DataSet> {
        const where = query.getWhere();
        const limit = query.getLimit();

        const isSearch = where.title !== undefined;
        const isPrepend = typeof where['key<='] !== 'undefined';
        const isAppend = typeof where['key>='] !== 'undefined';
        const isPosition = typeof where['key~'] !== 'undefined';
        let position = where['key<='] || where['key>='] || where['key~'] || 0;

        if (isPrepend) {
            position -= limit;
        }
        if (isAppend) {
            position += 1;
        }

        if (isSearch) {
            return this._getSearchItems(position).then((items) => {
                return this._prepareQueryResult(
                    {
                        items,
                        meta: {
                            total: isPosition
                                ? {
                                      before: false,
                                      after: true,
                                  }
                                : position < 100,
                            more: isPosition
                                ? {
                                      before: false,
                                      after: true,
                                  }
                                : position < 100,
                            iterative: position < 100, // находим всего 100 записей
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
                            ? {
                                  before: false,
                                  after: true,
                              }
                            : true,
                    },
                },
                null
            );
            return new Promise((resolve) => {
                const resolver = () => {
                    resolve(result);
                };
                if (this._deferResponse && isClientRendering()) {
                    this._deferredResponse = resolver;
                } else {
                    resolver();
                }
            });
        }
    }

    private _getItems(position: number, limit: number): IItem[] {
        const items: IItem[] = [];

        for (let i = 0; i < limit; i++, position++) {
            items.push({
                key: position,
                country: `Страна #${position}`,
                capital: `Столица #${position}`,
            });
        }

        return items;
    }

    private _getSearchItems(position: number): Promise<IItem[]> {
        const delay = SEARCH_DELAY;
        return new Promise((resolve) => {
            const resolver = () => {
                const items = this._getItems(position, 3);
                resolve(items);
            };
            if (this._deferResponse) {
                this._deferredResponse = resolver;
            } else {
                setTimeout(resolver, delay);
            }
        });
    }
}
