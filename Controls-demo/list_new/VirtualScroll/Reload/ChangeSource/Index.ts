import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Reload/ChangeSource/Template';
import { DataSet, Memory, Query } from 'Types/source';

interface IItem {
    key: number;
    title: string;
}

let hasMoreData = true;

class PositionSourceMock extends Memory {
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit();

        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        const items: IItem[] = [];
        let position =
            filter['key<='] || filter['key>='] || filter['key~'] || 0;

        if (isPrepend) {
            position -= limit;
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
                            ? { before: hasMoreData, after: hasMoreData }
                            : hasMoreData,
                    },
                },
                null
            )
        );
    }
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: PositionSourceMock;
    protected _position: number = 0;

    protected _beforeMount(): void {
        this._source = new PositionSourceMock({ keyProperty: 'key' });
    }

    protected _changeSource(): void {
        hasMoreData = !hasMoreData;
        this._source = new PositionSourceMock({ keyProperty: 'key' });
    }
}
