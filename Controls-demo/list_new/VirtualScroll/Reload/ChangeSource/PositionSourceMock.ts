import { DataSet, Memory, Query, IMemoryOptions } from 'Types/source';

interface IItem {
    key: number;
    title: string;
}

interface IProps extends IMemoryOptions {
    hasMoreData: boolean;
}

export default class PositionSourceMock extends Memory {
    protected _moduleName: string =
        'Controls-demo/list_new/VirtualScroll/Reload/ChangeSource/PositionSourceMock';
    private _hasMoreData: boolean;

    constructor(options: IProps) {
        super(options);
        this._hasMoreData = options.hasMoreData;
    }

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
        } else if (isAppend) {
            position += 1;
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
                        total: isPosition
                            ? { before: this._hasMoreData, after: this._hasMoreData }
                            : this._hasMoreData,
                    },
                },
                null
            )
        );
    }
}
