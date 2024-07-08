import { DataSet, Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Source, Service } from 'Controls/history';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';

function getHistoryData() {
    return {
        pinned: {
            _type: 'recordset',
            d: [],
            s: [
                { n: 'ObjectId', t: 'Строка' },
                { n: 'ObjectData', t: 'Строка' },
                { n: 'HistoryId', t: 'Строка' },
            ],
        },
        recent: {
            _type: 'recordset',
            d: [],
            s: [
                { n: 'ObjectId', t: 'Строка' },
                { n: 'ObjectData', t: 'Строка' },
                { n: 'HistoryId', t: 'Строка' },
            ],
        },
        frequent: {
            _type: 'recordset',
            d: [],
            s: [
                { n: 'ObjectId', t: 'Строка' },
                { n: 'ObjectData', t: 'Строка' },
                { n: 'HistoryId', t: 'Строка' },
            ],
        },
    };
}

class HistorySourceMenu extends Source {
    private _srcData: DataSet = null;
    constructor(config) {
        super(config);
        const data = getHistoryData();
        this._pinnedData = data.pinned;
        this._recentData = data.recent;
        this._frequentData = data.frequent;
        this._srcData = this._createDataSet(this._frequentData, this._pinnedData, this._recentData);
        this._$parentProperty = 'parent';
        this._$originSource = new Memory({
            data: hierarchyTasks.getRawData(),
            keyProperty: 'key',
        });
        this._$historySource = new Service({
            historyId: 'TEST_HISTORY_ID',
            pinned: true,
        });
        this._$historySource.query = this._serviceQuery.bind(this);
        this._$historySource.update = this._serviceUpdate.bind(this);
    }

    // Заглушка, чтобы демка не ломилась не сервис истории
    private _serviceUpdate(
        item: Model,
        meta: {
            $_pinned: boolean;
            $_history: boolean;
        }
    ) {
        const pinned = this._srcData.getRow().get('pinned');
        const recent = this._srcData.getRow().get('recent');
        let historyItem;
        if (meta.$_pinned) {
            historyItem = new Model({
                rawData: {
                    d: [String(item.getKey()), item.getKey()],
                    s: [
                        { n: 'ObjectId', t: 'Строка' },
                        { n: 'HistoryId', t: 'Строка' },
                    ],
                },
                adapter: pinned.getAdapter(),
            });
            pinned.append([historyItem]);
        } else if (meta.$_pinned === false) {
            pinned.remove(pinned.getRecordById(item.getKey()));
        } else if (meta.$_history && !recent.getRecordById(item.getKey())) {
            historyItem = new Model({
                rawData: {
                    d: [String(item.getKey()), item.getKey()],
                    s: [
                        { n: 'ObjectId', t: 'Строка' },
                        { n: 'HistoryId', t: 'Строка' },
                    ],
                },
                adapter: pinned.getAdapter(),
            });
            recent.prepend([historyItem]);
        }
        this._srcData = this._createDataSet(
            this._frequentData,
            pinned.getRawData(),
            this._recentData
        );
        return Promise.resolve();
    }

    private _serviceQuery(): Promise<DataSet> {
        return Promise.resolve(this._srcData);
    }

    private _createRecordSet(data: object[]): RecordSet {
        return new RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: 'adapter.sbis',
        });
    }

    private _createDataSet(frData: object[], pinData: object[], recData: object[]): DataSet {
        return new DataSet({
            rawData: {
                frequent: this._createRecordSet(frData),
                pinned: this._createRecordSet(pinData),
                recent: this._createRecordSet(recData),
            },
            itemsProperty: '',
            keyProperty: 'ObjectId',
        });
    }
}

export default HistorySourceMenu;
