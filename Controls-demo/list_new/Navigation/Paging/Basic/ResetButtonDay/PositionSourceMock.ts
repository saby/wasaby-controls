import { DataSet, Memory, Query } from 'Types/source';

interface IItem {
    key: string;
    title: string;
}

const MIN = 0;
const MAX = 200;

export default class PositionSourceMock extends Memory {
    protected _moduleName: string =
        'Controls-demo/list_new/Navigation/Paging/Basic/ResetButtonDay/PositionSourceMock';
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit();

        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        const items: IItem[] = [];
        let position = filter['key<='] || filter['key>='] || filter['key~'] || '100';

        const hasMoreFull = { before: true, after: true };
        let hasMore = true;

        if (isPrepend) {
            if (position === -1) {
                position = MAX - limit;
                hasMoreFull.after = false;
            } else {
                position -= limit;
            }
        }
        if (isAppend) {
            if (position === -2) {
                position = MIN;
                hasMoreFull.before = false;
            } else {
                position++;
            }
        }

        for (let i = 0; i < limit; i++, position++) {
            if (position >= MAX) {
                hasMore = false;
                break;
            }
            if (position <= MIN) {
                hasMore = false;
            }
            items.push({
                key: '' + position,
                title: `Запись #${position}`,
            });
        }

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition ? hasMoreFull : hasMore,
                    },
                },
                null
            )
        );
    }
}
