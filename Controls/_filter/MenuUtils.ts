import { factory } from 'Types/chain';
import { factory as CollectionFactory } from 'Types/collection';
import { RecordSet } from 'Types/collection';

/**
 * Модуль с утилитами для подготовки данных для работы меню в фильтрах
 * @private
 */

type TKey = boolean | string | number;

/**
 * Создает RecordSet по переданным значениям
 * @param {object} items
 * @param {RecordSet} sourceRecordSet
 */
function createRecordSet(items: object, sourceRecordSet: RecordSet): RecordSet {
    return items.value(CollectionFactory.recordSet, {
        adapter: sourceRecordSet.getAdapter(),
        keyProperty: sourceRecordSet.getKeyProperty(),
        format: sourceRecordSet.getFormat(),
        model: sourceRecordSet.getModel(),
        metaData: sourceRecordSet.getMetaData(),
    });
}

/**
 * Получает неповторяющиеся элементы из двух коллекций
 * @param {RecordSet} items1
 * @param {RecordSet} items2
 * @param {string} keyProperty
 */
function getUniqItems(items1: RecordSet, items2: RecordSet, keyProperty: string): RecordSet {
    const resultItems = items1.clone();
    resultItems.prepend(items2);

    const uniqItems = factory(resultItems).filter((item, index) => {
        if (resultItems.getIndexByValue(keyProperty, item.get(keyProperty)) === index) {
            return true;
        }
    });
    return createRecordSet(uniqItems, items1);
}

/**
 * Добавляет новые элементы в начало коллекции
 * @param {RecordSet} oldItems
 * @param {RecordSet} newItems
 * @param {object} sourceController
 * @param {string} keyProperty
 * @param {TKey} folderId
 */
function prependNewItems(
    oldItems: RecordSet,
    newItems: RecordSet,
    sourceController: object,
    keyProperty: string,
    folderId: TKey
): RecordSet {
    const allCount = oldItems.getCount();
    let uniqItems = getUniqItems(oldItems, newItems, keyProperty);

    if (sourceController && sourceController.hasMoreData('down', folderId)) {
        uniqItems = factory(uniqItems).first(allCount);
        uniqItems = createRecordSet(uniqItems, oldItems);
    }
    return uniqItems;
}

/**
 * Получает элементы фильтров с историей
 * @param {RecordSet} oldItems
 * @param {RecordSet} newItems
 * @param {object} sourceController
 * @param {object} source
 * @param {string} keyProperty
 * @param {TKey} folderId
 */
function getItemsWithHistory(
    oldItems: RecordSet,
    newItems: RecordSet,
    sourceController: object,
    source: object,
    keyProperty: string,
    folderId?: TKey
) {
    let itemsWithHistory;
    const resultItems = prependNewItems(
        oldItems,
        newItems,
        sourceController,
        keyProperty,
        folderId
    );
    if (source['[Controls/_historyOld/Source]']) {
        itemsWithHistory = source.prepareItems(resultItems);
    } else {
        itemsWithHistory = resultItems;
    }
    return itemsWithHistory;
}

export { getItemsWithHistory, getUniqItems };
