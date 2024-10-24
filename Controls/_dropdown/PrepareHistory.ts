import { factory as RSFactory, RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import cInstance = require('Core/core-instance');
import rk = require('i18n!Controls');
import { IHistoryStoreData, Store, THistoryId } from 'Controls/HistoryStore';
import { ICrud } from 'Types/source';
import { Model } from 'Types/entity';
import { process } from 'Controls/error';

const COPY_ORIG_ID = 'copyOriginalId';
const COPY_ORIG_PARENT = 'copyOriginalParent';

const HISTORY_UPDATE_RECENT_DELAY = 50;

const MIN_RECENT = 3;
const MAX_HISTORY = 10;

/* После изменения оригинального рекордсета, в истории могут остаться записи,
       которых уже нет в рекордсете, поэтому их надо удалить из истории */
function prepareHistoryItems(
    historyItems: RecordSet,
    sourceItems: RecordSet,
    historyId: THistoryId,
    originSource: ICrud,
    historySourceConfig: IHistorySourceConfig
): RecordSet {
    const { unpinIfNotExist } = historySourceConfig;
    const hItems = historyItems.clone();
    if (
        unpinIfNotExist !== false &&
        cInstance.instanceOfModule(originSource, 'Types/source:Memory')
    ) {
        const toDelete = [];

        factory(hItems).each((rec) => {
            if (!sourceItems.getRecordById(rec.getKey())) {
                toDelete.push(rec);
            }
        });

        toDelete.forEach((rec) => {
            Store.delete(historyId, rec.getKey());
        });
    }
    return hItems;
}

function setHistoryFields(item: Model, idProperty: string, id: string): void {
    item.set(idProperty, id + '_history');
}

function getFrequentIds(
    frequent: Model[],
    filteredPinned: string[],
    oldItems: RecordSet,
    nodeProperty: string
): string[] {
    const frequentIds = [];

    // рассчитываем количество популярных пунктов
    const maxCountFrequent = MAX_HISTORY - filteredPinned.length - MIN_RECENT;
    let countFrequent = 0;
    let item;

    frequent.forEach((element: Model): void => {
        const id = element.getKey();
        item = oldItems.getRecordById(id);
        if (
            countFrequent < maxCountFrequent &&
            !filteredPinned.includes(id) &&
            !item?.get(nodeProperty)
        ) {
            frequentIds.push(String(id));
            countFrequent++;
        }
    });
    return frequentIds;
}

function getPinnedIds(pinned: RecordSet): string[] {
    return factory(pinned)
        .map((item: Model): string => {
            return String(item.getKey());
        })
        .value();
}

function getRecentIds(
    recent: Model[],
    filteredPinned: string[],
    filteredFrequent: string[],
    oldItems: RecordSet,
    nodeProperty: string
): string[] {
    const recentIds = [];
    let countRecent = 0;
    const maxCountRecent = MAX_HISTORY - (filteredPinned.length + filteredFrequent.length);
    let item;
    let id;

    recent.forEach((element: Model): void => {
        id = element.getKey();
        item = oldItems.getRecordById(id);
        if (
            countRecent < maxCountRecent &&
            !filteredPinned.includes(id) &&
            !filteredFrequent.includes(id) &&
            !item?.get(nodeProperty)
        ) {
            recentIds.push(String(id));
            countRecent++;
        }
    });
    return recentIds;
}

function needDuplicateItem(item: Model, historySourceConfig: IHistorySourceConfig): boolean {
    const { parentProperty, nodeProperty, root } = historySourceConfig;
    // Если элемент находится на подуровне или элемент является скрытым узлом
    return (
        (item.get(parentProperty) && item.get(parentProperty) !== root) ||
        isHiddenNode(item, nodeProperty)
    );
}

function isHiddenNode(item: Model, nodeProperty: string): boolean {
    return nodeProperty && item.get(nodeProperty) === false;
}

function checkPinnedAmount(pinned: RecordSet): boolean {
    return !pinned || pinned.getCount() !== MAX_HISTORY;
}

function showNotification(): void {
    import('Controls/popup').then((popup) => {
        popup.Notification.openPopup({
            template: 'Controls/popupTemplate:NotificationSimple',
            templateOptions: {
                style: 'danger',
                text: rk('Невозможно закрепить более 10 пунктов'),
                icon: 'Alert',
            },
        });
    });
}

function getRawHistoryItem(id: string, hId: string, rs: RecordSet): Model {
    const item = new Model({ adapter: rs.getAdapter() });
    item.addField({
        name: 'ObjectId',
        type: 'string',
    });
    item.addField({
        name: 'HistoryId',
        type: 'string',
    });
    item.set({
        ObjectId: typeof id === 'string' ? id : String(id),
        HistoryId: hId,
    });
    return item;
}

function getFilterHistory(rawHistoryData: any, oldItems: RecordSet, nodeProperty: string): any {
    const historyData: IHistoryStoreData = prepareHistoryDataObject(
        rawHistoryData,
        oldItems.getKeyProperty()
    );
    const pinnedIds = getPinnedIds(historyData.pinned);
    const frequentIds = getFrequentIds(historyData.frequent, pinnedIds, oldItems, nodeProperty);
    const recentIds = getRecentIds(
        historyData.recent,
        pinnedIds,
        frequentIds,
        oldItems,
        nodeProperty
    );

    return {
        pinned: pinnedIds,
        frequent: frequentIds,
        recent: recentIds,
    };
}

function addProperty(record: Model, name: string, type: string, defaultValue: any): void {
    if (record.getFormat().getFieldIndex(name) === -1) {
        record.addField({ name, type, defaultValue });
    }
}

function prepareOriginItems(
    oldItems: RecordSet,
    historyId: THistoryId,
    historySourceConfig: IHistorySourceConfig
): RecordSet {
    const { nodeProperty, parentProperty } = historySourceConfig;
    const items = oldItems.clone();
    const filteredHistory = getFilterHistory(Store.getLocal(historyId), oldItems, nodeProperty);

    const historyIds = filteredHistory.pinned.concat(
        filteredHistory.frequent.concat(filteredHistory.recent)
    );

    items.clear();

    // Clear может стереть исходный формат. Поэтому восстанавливаем его из исходного рекордсета.
    // https://online.sbis.ru/opendoc.html?guid=21e24eb1-8beb-46c8-acc0-43ec7286b2d4
    if (!oldItems.hasDecalredFormat()) {
        const format = oldItems.getFormat();
        factory(format).each((field: any): void => {
            addProperty(items, field.getName(), field.getType(), field.getDefaultValue());
        });
    }

    addProperty(items, 'pinned', 'boolean', false);
    addProperty(items, 'recent', 'boolean', false);
    addProperty(items, 'frequent', 'boolean', false);
    addProperty(items, 'HistoryId', 'string', historyId || '');

    // keyProperty для выпадающих списков с историей.
    // История должна работать даже если оригинальный ключ - целочисленный.
    addProperty(items, COPY_ORIG_ID, 'string', '');
    addProperty(items, COPY_ORIG_PARENT, 'string', '');

    fillItems(filteredHistory, 'pinned', oldItems, items, historySourceConfig, historyId);
    fillFrequentItems(filteredHistory, oldItems, items, historySourceConfig, historyId);
    fillItems(filteredHistory, 'recent', oldItems, items, historySourceConfig, historyId);
    oldItems.forEach((item: Model): void => {
        const key = item.getKey();
        // id is always string at history. To check whether an item belongs to history, convert id to string.
        const id =
            typeof key === 'string'
                ? key
                : String(key || item.get(historySourceConfig.keyProperty));
        const isHistoryItem = historyIds.indexOf(id) !== -1;
        let newItem;
        if (!isHistoryItem || needDuplicateItem(item, historySourceConfig)) {
            newItem = new Model({
                rawData: item.getRawData(),
                adapter: items.getAdapter(),
                format: items.getFormat(),
            });
            if (filteredHistory.pinned.indexOf(id) !== -1) {
                newItem.set('pinned', true);
            }
            if (isHistoryItem && !needDuplicateItem(item, historySourceConfig)) {
                setHistoryFields(
                    item,
                    COPY_ORIG_ID,
                    typeof historyItem.getId() === 'string'
                        ? historyItem.getId()
                        : String(historyItem.getId())
                );
                setParentField(item, parentProperty);
            } else {
                newItem.set(COPY_ORIG_ID, id);
                setParentField(newItem, parentProperty);
            }

            if (oldItems.getKeyProperty() === COPY_ORIG_ID) {
                //не дуюблируем элементы которые уже есть в коллекции с историей
                if (!items.getRecordById(newItem.get(COPY_ORIG_ID))) {
                    items.add(newItem);
                }
            } else {
                items.add(newItem);
            }
        }
    });

    return items;
}

function setParentField(item: Model, parentProperty: string): void {
    if (parentProperty) {
        const parent = item.get(parentProperty);
        const newParentKey = parent !== undefined && parent !== null ? String(parent) : parent;
        item.set(COPY_ORIG_PARENT, newParentKey);
    }
}

export function resetHistoryFields(historyItem: Model, keyProperty: string): Model {
    const item = historyItem.clone();
    if (item.has(COPY_ORIG_ID)) {
        item.setKeyProperty(keyProperty);
        return item;
    } else {
        return item;
    }
}

function prepareHistoryItem(item: Model, historyType: string): void {
    item.set(historyType, true);
    return item.has('group') && item.set('group', null);
}

function fillItems(
    history: any,
    historyType: string,
    oldItems: RecordSet,
    items: RecordSet,
    historySourceConfig: IHistorySourceConfig,
    historyId: THistoryId
): void {
    let item;
    let oldItem;
    let historyIdFromItem;
    let historyItem;
    const { parentProperty, nodeProperty, root } = historySourceConfig;
    history[historyType].forEach((id: string) => {
        // При первой загрузке истории в oldItems лежит оригинальный рекордсет, ищем запись по keyProperty.
        // В остальных случаях в oldItems лежат данные с учетом истории, поэтому ищем искомую запись по copyOriginalId
        const isHistoryOldItems = oldItems.getFormat().getFieldIndex('HistoryId') !== -1;
        if (isHistoryOldItems) {
            const oldItemIndex = oldItems.getIndexByValue(COPY_ORIG_ID, id);
            oldItem = oldItems.at(oldItemIndex);
        } else {
            oldItem = oldItems.getRecordById(id);
        }
        if (oldItem) {
            historyItem = Store.getLocal(historyId)[historyType].getRecordById(id);
            historyIdFromItem = historyItem.get('HistoryId');

            item = new Model({
                rawData: oldItem.getRawData(),
                adapter: items.getAdapter(),
                format: items.getFormat(),
            });
            const isNeedDuplicate = needDuplicateItem(item, historySourceConfig);
            if (parentProperty) {
                item.set(parentProperty, root);
            }

            // removing group allows items to be shown in history items
            prepareHistoryItem(item, historyType);
            item.set('HistoryId', historyIdFromItem);
            if (isNeedDuplicate) {
                setHistoryFields(
                    item,
                    COPY_ORIG_ID,
                    typeof historyItem.getId() === 'string'
                        ? historyItem.getId()
                        : String(historyItem.getId())
                );
                if (isHiddenNode(item, nodeProperty)) {
                    // Если это скрытый узел, задублируем его в истории и занулим nodeProperty, чтобы оригинальная запись с детьми осталась на своем месте
                    item.set(nodeProperty, null);
                }
            } else {
                item.set(
                    COPY_ORIG_ID,
                    typeof historyItem.getId() === 'string'
                        ? historyItem.getId()
                        : String(historyItem.getId())
                );
            }
            setParentField(item, parentProperty);
            items.add(item);
        }
    });
}

function fillFrequentItems(
    history: IHistoryStoreData,
    oldItems: RecordSet,
    items: RecordSet,
    historySourceConfig: IHistorySourceConfig,
    historyId: THistoryId
): void {
    const config = {
        adapter: items.getAdapter(),
        keyProperty: items.getKeyProperty(),
        format: items.getFormat(),
    };
    let frequentItems = new RecordSet(config);
    const displayProperty = historySourceConfig.displayProperty || 'title';
    let firstName;
    let secondName;

    fillItems(history, 'frequent', oldItems, frequentItems, historySourceConfig, historyId);

    // alphabet sorting
    frequentItems = factory(frequentItems)
        .sort((first, second): number => {
            firstName = first.get(displayProperty);
            secondName = second.get(displayProperty);

            return firstName < secondName ? -1 : firstName > secondName ? 1 : 0;
        })
        .value(RSFactory.recordSet, config);

    items.append(frequentItems);
}

export function updateRecent(data: any, meta: any, historyId: THistoryId): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let historyData;
            let recentData;

            if (data instanceof Array) {
                historyData = {
                    ids: [],
                };
                factory(data).each((item: Model): void => {
                    if (!item.get('doNotSaveToHistory')) {
                        const itemId = item.getKey();
                        historyData.ids.push(itemId);
                    }
                });
                if (historyData.ids.length) {
                    recentData = data;
                }
            } else {
                if (!data.get('doNotSaveToHistory')) {
                    historyData = data;
                    recentData = [data];
                }
            }

            if (recentData) {
                if (historyData.ids) {
                    historyData.ids.reverse().forEach((id) => {
                        Store.push(historyId, id);
                    });
                    resolve(true);
                } else {
                    resolve(Store.push(historyId, historyData.getKey()));
                }
            } else {
                resolve(false);
            }
        }, HISTORY_UPDATE_RECENT_DELAY);
    });
}

