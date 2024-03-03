/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Deferred } from 'Types/deferred';
const COUNT_HISTORY_ITEMS = 12;
let HistoryService;

function createHistoryService(historyServiceLoad, config) {
    config.recent = config.recent || COUNT_HISTORY_ITEMS;

    return historyServiceLoad.callback(new HistoryService(config));
}

export default function (config) {
    const historyServiceLoad = new Deferred();

    if (HistoryService) {
        createHistoryService(historyServiceLoad, config);
    } else {
        require(['Controls/history'], (history) => {
            HistoryService = history.Service;
            createHistoryService(historyServiceLoad, config);
        });
    }

    return historyServiceLoad;
}
