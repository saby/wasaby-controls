/**
 * Библиотека, содержащая систему отладки списочного слайса.
 * Вам НЕ нужна эта библиотека, вам нужен этот {@link https://n.sbis.ru/shared/disk/fbbc7ac3-a24a-4a3c-ba94-5c6bf00c97fd документ}.
 *
 * Подробнее о интеракторах написано в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 * @library
 * @public
 * @module
 * @kaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */

export { Debugger } from './newLists/_listDebug/Debugger';
import DebuggersStorage from './newLists/_listDebug/DebuggersStorage';

export { initLabel, deleteLabel, getLabel } from './newLists/_listDebug/Label';

/**
 * Получить хранилище всех активных отладчиков.
 */
export const getDebuggersStorage = () => {
    return DebuggersStorage.getInstance();
};

/**
 * Получить все активные отладчики в виде карты.
 */
export const getDebuggers = () => {
    return getDebuggersStorage().getAll();
};

/**
 * Вывести все новые логи, добавленные в очередь.
 * Используется я отладки внутри точки останова, когда JS поток на странице
 * остановлен и требуется узнать что произшло до момента остановки.
 */
export const renderNew = (id?: string) => {
    getDebuggersStorage().renderNew(id);
};
