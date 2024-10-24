/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
/**
 * Библиотека контролов, которые служат для отображения элемента коллекции или выбора элемента из выпадающего окна с возможностью сохранения истории выбора.
 * @library
 * @includes Constants Controls/_historyOld/Constants
 * @includes Service Controls/_historyOld/Service
 * @includes Source Controls/_historyOld/Source
 * @public
 * @deprecated С весрии 24.5100 работа с историей выбора происходит через публичное API класса {@link Controls/HistoryStore:Store Controls/HistoryStore:Store}
 * Подробнее о работе с историей выбора в {@link /doc/platform/developmentapl/interface-development/controls/history-service/#api статье}
 */

import Constants = require('./_historyOld/Constants');

export { default as Source } from './_historyOld/Source';
export { default as Service } from './_historyOld/Service';

export { Constants };