export function updatePinned(
    item: Model,
    meta: Record<string, any>,
    historyId: THistoryId
): Promise<void> {
    const pinned = Store.getLocal(historyId)?.pinned;
    if (!item.get('pinned') && !checkPinnedAmount(pinned)) {
        showNotification();
        return Promise.reject();
    }
    return Store.togglePin(historyId, item.getKey(), !!meta.$_pinned).catch((error) => {
        process(error);
    });
}

function itemNotExist(
    id: string,
    historyType: string = 'pinned',
    keyProperty: string,
    historyId: THistoryId
): void {
    if (historyType === 'pinned') {
        // удаляем элемент из pinned, если его нет в оригинальных данных,
        // иначе он будет занимаеть место в запиненных, хотя на самом деле такой записи нет
        unpinItemById(id, keyProperty, historyId);
    }
}

function unpinItemById(id: string, keyProperty: string, historyId: THistoryId): void {
    const meta = { $_pinned: false };
    const rawData: Record<string, any> = {};

    rawData.pinned = true;
    rawData[keyProperty] = id;

    const item = new Model({
        rawData,
        keyProperty,
    });

    updatePinned(item, meta, historyId);
}

function prepareHistoryDataObject(
    data: IHistoryStoreData | undefined,
    keyProperty: string
): IHistoryStoreData {
    if (!data) {
        const historyDataObject: IHistoryStoreData = { recent: null, pinned: null, frequent: null };
        ['pinned', 'recent', 'frequent'].forEach((historyType) => {
            historyDataObject[historyType] = new RecordSet({ rawData: [], keyProperty });
        });
        return historyDataObject;
    }
    return data;
}

