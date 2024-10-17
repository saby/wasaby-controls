import { DataSet, Memory, Query } from 'Types/source';
import { Record as EntityRecord } from 'Types/entity';
import { IHashMap } from 'Types/declarations';

interface IFilter extends IHashMap<unknown> {
    selection: EntityRecord;
    entries: number[];
}

export default class TreeMemory extends Memory {
    query(query: Query): Promise<DataSet> {
        const filter = query.getWhere() as IFilter;
        const selection = filter.selection || filter.entries;
        if (selection) {
            const markedKeys = selection.get('marked');
            const resultArray = filter.SelectionWithPath ? [] : this.data;
            if (filter.SelectionWithPath) {
                this.data.forEach((item) => {
                    const itemKey = item[this.getKeyProperty()].toString();
                    if (markedKeys.includes(itemKey) && itemKey !== null) {
                        resultArray.push({ ...item });
                    }
                });
            }
            return Promise.resolve(this._createDataSet(resultArray));
        } else {
            return super.query(query.where(filter));
        }
    }

    private _createDataSet(items: object[]): DataSet {
        return new DataSet({
            rawData: { items },
            itemsProperty: 'items',
            keyProperty: 'id',
        });
    }
}
