import {
    IHistoryStore,
    THistoryElementId,
    THistoryId,
    THistoryData,
    THistoryLoadConfig,
    IHistoryItem,
    IHistoryStoreData,
} from 'Controls/HistoryStore';
import { LocalStorage } from 'BrowserAPI/Storage';
import { RecordSet, factory } from 'Types/collection';
import { Model } from 'Types/entity';
import { factory as chain } from 'Types/chain';
import { Serializer } from 'UI/State';

const getSerialize = (): Serializer => {
    return new Serializer();
};

function createHistoryItem(
    objectId: THistoryElementId,
    objectData: string,
    historyId: THistoryId,
    counter: number
): Model<IHistoryItem> {
    return new Model<IHistoryItem>({
        keyProperty: 'ObjectId',
        rawData: {
            ObjectId: objectId,
            ObjectData: objectData,
            HistoryId: historyId,
            Counter: counter,
        },
    });
}

function validateHistory(
    historyId: string,
    itemsByHistoryId: IHistoryStoreData,
    id: THistoryElementId
): string {
    if (!itemsByHistoryId.recent?.getRecordById(id) && !itemsByHistoryId.pinned?.getRecordById(id))
        return `Элемента с id: ${id} не существует в истории с historyId: ${historyId}`;

    return '';
}

function initRecordSet(): RecordSet<IHistoryItem> {
    return new RecordSet<IHistoryItem>({
        keyProperty: 'ObjectId',
    });
}

function getHistory(historyId: THistoryId): IHistoryStoreData {
    const localStorage = new LocalStorage();
    if (!localStorage.getItem(historyId)) {
        localStorage.setItem(historyId, {
            frequent: initRecordSet(),
            recent: initRecordSet(),
            client: initRecordSet(),
            pinned: initRecordSet(),
        });
    }
    return localStorage.getItem(historyId);
}

const incrementCounterByObjectData = (
    dataStorage: IHistoryStoreData,
    historyId: THistoryData,
    value: [object]
): void => {
    const localStorage = new LocalStorage();
    const objectData = JSON.stringify(value, getSerialize().serialize);
    let recordSetKey: string = '';
    Object.keys(dataStorage).forEach((key) => {
        dataStorage[key]?.each((el: Model<IHistoryItem>) => {
            if (el.get('ObjectData') === objectData) {
                recordSetKey = key;
                el.set('Counter', el.get('Counter') + 1);
            }
        });
    });

    if (recordSetKey) {
        if (recordSetKey === 'pinned') {
            localStorage.setItem(historyId, {
                ...dataStorage,
            });
        } else {
            localStorage.setItem(historyId, {
                ...dataStorage,
                [recordSetKey]: chain(dataStorage[recordSetKey])
                    .sort((a, b) => {
                        return b.get('Counter') - a.get('Counter');
                    })
                    .value(factory.recordSet, getFactoryConfig(dataStorage[recordSetKey])),
            });
        }
    }
};

const getIncrementFunction = (value: THistoryData) => {
    return function (el: Model<IHistoryItem>) {
        if (value === el.getKey()) {
            el.set('Counter', el.get('Counter') + 1);
        }
        return el;
    };
};

const sortByCounter = (b: Model<IHistoryItem>, a: Model<IHistoryItem>) =>
    b.get('Counter') - a.get('Counter');

const getFactoryConfig = (rs: RecordSet<IHistoryItem>): object => {
    return {
        adapter: rs.getAdapter(),
        keyProperty: 'ObjectId',
        format: rs.getFormat(),
    };
};

const increment = (
    pinned: RecordSet<IHistoryItem>,
    value: THistoryData
): RecordSet<IHistoryItem> => {
    return chain(pinned)
        .map(getIncrementFunction(value))
        .value(factory.recordSet, getFactoryConfig(pinned));
};

const incrementAndSort = (
    rs: RecordSet<IHistoryItem>,
    value: THistoryData
): RecordSet<IHistoryItem> => {
    return chain(rs)
        .map(getIncrementFunction(value))
        .sort(sortByCounter)
        .value(factory.recordSet, getFactoryConfig(rs));
};

