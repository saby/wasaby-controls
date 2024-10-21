/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import Merge = require('Core/core-merge');
import { ICrud } from 'Types/source';

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
 * Возвращает true, если источник данных Controls/historyOld:Source
 * @param {ICrud} source
 */
function isHistorySource(source: ICrud): boolean {
    return source ? !!source['[Controls/_historyOld/Source]']: false;
}

/**
 * Загружает источник данных
 * @param {ICrud} source
 * @param {object} options
 */
function getSource(source: ICrud, options: object): Promise<ICrud> {
    const historyId = options.historyId;

    if (!historyId || isHistorySource(source)) {
        return Promise.resolve(source);
    }
    return Promise.resolve(source);
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
