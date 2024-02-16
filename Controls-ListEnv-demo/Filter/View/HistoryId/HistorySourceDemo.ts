import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { Serializer } from 'UI/State';
import { DataSet, Memory } from 'Types/source';
import { merge } from 'Types/object';
import { object } from 'Types/util';
import { IFilterItem } from 'Controls/filter';

interface IHistorySourceDemoOptions {
    recent: number;
    historyId: string;
}

interface IHistoryItem {
    name: string;
}

interface IResult {
    items: string;
}

interface IRecentData {
    d: unknown[];
    s: object[];
    _type: string;
}

const historyItemsValues = {
    city: {
        value: 1,
        textValue: 'Yaroslavl',
    },
};

const defaultItems: IFilterItem[] = [
    {
        name: 'city',
        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
        resetValue: null,
        value: 1,
        viewMode: 'basic',
        editorOptions: {
            source: new Memory({
                keyProperty: 'id',
                data: [
                    { id: 1, title: 'Yaroslavl' },
                    { id: 2, title: 'Moscow' },
                    { id: 3, title: 'Kazan' },
                ],
            }),
            displayProperty: 'title',
            keyProperty: 'id',
            extendedCaption: 'Город',
        },
    },
];

function getChangedHistoryItems(): object[] {
    return defaultItems.map((historyItem: IHistoryItem): object => {
        return merge(object.clone(historyItem), historyItemsValues[historyItem.name as string]);
    });
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
        d: [
            [
                '0',
                JSON.stringify(getChangedHistoryItems(), new Serializer().serialize),
                'myHistoryId',
            ],
        ],
        s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' },
        ],
    };

    constructor(cfg: IHistorySourceDemoOptions) {
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
        return [this._historyId];
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
