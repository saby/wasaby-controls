/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import {
    Service as HistoryService,
    FilterSource as HistorySource,
    Constants,
} from 'Controls/history';
import { factory } from 'Types/chain';
import * as CoreClone from 'Core/core-clone';
import { factory as CollectionFactory } from 'Types/collection';
import entity = require('Types/entity');
import { RecordSet } from 'Types/collection';
import sourceLib = require('Types/source');
import Di = require('Types/di');
import coreInstance = require('Core/core-instance');
import { IFilterItem, TKey } from 'Controls/_filter/View/interface/IFilterItem';
import { getStore } from 'Application/Env';
import { Source } from 'Controls/history';
import { isEqual } from 'Types/object';

const HISTORY_SOURCE_STORAGE_ID = 'CONTROLS_HISTORY_SOURCE_STORE';

function createHistorySource(cfg: object) {
    const historySourceData = {
        historyId: cfg.historyId,
        pinned: true,

        /* A record about resets filters is stored in the history, but it is not necessary to display it in the
         history list.We request one more record, so that the number of records remains equal to 10 */
        recent: (Constants[cfg.recent] || Constants.MAX_HISTORY) + 1,
        favorite: cfg.favorite,
        dataLoaded: true,
        historyIds: cfg.historyIds,
    };
    return new HistorySource({
        originSource: new sourceLib.Memory({
            keyProperty: 'id',
            data: [],
        }),
        historySource: Di.isRegistered('demoSourceHistory')
            ? Di.resolve('demoSourceHistory', historySourceData)
            : new HistoryService(historySourceData),
    });
}

function getParamHistoryIds(filterSource: IFilterItem[]): string[] {
    const historyIds = [];
    if (filterSource) {
        filterSource.forEach((filterItem) => {
            if (filterItem.historyId) {
                historyIds.push(filterItem.historyId);
            }
        });
    }
    return historyIds;
}

function getHistorySource(cfg: object) {
    const store = getStore(HISTORY_SOURCE_STORAGE_ID);
    let source = store.get(cfg.historyId) as typeof HistorySource;
    const historyIds = cfg.historyIds || [];
    const sourceHistoryIds = source?.getHistoryIds() || [];
    if (
        !source ||
        (!cfg.favorite &&
            cfg.historyIds &&
            !isEqual(historyIds, sourceHistoryIds))
    ) {
        source = createHistorySource(cfg);
        store.set(cfg.historyId, source);
    }
    return source;
}

function loadHistoryItems(historyConfig: object) {
    const source = getHistorySource(historyConfig);
    const query = new sourceLib.Query().where({
        $_history: true,
    });
    return source.query(query).then((dataSet) => {
        return new RecordSet({
            rawData: dataSet.getAll().getRawData(),
            adapter: new entity.adapter.Sbis(),
        });
    });
}

function isHistorySource(source: unknown): source is Source {
    return coreInstance.instanceOfModule(source, 'Controls/history:Source');
}

function deleteHistorySourceFromConfig(
    initConfig: object,
    sourceField: string
) {
    const configs = CoreClone(initConfig);
    factory(configs).each((config) => {
        if (isHistorySource(config[sourceField])) {
            delete config[sourceField];
        }
    });
    return configs;
}

function createRecordSet(items: object, sourceRecordSet: RecordSet) {
    return items.value(CollectionFactory.recordSet, {
        adapter: sourceRecordSet.getAdapter(),
        keyProperty: sourceRecordSet.getKeyProperty(),
        format: sourceRecordSet.getFormat(),
        model: sourceRecordSet.getModel(),
        metaData: sourceRecordSet.getMetaData(),
    });
}

function getUniqItems(items1: RecordSet, items2: RecordSet, keyProperty: TKey) {
    const resultItems = items1.clone();
    resultItems.prepend(items2);

    const uniqItems = factory(resultItems).filter((item, index) => {
        if (
            resultItems.getIndexByValue(keyProperty, item.get(keyProperty)) ===
            index
        ) {
            return item;
        }
    });
    return createRecordSet(uniqItems, items1);
}

function prependNewItems(
    oldItems: RecordSet,
    newItems: RecordSet,
    sourceController: object,
    keyProperty: TKey,
    folderId: TKey
) {
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
    keyProperty: TKey,
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
    if (isHistorySource(source)) {
        itemsWithHistory = source.prepareItems(resultItems);
    } else {
        itemsWithHistory = resultItems;
    }
    return itemsWithHistory;
}

export {
    loadHistoryItems,
    getHistorySource,
    getParamHistoryIds,
    isHistorySource,
    getItemsWithHistory,
    getUniqItems,
    deleteHistorySourceFromConfig,
};
