import { RecordSet, factory as collectionFactory } from 'Types/collection';
import { IFilterItem, FilterHistory } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { Serializer } from 'UI/State';
import { factory } from 'Types/chain';
import { Store } from 'Controls/HistoryStore';
import getFilterItemsTextValue from './getFilterItemsTextValue';

function removeOutdatedFilters(
    filterDescription: IFilterItem[],
    historyItems: RecordSet
): RecordSet {
    const getOriginalItem = (historyItem: IFilterItem): IFilterItem | void => {
        return filterDescription.find((origItem) => {
            return (
                origItem.name === historyItem.name &&
                (historyItem.historyId === origItem.historyId ||
                    !historyItem.historyId ||
                    !origItem.historyId)
            );
        });
    };
    let originalItem;
    let hasResetValue;

    factory(historyItems)
        .map((item) => {
            let objectData = FilterHistory.getFilterHistoryItemData(item);
            if (objectData) {
                let history = objectData.items || objectData;

                if (!Array.isArray(history)) {
                    history = [history];
                }
                const historyText: string[] = [];
                const historyItems = history.filter((hItem) => {
                    const textValue = hItem.textValue;
                    const hasTextValue =
                        textValue !== '' && textValue !== undefined && textValue !== null;
                    const value = hItem.value;

                    // 0 and false is valid
                    originalItem = getOriginalItem(hItem);
                    hasResetValue = originalItem && originalItem.hasOwnProperty('resetValue');
                    const checkResult =
                        hasTextValue &&
                        originalItem &&
                        (!hasResetValue ||
                            (hasResetValue && !isEqual(value, originalItem.resetValue)));

                    if (checkResult) {
                        historyText.push(textValue);
                    }

                    return checkResult;
                });
                if (objectData.items) {
                    objectData.items = historyText.join(', ') ? historyItems : [];
                } else {
                    objectData = historyItems;
                }
                item.set('ObjectData', JSON.stringify(objectData, new Serializer().serialize));
                return item;
            }
        })
        .value();
    return historyItems;
}

function isItemsEqual(
    filterItems: IFilterItem[],
    compareFilterItems: IFilterItem[] = [],
    filterDescription: IFilterItem[]
): boolean {
    const isEqualByValue = filterItems.every((item) => {
        const compareFilterItem = compareFilterItems.find((compareItem) => {
            return compareItem.name === item.name;
        });
        return compareFilterItem && isEqual(compareFilterItem.value, item.value);
    });
    const isEqualByTextValue =
        getFilterItemsTextValue(filterItems, filterDescription) ===
        getFilterItemsTextValue(compareFilterItems, filterDescription);

    return (
        filterItems.length === compareFilterItems?.length && (isEqualByValue || isEqualByTextValue)
    );
}

function hasHistoryIdOnItems(filterDescription: IFilterItem[]): boolean {
    return !!filterDescription.find(({ historyId }) => historyId !== undefined);
}

function removeDuplicatedFilters(
    filterDescription: IFilterItem[],
    historyItems: RecordSet,
    historyId: string
): RecordSet {
    const processedItemsArray = [];
    const historyForRemove = [];
    const resultItems = factory(historyItems)
        .filter((item) => {
            const objectData = FilterHistory.getFilterHistoryItemData(item);

            if (objectData) {
                const filterItems = objectData.items || objectData;
                const isDuplicated = processedItemsArray.some((processedItems) => {
                    return isItemsEqual(processedItems, filterItems, filterDescription);
                });

                if (!isDuplicated && filterItems?.length) {
                    processedItemsArray.push(filterItems);
                    return objectData;
                } else if (isDuplicated || !filterItems?.length) {
                    historyForRemove.push(item.getKey());
                }
            } else {
                historyForRemove.push(item.getKey());
            }
        })
        .value(collectionFactory.recordSet, {
            adapter: historyItems.getAdapter(),
            keyProperty: 'ObjectId',
        });
    if (historyForRemove.length && !hasHistoryIdOnItems(filterDescription)) {
        historyForRemove.forEach((key) => {
            Store.delete(historyId, key);
        });
    }

    return resultItems;
}

export default function filterHistoryItems(
    filterDescription: IFilterItem[],
    history: RecordSet,
    historyId: string
): RecordSet {
    let result;
    if (history) {
        const filteredItems = removeOutdatedFilters(filterDescription, history);
        result = removeDuplicatedFilters(filterDescription, filteredItems, historyId);
    } else {
        result = history;
    }

    return result;
}
