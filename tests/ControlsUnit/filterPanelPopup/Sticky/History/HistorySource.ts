import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { Serializer } from 'UI/State';
import { DataSet } from 'Types/source';
import { object } from 'Types/util';

interface IHistorySourceDemoOptions {
    recent: number;
    historyId: string;
}

interface IResult {
    items: string;
}

interface IHistoryData {
    d: unknown[];
    s: object[];
    _type: string;
}
const HISTORY_ITEMS_COUNT = 1;

let pinnedData;
let frequentData;
let historyItem;

function createRecordSet(data: object): RecordSet {
    return new RecordSet({
        rawData: data,
        keyProperty: 'ObjectId',
        adapter: 'adapter.sbis',
    });
}

export function resetHistory(): void {
    historyItem = {
        name: 'extendedFilter-1',
        value: true,
        resetValue: false,
        viewMode: 'basic',
        textValue: 'extendedFilter-1',
        extendedCaption: 'extendedFilterCaption-1',
        editorTemplateName: 'Controls/filterPanel:BooleanEditor',
        editorOptions: {
            value: true,
        },
    };

    pinnedData = {
        _type: 'recordset',
        d: [],
        s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' },
        ],
    };

    frequentData = {
        _type: 'recordset',
        d: [],
        s: [],
    };
}

resetHistory();

export default class DemoHistorySource {
    protected _$recent: number = null;
    protected _historyItemsCount: number = 10;
    protected _historyId: string = 'testHistoryId';
    protected _counter: number = 1;
    protected _recentData: IHistoryData = {
        _type: 'recordset',
        d: [
            [
                'extendedFilter-1',
                JSON.stringify(historyItem, new Serializer().serialize),
                'testHistoryId',
            ],
        ],
        s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' },
        ],
    };
    private _pinnedData: IHistoryData;
    private _frequentData: IHistoryData;

    constructor(cfg: IHistorySourceDemoOptions) {
        resetHistory();
        this._frequentData = object.clonePlain(frequentData);
        this._pinnedData = object.clonePlain(pinnedData);
        if (cfg.historyId === 'testHistoryIdWithoutData') {
            this._recentData.d = [];
        }
        if (cfg.historyId === 'testHistoryIdAll') {
            this._recentData.d = [];
            for (let i = 0; i < 10; i++) {
                this._recentData.d.push([
                    'extendedFilter-' + i,
                    JSON.stringify(
                        {
                            name: 'extendedFilter-' + i,
                            value: true,
                            resetValue: false,
                            viewMode: 'basic',
                            textValue: 'extendedFilter-' + i,
                            extendedCaption: 'extendedFilterCaption-' + i,
                            editorTemplateName:
                                'Controls/filterPanel:BooleanEditor',
                            editorOptions: {
                                value: true,
                            },
                        },
                        new Serializer().serialize
                    ),
                    'testHistoryIdAll',
                ]);
            }
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
                    'testHistoryId',
                ]);
            }
        }
        return {
            addCallback: () => {
                // for demo
            },
        };
    }

    private getData(historyItemsCount: number): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(this._frequentData),
                pinned: createRecordSet(this._pinnedData),
                recent: createRecordSet(this._recentData),
            },
            keyProperty: 'ObjectId',
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
