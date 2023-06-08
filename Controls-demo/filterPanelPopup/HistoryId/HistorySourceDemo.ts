import { register } from 'Types/di';
import { RecordSet } from 'Types/collection';
import { Serializer } from 'UI/State';
import { DataSet, Memory } from 'Types/source';
import { merge } from 'Types/object';
import { object } from 'Types/util';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';

interface IHistorySourceDemoOptions {
    recent: number;
    historyId: string;
}

const historyItemsValues = {
    city: {
        value: ['Moscow'],
        textValue: 'Moscow',
    },
};

const defaultItems: IFilterItem[] = [
    {
        name: 'city',
        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
        resetValue: [],
        value: [],
        viewMode: 'basic',
        editorOptions: {
            source: new Memory({
                keyProperty: 'id',
                data: [
                    { id: 'Yaroslavl', title: 'Yaroslavl' },
                    { id: 'Moscow', title: 'Moscow' },
                    { id: 'Kazan', title: 'Kazan' },
                ],
            }),
            displayProperty: 'title',
            keyProperty: 'id',
            extendedCaption: 'Город',
        },
    },
];

function getChangedHistoryItems(count?: number): object[] {
    return getHistoryItems(count).map((historyItem): object => {
        return merge(
            object.clone(historyItem),
            historyItemsValues[historyItem.name as string]
        );
    });
}

function getHistoryItems(count?: number): object[] {
    const historyItems = defaultItems.filter((item): boolean => {
        return historyItemsValues.hasOwnProperty(item.name);
    });
    return historyItems ? historyItems.slice(0, count) : historyItems;
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

const recentData = {
    _type: 'recordset',
    d: [
        [
            '8',
            JSON.stringify(
                getChangedHistoryItems(1),
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

function createRecordSet(data: object): RecordSet {
    return new RecordSet({
        rawData: data,
        keyProperty: 'ObjectId',
        adapter: 'adapter.sbis',
    });
}

export default class DemoHistorySource {
    protected _$recent: number = null;
    protected _historyItemsCount: number = 1;
    protected _historyId: string = 'myHistoryId';

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

    update(): object {
        return {
            addCallback: () => {
                // for demo
            },
        };
    }

    destroy(): void {
        //
    }

    private getRecentData(count: number): object {
        return {
            ...recentData,
            d: recentData.d.slice(0, count),
        };
    }

    private getData(historyItemsCount: number): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(frequentData),
                pinned: createRecordSet(pinnedData),
                recent: createRecordSet(this.getRecentData(historyItemsCount)),
            },
            keyProperty: 'ObjectId',
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
