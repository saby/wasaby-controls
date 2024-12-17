import { getChangedHistoryItems } from './FilterItemsStorage';
import { Store } from 'Controls/HistoryStore';

const DEFAULT_HISTORY_ITEMS_COUNT = 3;
const MAX_HISTORY_ITEMS_COUNT = 6;
const DEFAULT_DEMO_HISTORY_ID = 'DEMO_HISTORY_ID';

const COUNT_HISTORY_ID4_ITEMS = 4;
const COUNT_HISTORY_ID5_ITEMS = 5;
const COUNT_HISTORY_ID2_ITEMS = 3;

const recentData = [
    getChangedHistoryItems(COUNT_HISTORY_ID2_ITEMS),
    getChangedHistoryItems(),
    getChangedHistoryItems(2),
    getChangedHistoryItems(COUNT_HISTORY_ID4_ITEMS),
    getChangedHistoryItems(COUNT_HISTORY_ID5_ITEMS),
    getChangedHistoryItems(1),
];

recentData
    .slice(0, DEFAULT_HISTORY_ITEMS_COUNT)
    .reverse()
    .forEach((data) => {
        Store.push(DEFAULT_DEMO_HISTORY_ID, data);
    });

recentData
    .slice(0, MAX_HISTORY_ITEMS_COUNT)
    .reverse()
    .forEach((data) => {
        Store.push('DEMO_HISTORY_ID2', data);
    });
