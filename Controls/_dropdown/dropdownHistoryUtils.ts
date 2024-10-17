/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import coreInstance = require('Core/core-instance');
import Merge = require('Core/core-merge');
import { Deferred } from 'Types/deferred';
import { Source } from 'Controls/history';
import { ICrud } from 'Types/source';

let HistorySource;
let HistoryService;

/**
 * Модуль с утилитами для работы с историей в выпадающих списках
 * @public
 */

/**
 * Получает метаданные истории
 */
function getMetaHistory() {
    return {
        $_history: true,
    };
}

/**
 * Возвращает true, если источник данных Controls/history:Source
 * @param {ICrud} source
 */
function isHistorySource(source: ICrud): source is Source {
    return coreInstance.instanceOfModule(source, 'Controls/history:Source');
}

/**
 * Создает источник данных Controls/history:Source
 * @param {ICrud} source
 * @param {object} options
 */
function createHistorySource(source: ICrud, options: object) {
    return new HistorySource({
        originSource: source,
        historySource: new HistoryService({
            historyId: options.historyId,
        }),
        parentProperty: options.parentProperty,
    });
}

/**
 * Загружает источник данных
 * @param {ICrud} source
 * @param {object} options
 */
function getSource(source: ICrud, options: object) {
    const historyLoad = new Deferred();
    const historyId = options.historyId;

    if (!historyId || isHistorySource(source)) {
        historyLoad.callback(source);
    } else if (HistorySource && HistoryService) {
        historyLoad.callback(createHistorySource(source, options));
    } else {
        require(['Controls/history'], (history) => {
            HistorySource = history.Source;
            HistoryService = history.Service;
            historyLoad.callback(createHistorySource(source, options));
        });
    }

    return historyLoad;
}

/**
 * Получает конфигурацию фильтров из мета данных
 * @param {object} filter
 * @param {ICrud} source
 */
function getFilter(filter: object, source: ICrud) {
    // TODO: Избавиться от проверки, когда будет готово решение задачи
    //  https://online.sbis.ru/opendoc.html?guid=e6a1ab89-4b83-41b1-aa5e-87a92e6ff5e7
    if (isHistorySource(source)) {
        return Merge(getMetaHistory(), filter || {});
    }
    return filter;
}

export = {
    getSourceFilter: getFilter,
    isHistorySource,
    getSource,
    getMetaHistory,
};