function initHistory(
    data: IHistoryStoreData,
    sourceItems: RecordSet,
    historyId: THistoryId,
    originSource: ICrud,
    historySourceConfig: IHistorySourceConfig
): IHistoryStoreData {
    const { unpinIfNotExist } = historySourceConfig;
    const historyData: IHistoryStoreData = prepareHistoryDataObject(
        data,
        sourceItems.getKeyProperty()
    );
    const pinned = prepareHistoryItems(
        historyData.pinned,
        sourceItems,
        historyId,
        originSource,
        historySourceConfig
    );
    const recent = prepareHistoryItems(
        historyData.recent,
        sourceItems,
        historyId,
        originSource,
        historySourceConfig
    );
    const frequent = prepareHistoryItems(
        historyData.frequent,
        sourceItems,
        historyId,
        originSource,
        historySourceConfig
    );

    const sourcePinned = historySourceConfig?.pinned?.map((el) => String(el));

    if (sourcePinned instanceof Array) {
        sourcePinned.forEach((pinId: string): void => {
            if (sourceItems.getRecordById(pinId)) {
                const pinnedItem = pinned.getRecordById(pinId);
                // Для правильной сортировки запиненных записей
                if (pinnedItem) {
                    pinned.remove(pinnedItem);
                }
                pinned.add(getRawHistoryItem(pinId, historyId, pinned));
            }
        });
        if (!Store.getLocal(historyId).pinned?.getCount()) {
            pinned.each((pinItem) => {
                Store.togglePinLocal(historyId, pinItem.getKey(), true);
            });
        }
    }

    if (unpinIfNotExist) {
        pinned.forEach((pinItem) => {
            const id = pinItem?.get('ObjectId');
            const keyProperty = pinItem.getKeyProperty();
            if (id && !sourceItems.getRecordById(id)) {
                itemNotExist(id, 'pinned', keyProperty, historyId);
            }
        });
    }
    return { recent, frequent, pinned };
}

export function getItemsWithHistory(
    items: RecordSet,
    historyId: string,
    originSource: ICrud,
    config?: IHistorySourceConfig
): RecordSet {
    if (config) {
        initHistory(Store.getLocal(historyId), items, historyId, originSource, config);
        const historyItems: RecordSet = prepareOriginItems(items, historyId, config);
        return historyItems;
    } else {
        return items;
    }
}

export interface IHistorySourceConfig {
    parentProperty: string;
    nodeProperty: string;
    root: string;
    displayProperty: string;
    unpinIfNotExist: boolean;
    pinned: (string | number)[];
}
