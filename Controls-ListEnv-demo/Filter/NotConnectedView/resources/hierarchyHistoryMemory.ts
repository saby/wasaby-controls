import { Source } from 'Controls/historyOld';
import { DataSet } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { adapter } from 'Types/entity';
import { Deferred } from 'Types/deferred';

const recentData = {
    _type: 'recordset',
    d: [],
    s: [
        { n: 'ObjectId', t: 'Строка' },
        { n: 'HistoryId', t: 'Строка' },
    ],
};

const pinnedData = {
    _type: 'recordset',
    d: [],
    s: [
        { n: 'ObjectId', t: 'Строка' },
        { n: 'HistoryId', t: 'Строка' },
    ],
};

function createRecordSet(data?) {
    return new RecordSet({
        rawData: data,
        idProperty: 'ObjectId',
        adapter: new adapter.Sbis(),
    });
}

function getSrcData() {
    return new DataSet({
        rawData: {
            frequent: createRecordSet(),
            pinned: createRecordSet(pinnedData),
            recent: createRecordSet(recentData),
        },
        itemsProperty: '',
        idProperty: 'ObjectId',
    });
}

class FilterViewMemory extends Source {
    constructor(options) {
        options.historySource.query = function () {
            const def = new Deferred();

            def.addCallback((set) => {
                return set;
            });
            def.callback(getSrcData());

            return def;
        };
        options.historySource.update = function () {
            //
        };

        super(options);
    }

    query() {
        const resultDeferred = new Deferred();
        const superQuery = super.query.apply(this, arguments);

        superQuery.addCallback((dataSet) => {
            const getAll = dataSet.getAll.bind(dataSet);
            const originAll = getAll();

            // не удалял, потому что могут быть побочные эффекты
            originAll.getMetaData();

            const moreResult = new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 'Приход',
                        nav_result: true,
                    },
                    {
                        id: 'Расход',
                        nav_result: false,
                    },
                ],
            });

            dataSet.getAll = function () {
                const resultAll = getAll();

                resultAll.setMetaData({ more: moreResult });

                return resultAll;
            };
            resultDeferred.callback(dataSet);

            return dataSet;
        });

        return resultDeferred;
    }

    getModel() {
        return this.originSource.getModel();
    }

    destroyHistory() {
        Object.defineProperty(recentData, 'd', {
            value: [],
            configurable: true,
            writable: true,
            enumerable: true,
        });
        Object.defineProperty(pinnedData, 'd', {
            value: [],
            configurable: true,
            writable: true,
            enumerable: true,
        });
    }
}

export default FilterViewMemory;
