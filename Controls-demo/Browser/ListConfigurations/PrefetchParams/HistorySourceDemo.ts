import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { DataSet } from 'Types/source';
import { Guid, Model } from 'Types/entity';

interface IHistorySourceDemoOptions {
    recent: number;
    historyId: string;
}

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

const recentData = {
    _type: 'recordset',
    d: [],
    s: [
        { n: 'ObjectId', t: 'Строка' },
        { n: 'ObjectData', t: 'Строка' },
        { n: 'HistoryId', t: 'Строка' },
    ],
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
    protected _historyId: string = 'myHistoryId';

    constructor(cfg: IHistorySourceDemoOptions) {
        this._$recent = cfg.recent;
        this._historyId = cfg.historyId;
        this._recentData = createRecordSet(this.getRecentData());
    }

    query(): Promise<DataSet> {
        return new Promise((resolve): void => {
            resolve(this.getData());
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

    update(
        data: {
            items: object[];
        },
        meta: {
            $_addFromData?: unknown;
        }
    ): object {
        let guid = Guid.create();
        const recent = this._recentData;
        const index = recent.getIndexByValue('ObjectData', data.items);
        if (index !== -1) {
            guid = recent.at(index).getId();
        } else if (meta.hasOwnProperty('$_addFromData') && index === -1) {
            const historyItem = new Model({
                rawData: {
                    d: [guid, data.items, this._historyId],
                    s: [
                        { n: 'ObjectId', t: 'Строка' },
                        { n: 'ObjectData', t: 'Строка' },
                        { n: 'HistoryId', t: 'Строка' },
                    ],
                },
                adapter: recent.getAdapter(),
            });
            recent.append([historyItem]);
        }
        return Promise.resolve(
            new DataSet({
                rawData: guid,
            })
        );
    }

    destroy(): void {
        //
    }

    private getRecentData(count: number = 10): object {
        return {
            ...recentData,
            d: recentData.d.slice(0, count),
        };
    }

    private getData(): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(frequentData),
                pinned: createRecordSet(pinnedData),
                recent: this._recentData,
            },
            keyProperty: 'ObjectId',
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
