import { Memory, IMemoryOptions, DataSet, Query } from 'Types/source';
import * as searchRevert from 'Controls-ListEnv-demo/Search/Misspell/kbLayoutRevert';

interface ISearchMemoryOptions extends IMemoryOptions {
    searchParam?: string;
}

export default class SearchMemory extends Memory {
    private _searchParam: string = 'title';

    constructor(options: ISearchMemoryOptions) {
        super(options);
    }

    query(queryInst: Query): Promise<DataSet> {
        return super.query.apply(this, arguments).then((dataSet) => {
            const searchFilter = queryInst.getWhere()[this._searchParam];
            if (searchFilter) {
                const switchedStr = searchRevert.process(searchFilter);
                queryInst.getWhere()[this._searchParam] = switchedStr;

                return super.query.call(this, queryInst).addCallback((revertedDataSet) => {
                    const revertedRecordSet = revertedDataSet.getAll();
                    const originRecordSet = dataSet.getAll();

                    originRecordSet.append(revertedRecordSet);
                    originRecordSet.setMetaData({
                        returnSwitched: true,
                        switchedStr: revertedRecordSet.getCount() ? switchedStr : '',
                    });

                    return originRecordSet;
                });
            }
            return dataSet;
        });
    }
}
