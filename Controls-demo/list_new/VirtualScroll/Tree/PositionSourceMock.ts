import { DataSet, Memory, Query, QueryWhereExpression } from 'Types/source';

interface IItem {
    key: number;
    title: string;
    node: boolean;
    parent: number;
}

const COUNTNUMBER = 20;

export default class PositionSourceMock extends Memory {
    protected _moduleName: string = 'Controls-demo/list_new/VirtualScroll/Tree/PositionSourceMock';
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter: QueryWhereExpression<unknown> = query.getWhere();
        const limit: number = query.getLimit();

        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        const items: IItem[] = [];
        let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;
        const originPosition = position;
        // eslint-disable-next-line
        position += (filter.parent || 0) + 1;

        if (isPrepend) {
            position -= limit;
        }

        for (let i = 0; i < limit; i++, position++) {
            items.push({
                key: position,
                title: `Запись #${position}`,
                parent: position > COUNTNUMBER ? COUNTNUMBER : null,
                node: position === COUNTNUMBER ? true : null,
            });
        }

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition
                            ? { before: true, after: true }
                            : originPosition <= COUNTNUMBER,
                    },
                },
                null
            )
        );
    }
}
