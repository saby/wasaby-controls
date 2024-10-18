import { Memory, IMemoryOptions, DataSet, Query } from 'Types/source';
import { Model } from 'Types/entity';
import KeyboardLayoutRevert from 'Controls/Utils/keyboardLayoutRevert';
interface ISearchMemoryOptions extends IMemoryOptions {
    searchParam?: string;
}

export default class SearchMemory extends Memory {
    private _searchParam: string;

    constructor(options: ISearchMemoryOptions) {
        super(options);
        this._searchParam = options.searchParam;
    }

    query(queryInst: Query): Promise<DataSet> {
        return super.query.apply(this, arguments).then((dataSet) => {
            const searchFilter = queryInst.getWhere()[this._searchParam];
            if (searchFilter) {
                const switchedStr = KeyboardLayoutRevert.process(searchFilter);
                queryInst.getWhere()[this._searchParam] = switchedStr;

                return super.query.call(this, queryInst).addCallback((revertedDataSet) => {
                    const revertedRecordSet = revertedDataSet.getAll();
                    const originRecordSet = dataSet.getAll();

                    originRecordSet.append(revertedRecordSet);
                    originRecordSet.setMetaData({
                        returnSwitched: true,
                        results: new Model({
                            rawData: {
                                switchedStr: revertedRecordSet.getCount() ? switchedStr : '',
                            },
                        }),
                    });

                    return originRecordSet;
                });
            }
            return dataSet;
        });
    }
}
