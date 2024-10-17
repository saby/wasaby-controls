import { DataSet, IMemoryOptions, Memory, Query } from 'Types/source';
import { Model } from 'Types/entity';

class BrowserMemory extends Memory {
    constructor(options: IMemoryOptions) {
        super(options);
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
