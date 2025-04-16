import { DataSet, Memory, Query } from 'Types/source';

export default class PseudoParentSourceMock extends Memory {
    protected _moduleName: string = 'Controls-demo/list_new/DemoHelpers/PositionSourceMock';
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit();
        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        let items = [];
        let position = filter['key<='] || filter['key>='] || filter['key~'] || '100';

        const currentElKey = this._$data.findIndex((el) => {
            return el.key === position;
        });

        let hasMore = true;

        if (currentElKey === -1) {
            hasMore = false;
        }

        if (isPrepend) {
            if (currentElKey - limit > 0) {
                items = this._$data.slice(currentElKey - limit, currentElKey);
            } else {
                items = this._$data.slice(0, currentElKey);
                hasMore = false;
            }
        } else if (isAppend) {
            if (currentElKey + limit < this._$data.length - 1) {
                items = this._$data.slice(currentElKey, currentElKey + limit);
            } else {
                items = this._$data.slice(currentElKey, this._$data.length - 1);
                hasMore = false;
            }
        }

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: hasMore,
                    },
                },
                null
            )
        );
    }
}
