/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
/**
 * Библиотека контролов, которые служат для отображения элемента коллекции или выбора элемента из выпадающего окна с возможностью сохранения истории выбора.
 * @library
 * @includes Constants Controls/_history/Constants
 * @includes Service Controls/_history/Service
 * @includes Source Controls/_history/Source
 * @public
 */

import Constants = require('Controls/_history/Constants');

export { default as Source } from './_history/Source';
export { default as Service } from './_history/Service';

export { Constants };
