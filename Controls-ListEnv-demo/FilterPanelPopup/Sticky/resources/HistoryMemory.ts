import { Memory, IMemoryOptions, DataSet, Query } from 'Types/source';

interface IHistoryOptions extends IMemoryOptions {
    _historyIds?: string[];
}

export default class HistoryMemory extends Memory {
    constructor(options: IHistoryOptions) {
        super(options);
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
