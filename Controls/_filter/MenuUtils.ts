import { factory } from 'Types/chain';
import { factory as CollectionFactory } from 'Types/collection';
import { RecordSet } from 'Types/collection';
import { instanceOfModule } from 'Core/core-instance';

type TKey = boolean | string | number;

function createRecordSet(items: object, sourceRecordSet: RecordSet): RecordSet {
    return items.value(CollectionFactory.recordSet, {
        adapter: sourceRecordSet.getAdapter(),
        keyProperty: sourceRecordSet.getKeyProperty(),
        format: sourceRecordSet.getFormat(),
        model: sourceRecordSet.getModel(),
        metaData: sourceRecordSet.getMetaData(),
    });
}

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
    if (instanceOfModule(source, 'Controls/history:Source')) {
        itemsWithHistory = source.prepareItems(resultItems);
    } else {
        itemsWithHistory = resultItems;
    }
    return itemsWithHistory;
}

export { getItemsWithHistory, getUniqItems };
