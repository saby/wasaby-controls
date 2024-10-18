import { Memory, IMemoryOptions, DataSet, Query } from 'Types/source';
import { Source, Service } from 'Controls/history';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';

interface IHistoryOptions extends IMemoryOptions {
    _historyIds?: string[];
}

export default class HistoryMemory extends Source {
    constructor(options: IHistoryOptions) {
        super(options);
        this._$originSource = new Memory({
            keyProperty: 'department',
            data: departments,
        });

        this._$historySource = new Service({
            historyId: 'myHistoryId',
            pinned: true,
        });
        this.counter = 0;
        Service.prototype.update = (initItem, meta) => {
            initItem.set('pinned', meta.$_pinned);
            this.counter = meta.$_pinned ? this.counter + 1 : this.counter - 1;
            const data = this._$originSource.data;
            let itemIndex;
            data.forEach((item, index) => {
                if (item.department === initItem.getKey()) {
                    item.pinned = meta.$_pinned;
                    itemIndex = index;
                }
            });
            const dataItem = data.splice(itemIndex, 1)[0];
            const insertIndex = meta.$_pinned ? this.counter - 1 : this.counter;
            data.splice(insertIndex, 0 , dataItem);
            this._$originSource = new Memory({
                keyProperty: 'department',
                data,
            });
            const query = new Query().where({
                $_history: true,
                _historyIds: []
            });
            return this.query(query);
        };
    }

    query(queryInst: Query): Promise<DataSet> {
        return super.query.apply(this, arguments).then((dataSet) => {
            const historyFilter = queryInst.getWhere()._historyIds;
            if (historyFilter) {
                queryInst.getWhere()._historyIds = undefined;
                return super.query.call(this, queryInst).addCallback((historyDataSet) => {
                    const historyRecordSet = historyDataSet.getAll();
                    const originRecordSet = dataSet.getAll();

                    originRecordSet.append(historyRecordSet);
                    return originRecordSet;
                });
            }
            return dataSet;
        });
    }
}
