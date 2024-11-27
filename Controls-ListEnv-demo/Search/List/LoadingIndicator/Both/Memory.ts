import { DataSet, Memory as DefaultMemory, Query } from 'Types/source';

interface IItem {
    key: number;
    title: string;
    group: string;
}

export default class Memory extends DefaultMemory {
    protected _moduleName: string = 'Controls-ListEnv-demo/Search/List/LoadingIndicator/Both/Memory';
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit() || 15;

        const filterFewItems = query.getWhere().filter === 'few-items';
        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

        if (isPrepend) {
            position -= limit;
        }
        if (isAppend) {
            position += 1;
        }

        if (filterFewItems) {
            const items = this._getItems(position, 3);
            const result = this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: { before: false, after: false },
                        more: { before: false, after: false },
                    },
                },
                null
            );
            return Promise.resolve(result);
        } else {
            const items = this._getItems(position, limit);
            const result = this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition ? { before: true, after: true } : true,
                    },
                },
                null
            );
            return Promise.resolve(result);
        }
    }

    private _getItems(position: number, limit: number): IItem[] {
        const items: IItem[] = [];

        for (let i = 0; i < limit; i++, position++) {
            items.push({
                key: position,
                title: `Запись #${position}`,
                group: 'CONTROLS_HIDDEN_GROUP',
            });
        }

        return items;
    }
}
