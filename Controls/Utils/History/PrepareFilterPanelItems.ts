import { RecordSet } from 'Types/collection';
import { THistoryFields, THistoryField } from './interfaces/IHistoryFields';
import { groupConstants } from 'Controls/list';
import { Model } from 'Types/entity';
import { Store } from 'Controls/HistoryStore';

export const COPY_ORIG_ID = 'copyOriginalId';
export const IS_DUPLICATED_ITEM = 'isDuplicatedItem';

function addProperty(record: RecordSet, name: string, type: string, defaultValue: any): void {
    if (record.getFormat().getFieldIndex(name) === -1) {
        record.addField({ name, type, defaultValue });
    }
}

function setItemsHistoryProperties(items: RecordSet) {
    const historyFields: THistoryFields = [
        ['pinned', 'boolean', false],
        ['recent', 'boolean', false],
        ['frequent', 'boolean', false],
        [IS_DUPLICATED_ITEM, 'boolean', false],
        [COPY_ORIG_ID, 'string', ''],
    ];
    historyFields.forEach((field: THistoryField) => {
        addProperty(items, field[0], field[1], field[2]);
    });
}

export function prepareFilterPanelHistoryItems(
    items: RecordSet,
    historyId: string,
    config: object
): RecordSet {
    const { parentProperty, nodeProperty, keyProperty } = config;

    setItemsHistoryProperties(items);

    items.setEventRaising(false, false);
    items.each((item) => {
        item.set(COPY_ORIG_ID, String(item.get(keyProperty)));
    });
    items.setEventRaising(true, false);

    const inputHistoryResult = items.getMetaData().input_history_result;
    const inputHistoryMeta = items.getMetaData().input_history_meta;

    setItemsHistoryProperties(inputHistoryResult);

    if (inputHistoryResult && inputHistoryMeta) {
        inputHistoryResult.each((item) => {
            const key = item.getKey() || item.get(keyProperty);
            const historyMetaValue = inputHistoryMeta[key];
            if (historyMetaValue) {
                //отключаем действие запинивания/распиивания
                const originalItem = items.getRecordById(item.getKey());
                if (originalItem) {
                    originalItem.set(IS_DUPLICATED_ITEM, true);
                }

                item.set(historyMetaValue, true);
                item.set(COPY_ORIG_ID, item.get(keyProperty) + '_history');
                item.set(nodeProperty, null);
                item.set(parentProperty, null);
            }
        });
    }

    items.prepend(inputHistoryResult);

    return items;
}

export function setHistoryItemsGroupProperty(items: RecordSet, options) {
    if (options.historyId) {
        items.setEventRaising(false, true);
        if (options.groupProperty) {
            items.each((el) => {
                if (isHistoryItem(el) && el.get(options.parentProperty) === null) {
                    el.set(options.groupProperty, 'historyItem');
                }
            });
        } else {
            if (items.getFormat().getFieldIndex('historyGroup') === -1) {
                items.addField({
                    name: 'historyGroup',
                    type: 'string',
                    defaultValue: 'noHistoryItem',
                });
            }
            items.each((el) => {
                el.set('historyGroup', 'noHistoryItem');
                if (isHistoryItem(el)) {
                    el.set('historyGroup', groupConstants.hiddenGroup);
                }
            });
        }
        items.setEventRaising(true, true);
    }
}

function isHistoryItem(item: Model): boolean {
    return !!(item.get('pinned') || item.get('recent') || item.get('frequent'));
}

function hasHistory(historyId): boolean {
    const historyData = Store.getLocal(historyId);
    return !!(
        historyData?.pinned?.getCount() ||
        historyData?.recent?.getCount() ||
        historyData?.frequent?.getCount()
    );
}

export function hasHistoryItem(items: RecordSet): boolean {
    let hasHistoryElement = false;

    items.each((item) => {
        if (isHistoryItem(item)) {
            hasHistoryElement = true;
        }
    });
    return hasHistoryElement;
}

export function getGroupProperty(items, options): string {
    if (hasHistory(options.historyId) || (hasHistoryItem(items) && !options.groupProperty)) {
        return 'historyGroup';
    }
    return null;
}
