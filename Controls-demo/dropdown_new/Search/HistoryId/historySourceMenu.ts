import { DataSet, Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Source, Service } from 'Controls/historyOld';

function getHistoryData(): object[] {
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
    };
}

export function getItems(): object[] {
    return [
        { key: 1, title: 'admin.sbis.ru' },
        { key: 2, title: 'booking.sbis.ru' },
        { key: 3, title: 'ca.sbis.ru' },
        { key: 4, title: 'ca.tensor.ru' },
        { key: 5, title: 'cloud.sbis.ru' },
        { key: 6, title: 'consultant.sbis.ru' },
        { key: 7, title: 'explain.sbis.ru' },
        { key: 8, title: 'genie.sbis.ru' },
        { key: 9, title: 'my.sbis.ru' },
        { key: 10, title: 'ofd.sbis.ru' },
        { key: 11, title: 'online.sbis.ru' },
        { key: 12, title: 'presto-offline' },
        { key: 13, title: 'retail-offline' },
        { key: 14, title: 'sbis.ru' },
        { key: 15, title: 'tensor.ru' },
        { key: 16, title: 'wi.sbis.ru' },
        { key: 17, title: 'dev-online.sbis.ru' },
        { key: 18, title: 'fix-online.sbis.ru' },
        { key: 19, title: 'fix-cloud.sbis.ru' },
        { key: 20, title: 'rc-online.sbis.ru' },
        { key: 21, title: 'pre-test-online.sbis.ru' },
        { key: 22, title: 'test-online.sbis.ru' },
    ];
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
        this._$originSource =
            config.source ||
            new Memory({
                keyProperty: 'key',
                data: getItems(),
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
    ): Promise<void> {
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

    private _createRecordSet(data) {
        return new RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: 'adapter.sbis',
        });
    }

    private _createDataSet(frData, pinData, recData) {
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
