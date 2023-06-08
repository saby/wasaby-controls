import { List, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IListEditorOptions } from '../interface/IList';

export default function addItemsFromSelector(
    selectedItems: RecordSet | List<Model>,
    items: RecordSet,
    options: IListEditorOptions
): void {
    const maxItemsCount = getMaxItemsCount(options);
    // Выбранные элементы надо добавлять после запиненных записей и записей для сброса параметра фильтрации
    let addIndex = getLastFixedItemIndex(items, options);
    let itemsCount = items.getCount();
    let itemIndex;

    if (maxItemsCount) {
        items.setEventRaising(false, true);
        selectedItems.each((item) => {
            if (addIndex > maxItemsCount) {
                return;
            }
            // Логика добавление записей следующая:
            // Если запись уже есть в списке, она просто перемещается вверх списка, но после запиненых записей
            // Если записи нет, она добавляется в начало списка, запись внизу списка удаляется,
            // если она вышла за пределы навигации
            const keyProperty = items.getKeyProperty();
            itemIndex = items.getIndexByValue(keyProperty, item.get(keyProperty));
            if (itemIndex !== -1) {
                if (itemIndex > addIndex) {
                    items.move(itemIndex, addIndex);
                }
            } else {
                items.add(item, addIndex);

                if (itemsCount + 1 > maxItemsCount) {
                    items.removeAt(itemsCount);
                } else {
                    itemsCount++;
                }
            }
            addIndex++;
        });
        items.setEventRaising(true, true);
    } else {
        items.assign(selectedItems);
    }
}

function getMaxItemsCount(options: IListEditorOptions): number | void {
    const navigation = options.navigation;
    let pageSize;

    if (navigation?.source === 'page') {
        pageSize = navigation.sourceConfig?.pageSize;
    }
    return pageSize;
}

function getLastFixedItemIndex(items: RecordSet, options: IListEditorOptions): number {
    let lastIndex = getLastHistoryItemIndex(items, options);
    if (options.emptyText || options.selectedAllText) {
        lastIndex++;
    }
    return lastIndex;
}

function getLastHistoryItemIndex(items: RecordSet, options: IListEditorOptions): number {
    let lastHistoryItemIndex;

    if (options.historyId !== undefined) {
        items.each((item, index) => {
            if (typeof lastHistoryItemIndex !== 'number' && !item.get('pinned')) {
                lastHistoryItemIndex = index;
            }
        });
    } else {
        lastHistoryItemIndex = 0;
    }

    return lastHistoryItemIndex;
}
