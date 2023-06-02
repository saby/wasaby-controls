import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { Serializer } from 'UI/State';
import { DataSet, Memory } from 'Types/source';
import { merge } from 'Types/object';
import { object } from 'Types/util';
import { IFilterItem } from 'Controls/filter';

interface IHistorySourceDemoOptions {
    recent: number;
    favorite: boolean;
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

interface IHistoryItem {
    name: string;
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
const clientData = {
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

const historyItemsValues = {
    city: {
        value: ['Moscow'],
        textValue: 'Moscow',
    },
};

const defaultItems: IFilterItem[] = [
    {
        name: 'city',
        value: ['Moscow'],
        resetValue: [],
        viewMode: 'basic',
        textValue: '',
        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
        editorOptions: {
            source: new Memory({
                data: [
                    { id: 'Yaroslavl', title: 'Yaroslavl' },
                    { id: 'Moscow', title: 'Moscow' },
                    { id: 'Kazan', title: 'Kazan' },
                ],
                keyProperty: 'id',
            }),
            selectedAllText: 'Все города',
            multiSelect: true,
            keyProperty: 'id',
            displayProperty: 'title',
        },
    },
];

function getChangedHistoryItems(): object[] {
    return defaultItems.map((historyItem: IHistoryItem): object => {
        return merge(
            object.clone(historyItem),
            historyItemsValues[historyItem.name as string]
        );
    });
}

function createRecordSet(data: object): RecordSet {
    return new RecordSet({
        rawData: data,
        keyProperty: 'ObjectId',
        adapter: 'adapter.sbis',
    });
}

export default class DemoHistorySource {
    protected _$recent: number = null;
    protected _$favorite: boolean = null;
    protected _historyItemsCount: number = 10;
    protected _historyId: string = 'myHistoryId';
    protected _counter: number = 1;
    protected _recentData: IRecentData = {
        _type: 'recordset',
        d: [
            [
                '0',
                JSON.stringify(
                    getChangedHistoryItems(),
                    new Serializer().serialize
                ),
                'myHistoryId',
            ],
        ],
        s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' },
        ],
    };
    protected _pinnedData: IRecentData = pinnedData;
    protected _clientData: IRecentData = clientData;

    constructor(cfg: IHistorySourceDemoOptions) {
        this._$recent = cfg.recent;
        this._$favorite = cfg.favorite;
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

    update(
        result: IResult,
        meta: {
            $_pinned: boolean;
            $_history: boolean;
            isClient: boolean;
        }
    ): object {
        if (meta.$_pinned || meta.isClient) {
            this._pinnedData.d.push([
                String(this._pinnedData.d.length),
                JSON.stringify(result, new Serializer().serialize),
                this._historyId,
            ]);
        }
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

    deleteItem(): void {
        //
    }

    private getData(): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(frequentData),
                pinned: createRecordSet(this._pinnedData),
                recent: createRecordSet(this._recentData),
                client: createRecordSet(this._clientData),
            },
            keyProperty: 'ObjectId',
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
