import { DataSet, Memory, Query } from 'Types/source';
interface IItem {
    key: number;
    title: string;
}

export default class PositionSourceMock extends Memory {
    protected _moduleName: string =
        'Controls-demo/list_new/VirtualScroll/LoadToDirection/PositionSourceMock';
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit();

        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        const items: IItem[] = [];
        let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

        if (isPrepend) {
            position -= limit;
        }
        if (isAppend) {
            position++;
        }

        for (let i = 0; i < limit; i++, position++) {
            items.push({
                key: position,
                title: `Запись #${position}`,
            });
        }

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition ? { before: true, after: true } : true,
                    },
                },
                null
            )
        );
    }
}
