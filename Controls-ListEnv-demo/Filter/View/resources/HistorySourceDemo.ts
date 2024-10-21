import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { Serializer } from 'UI/State';
import { DataSet } from 'Types/source';

interface IHistorySourceDemoOptions {
    recent: number;
    historyId: string;
}

interface IResult {
    items: string;
}

interface IRecentData {
    d: unknown[];
    s: object[];
    _type: string;
}
const HISTORY_ITEMS_COUNT = 1;

const pinnedData = {
    _type: 'recordset',
    d: [],
    s: [
        { n: 'ObjectId', t: 'Строка' },
        { n: 'ObjectData', t: 'Строка' },
        { n: 'HistoryId', t: 'Строка' },
    ],
};
const frequentData = {
    _type: 'recordset',
    d: [],
    s: [],
};

function createRecordSet(data: object): RecordSet {
    return new RecordSet({
        rawData: data,
        keyProperty: 'ObjectId',
        adapter: 'adapter.sbis',
    });
}

export default class DemoHistorySource {
    protected _$recent: number = null;
    protected _historyItemsCount: number = 10;
    protected _historyId: string = 'myHistoryId';
    protected _counter: number = 1;
    protected _recentData: IRecentData = {
        _type: 'recordset',
        d: [],
        s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' },
        ],
    };

    constructor(cfg: IHistorySourceDemoOptions) {
        if (cfg.historyId === 'FILTER_HISTORY_WITH_ITEM') {
            this._recentData.d.push([
                String(this._counter++),
                '[{"value":"2","textValue":"Женский","name":"radioGender","viewMode":"basic"}]',
                cfg.historyId,
            ]);
        }
        this._$recent = cfg.recent;
        this._historyId = cfg.historyId;
        this._historyItemsCount = HISTORY_ITEMS_COUNT;
    }

    query(): Promise<DataSet> {
        return new Promise((resolve): void => {
            resolve(this.getData(this._historyItemsCount));
        });
    }

    saveHistory(): void {
        // for demo
    }

    getHistoryId(): string {
        return this._historyId;
    }

    getHistoryIds(): string[] {
        return [];
    }

    update(result: IResult): object {
        if (result.items) {
            const data = JSON.parse(result.items)?.items;
            if (data) {
                this._recentData.d.push([
                    String(this._counter++),
                    JSON.stringify(data, new Serializer().serialize),
                    'myHistoryId',
                ]);
            }
        }
        return {
            addCallback: () => {
                // for demo
            },
        };
    }

    destroy(): void {
        //
    }

    private getData(historyItemsCount: number): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(frequentData),
                pinned: createRecordSet(pinnedData),
                recent: createRecordSet(this._recentData),
            },
            keyProperty: 'ObjectId',
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
