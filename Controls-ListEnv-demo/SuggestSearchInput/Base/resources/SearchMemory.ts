import { DataSet, IMemoryOptions, Memory, Query } from 'Types/source';
import { Model } from 'Types/entity';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import { IQueryMeta, QueryWhereExpression } from 'Types/source';

class BrowserMemory extends Memory {
    constructor(options: IMemoryOptions) {
        super(options);
    }

    protected _applyWhere(
        data: unknown,
        where?: QueryWhereExpression<unknown>,
        meta?: IQueryMeta
    ): unknown {
        if (
            !this._$filter &&
            typeof where === 'object' &&
            !Object.keys(where).length
        ) {
            return data;
        }

        const adapter = this.getAdapter();
        const tableAdapter = adapter.forTable();

        this._each(data, (item, index) => {
            const localItem = adapter.forRecord(item);

            const isMatch = MemorySourceFilter();

            if (isMatch(localItem, where)) {
                tableAdapter.add(localItem.getData());
            }
        });

        return tableAdapter.getData();
    }

    query(queryInst: Query): Promise<DataSet> {
        return new Promise((resolve) => {
            const superQuery = super.query(queryInst);

            superQuery.then((dataSet) => {
                const getAll = dataSet.getAll.bind(dataSet);
                const originAll = getAll();
                const originAllMeta = originAll.getMetaData();
                originAllMeta.results = new Model({
                    rawData: {
                        tabs: [
                            { id: 'name', title: 'Вкладка' },
                            { id: 'city', title: 'Вкладка2' },
                        ],
                    },
                });
                originAllMeta.more = originAll.getMetaData().more;
                dataSet.getAll = () => {
                    const resultAll = getAll();
                    resultAll.setMetaData(originAllMeta);
                    return resultAll;
                };
                resolve(dataSet);
                return dataSet;
            });
        });
    }
}

export default BrowserMemory;