export const Store: IHistoryStore = {
    delete(historyId: string, id: THistoryElementId): Promise<void> {
        const localStorage = new LocalStorage();
        const itemsByHistoryId: IHistoryStoreData = getHistory(historyId); //localStorage.getItem(historyId);

        const validateError: string = validateHistory(historyId, itemsByHistoryId, id);

        if (validateError) {
            return Promise.reject(validateError);
        }

        if (itemsByHistoryId.pinned?.getRecordById(id)) {
            itemsByHistoryId.pinned.remove(itemsByHistoryId.pinned.getRecordById(id));
        } else if (itemsByHistoryId.recent?.getRecordById(id)) {
            itemsByHistoryId.recent.remove(itemsByHistoryId.recent.getRecordById(id));
        }

        localStorage.setItem(historyId, itemsByHistoryId);
        return Promise.resolve();
    },

    getLocal(historyId: THistoryId): IHistoryStoreData {
        return getHistory(historyId);
    },

    load(
        historyId: THistoryId | THistoryId[],
        config?: THistoryLoadConfig
    ): Promise<IHistoryStoreData> {
        return Promise.resolve(getHistory(historyId));
    },

    push(historyId: THistoryId, value: THistoryData, client?: boolean): Promise<void> {
        const localStorage = new LocalStorage();
        const itemsByHistoryId: IHistoryStoreData = getHistory(historyId);
        let isCounterChanged: boolean = false;

        const values = Array.isArray(value) ? value : [value];
        if (typeof values[0] !== 'number' && typeof values[0] !== 'string') {
            isCounterChanged = true;
            incrementCounterByObjectData(itemsByHistoryId, historyId, values);
        } else {
            values.forEach((val: THistoryData) => {
                if (itemsByHistoryId.pinned?.getRecordById(val)) {
                    isCounterChanged = true;
                    localStorage.setItem(historyId, {
                        ...itemsByHistoryId,
                        pinned: increment(itemsByHistoryId.pinned, val),
                    });
                } else if (itemsByHistoryId.recent?.getRecordById(val)) {
                    isCounterChanged = true;
                    localStorage.setItem(historyId, {
                        ...itemsByHistoryId,
                        recent: incrementAndSort(itemsByHistoryId.recent, val),
                    });
                } else if (itemsByHistoryId.frequent?.getRecordById(val)) {
                    isCounterChanged = true;
                    localStorage.setItem(historyId, {
                        ...itemsByHistoryId,
                        frequent: incrementAndSort(itemsByHistoryId.frequent, val),
                    });
                } else if (itemsByHistoryId.client?.getRecordById(val)) {
                    // TODO сохранённые для клиента
                }
            });
        }
        if (!isCounterChanged) {
            itemsByHistoryId.recent?.add(createHistoryItem(value, value, historyId, 1));
            localStorage.setItem(historyId, itemsByHistoryId);
        }

        return Promise.resolve();
    },

    togglePin(historyId: THistoryId, id: THistoryElementId): Promise<void> {
        const localStorage = new LocalStorage();
        const itemsByHistoryId: IHistoryStoreData = getHistory(historyId);

        if (itemsByHistoryId.pinned?.getRecordById(id)) {
            itemsByHistoryId.recent?.add(itemsByHistoryId.pinned?.getRecordById(id));
            itemsByHistoryId.pinned?.remove(itemsByHistoryId.pinned?.getRecordById(id));
        } else if (itemsByHistoryId.recent?.getRecordById(id)) {
            itemsByHistoryId.pinned?.add(itemsByHistoryId.recent?.getRecordById(id));
            itemsByHistoryId.recent?.remove(itemsByHistoryId.recent?.getRecordById(id));
        } else {
            itemsByHistoryId.pinned?.add(createHistoryItem(id, null, historyId, 0));
        }

        localStorage.setItem(historyId, itemsByHistoryId);
        return Promise.resolve();
    },

    update(historyId: THistoryId, id: THistoryElementId, value: THistoryData): Promise<void> {
        const localStorage = new LocalStorage();
        const itemsByHistoryId: IHistoryStoreData = getHistory(historyId);

        const validateError: string = validateHistory(historyId, itemsByHistoryId, id);

        if (validateError) {
            return Promise.reject(validateError);
        }

        if (itemsByHistoryId.pinned?.getRecordById(id)) {
            itemsByHistoryId.pinned.getRecordById(id).set('ObjectData', value);
        } else if (itemsByHistoryId.recent?.getRecordById(id)) {
            itemsByHistoryId.recent.getRecordById(id).set('ObjectData', value);
        }

        localStorage.setItem(historyId, itemsByHistoryId);
        return Promise.resolve();
    },
};
