import { Memory, IMemoryOptions, Query } from 'Types/source';
import { factory as CollectionFactory, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';

const DELAY = 5000;
const _results: { [key: string]: { [key: string]: RecordSet } } = {};

export default class PrefetchSource extends Memory {
    private _id: string;

    constructor(
        options: IMemoryOptions & {
            id: string;
        }
    ) {
        super(options);
        this._id = options.id;
    }

    query(query: Query): Promise<RecordSet> {
        const filter = query.getWhere();
        const sessionId = filter.PrefetchSessionId;
        const prefetchResult = _results[sessionId];
        if (prefetchResult && prefetchResult[this._id]) {
            const result = factory(prefetchResult[this._id])
                .filter((item) => {
                    return this._$filter(item, filter);
                })
                .value(CollectionFactory.recordSet, {
                    metaData: prefetchResult[this._id].getMetaData(),
                }) as RecordSet;
            return Promise.resolve(result);
        } else {
            return this._timeout().then(() => {
                return super.query(query).then((result) => {
                    const items = result.getAll();
                    if (sessionId) {
                        const meta = items.getMetaData();
                        items.setMetaData({
                            ...meta,
                            results: new Model({
                                rawData: { PrefetchSessionId: sessionId },
                            }),
                        });
                        if (!_results[sessionId]) {
                            _results[sessionId] = {};
                        }
                        _results[sessionId][this._id] = items.clone();
                    }
                    return items;
                });
            });
        }
    }

    private _timeout(delay: number = DELAY): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }
}
