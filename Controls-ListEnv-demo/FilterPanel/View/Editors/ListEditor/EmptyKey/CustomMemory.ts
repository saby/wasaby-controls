import { Memory, Query, IMemoryOptions } from 'Types/source';
import { DataSet } from 'Types/source';

interface ICustomMemoryOptions extends IMemoryOptions {
    metaDataResults?: object;
}

export default class CustomMemory extends Memory {
    protected _metaDataResults: object;

    constructor(options?: ICustomMemoryOptions) {
        super(options);
        this._metaDataResults = options.metaDataResults;
    }

    query(query?: Query): Promise<DataSet> {
        let items = this._applyFrom(query ? query.getFrom() : undefined);
        const adapter = this.getAdapter();
        let total;

        if (query) {
            items = this._applyJoin(items, query.getJoin());
            items = this._applyWhere(items, query.getWhere(), query.getMeta());
            items = this._applyOrderBy(items, query.getOrderBy());
            items = this._applySelect(items, query.getSelect());
            total = adapter.forTable(items).getCount();
            items = this._applyPaging(
                items,
                query.getOffset(),
                query.getLimit()
            );
        } else if (this._$filter) {
            items = this._applyWhere(items);
        } else {
            total = adapter.forTable(items).getCount();
        }

        return this._loadAdditionalDependencies().addCallback(() => {
            return this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total,
                        results: this._metaDataResults,
                    },
                },
                query
            );
        }) as Promise<DataSet>;
    }
}
