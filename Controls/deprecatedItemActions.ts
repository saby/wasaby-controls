/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
/**
 * Deprecated-библиотека, которая предоставляет операции с записью коллекции на wasaby.
 * @library
 * @public
 */

import 'Controls/itemActions';

// места использования: https://s.tensor.ru/result/search_rc-23.3100_228906_1682582405
// eslint-disable deprecated-anywhere
import * as ItemActionsForTemplateWasaby from 'wml!Controls/_deprecatedItemActions/ItemActionsFor';
import * as ItemActionsTemplateWasaby from 'wml!Controls/_deprecatedItemActions/ItemActionsTemplate';
import * as SwipeActionTemplateWasaby from 'wml!Controls/_deprecatedItemActions/SwipeAction';
import * as SwipeActionsTemplateWasaby from 'wml!Controls/_deprecatedItemActions/SwipeTemplate';

export {
    ItemActionsForTemplateWasaby,
    ItemActionsTemplateWasaby,
    SwipeActionTemplateWasaby,
    SwipeActionsTemplateWasaby,
};
