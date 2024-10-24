import {
    IHistoryStore,
    THistoryId,
    THistoryData,
    IHistoryItem,
    IHistoryStoreData,
} from 'Controls/HistoryStore';
import {LocalStorage} from 'Browser/Storage';
import {RecordSet, factory} from 'Types/collection';
import {Model} from 'Types/entity';
import {factory as chain} from 'Types/chain';
import {Serializer} from 'UI/State';
import {CrudEntityKey} from 'Types/source';
import {Logger} from 'UI/Utils';

const getSerialize = (): Serializer => {
    return new Serializer();
};

function createHistoryItem(
    objectId: CrudEntityKey,
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
    id: CrudEntityKey
): string {
    if (!itemsByHistoryId.recent?.getRecordById(id) && !itemsByHistoryId.pinned?.getRecordById(id)) {
        const msg: string = `Элемента с id: ${id} не существует в истории с historyId: ${historyId}`;
        Logger.warn(msg);
        return msg;
    }

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

function setHistory(historyId: THistoryId, value: IHistoryStoreData): void {
    const localStorage = new LocalStorage();
    localStorage.setItem(historyId, value);
}

const incrementCounterByObjectData = (
    dataStorage: IHistoryStoreData,
    historyId: THistoryId,
    value: [object]
): void => {
    const objectData = JSON.stringify(value, getSerialize().serialize);
    const inHistoryIndex = dataStorage.recent?.getIndexByValue('ObjectData', objectData);

    if (inHistoryIndex !== -1) {
        const historyElement = dataStorage.recent.at(inHistoryIndex);
        historyElement.set('Counter', historyElement.get('Counter') + 1);
        setHistory(historyId, {
            ...dataStorage,
            recent: chain(dataStorage.recent)
                .sort((a, b) => {
                    return b.get('Counter') - a.get('Counter');
                })
                .value(factory.recordSet, getFactoryConfig(dataStorage.recent)),
        });
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

const incrementAndMove = (
    rs: RecordSet<IHistoryItem>,
    value: THistoryData
): RecordSet<IHistoryItem> => {
    rs.move(rs.getIndex(rs.getRecordById(value)), 0);
    return chain(rs)
        .map(getIncrementFunction(value))
        .value(factory.recordSet, getFactoryConfig(rs));
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

const pushToStore = (historyId: string, value: THistoryData) => {
    const historyStoreData: IHistoryStoreData = getHistory(historyId);
    let isCounterChanged: boolean = false;

    if ((Array.isArray(value) && typeof value[0] === 'object') || typeof value === 'object') {
        pushObjectToStore(historyId, value);
    } else {
        const values = Array.isArray(value) ? value : [value];
        values.forEach((val: CrudEntityKey) => {
            if (historyStoreData.pinned?.getRecordById(val)) {
                isCounterChanged = true;
                setHistory(historyId, {
                    ...historyStoreData,
                    pinned: increment(historyStoreData.pinned, val),
                });
            } else if (historyStoreData.recent?.getRecordById(val)) {
                isCounterChanged = true;
                setHistory(historyId, {
                    ...historyStoreData,
                    recent: incrementAndMove(historyStoreData.recent, val),
                });
            } else if (historyStoreData.frequent?.getRecordById(val)) {
                isCounterChanged = true;
                setHistory(historyId, {
                    ...historyStoreData,
                    frequent: incrementAndSort(historyStoreData.frequent, val),
                });
            }
        });
        if (!isCounterChanged) {
            values.forEach((val: CrudEntityKey) => {
                historyStoreData.recent?.prepend([createHistoryItem(val, val, historyId, 1)]);
            });
            setHistory(historyId, historyStoreData);
        }
    }
};

function pushObjectToStore(historyId: THistoryId, values: object[] | object): void {
    const historyStoreData = getHistory(historyId);
    incrementCounterByObjectData(historyStoreData, historyId, values);

    const value = JSON.stringify(values, getSerialize().serialize);
    historyStoreData.recent?.prepend([createHistoryItem(value, value, historyId, 1)]);
    setHistory(historyId, historyStoreData);
}

function togglePin(historyId: THistoryId, id: CrudEntityKey): Promise<void> {
    const itemsByHistoryId: IHistoryStoreData = getHistory(historyId);

    if (itemsByHistoryId.pinned?.getRecordById(id)) {
        itemsByHistoryId.pinned?.remove(itemsByHistoryId.pinned?.getRecordById(id));
    } else if (itemsByHistoryId.recent?.getRecordById(id)) {
        itemsByHistoryId.pinned?.add(itemsByHistoryId.recent?.getRecordById(id));
    } else {
        itemsByHistoryId.pinned?.add(createHistoryItem(id, null, historyId, 0));
    }

    setHistory(historyId, itemsByHistoryId);
    return Promise.resolve();
}

export const Store: IHistoryStore = {
    delete(historyId: string, id: CrudEntityKey): Promise<void> {
        const itemsByHistoryId = getHistory(historyId);

        const validateError = validateHistory(historyId, itemsByHistoryId, id);

        if (validateError) {
            return Promise.resolve();
        }

        if (itemsByHistoryId.pinned?.getRecordById(id)) {
            itemsByHistoryId.pinned.remove(itemsByHistoryId.pinned.getRecordById(id));
        } else if (itemsByHistoryId.recent?.getRecordById(id)) {
            itemsByHistoryId.recent.remove(itemsByHistoryId.recent.getRecordById(id));
        }

        setHistory(historyId, itemsByHistoryId);
        return Promise.resolve();
    },

    getLocal(historyId: THistoryId): IHistoryStoreData {
        return getHistory(historyId);
    },

    load(historyId: THistoryId): Promise<IHistoryStoreData> {
        return Promise.resolve(getHistory(historyId));
    },

    push(
        historyId: THistoryId,
        value: THistoryData | Record<THistoryId, THistoryData>
    ): Promise<string> {
        if (typeof value === 'object' && value?.hasOwnProperty(historyId)) {
            Object.keys(value).forEach((key) => {
                if (value.hasOwnProperty(key)) {
                    pushToStore(key, value[key] as THistoryData);
                }
            });
        } else {
            pushToStore(historyId, value);
        }
        return Promise.resolve(JSON.stringify(value, getSerialize().serialize));
    },

    togglePin,

    togglePinLocal: togglePin,

    update(historyId: THistoryId, id: CrudEntityKey, value: THistoryData): Promise<void> {
        const itemsByHistoryId: IHistoryStoreData = getHistory(historyId);
        const validateError = validateHistory(historyId, itemsByHistoryId, id);
        let objectDataValue;

        if (validateError) {
            return Promise.resolve();
        }

        if (typeof value === 'string') {
            objectDataValue = value;
        } else {
            objectDataValue = JSON.stringify(value, getSerialize().serialize);
        }
        if (itemsByHistoryId.pinned?.getRecordById(id)) {
            itemsByHistoryId.pinned.getRecordById(id).set('ObjectData', objectDataValue);
        } else if (itemsByHistoryId.recent?.getRecordById(id)) {
            itemsByHistoryId.recent.getRecordById(id).set('ObjectData', objectDataValue);
        }

        setHistory(historyId, itemsByHistoryId);
        return Promise.resolve();
    }
};

export enum historyItemType {
    RECENT = 'recent',
    FREQUENT = 'frequent',
    PINNED = 'pinned',
}
