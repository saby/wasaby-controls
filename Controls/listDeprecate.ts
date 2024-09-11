import Remover = require('Controls/_listDeprecate/WrappedRemover');
import Mover from 'Controls/_listDeprecate/WrappedMover';
import ItemActionsHelpers = require('Controls/_listDeprecate/Helpers');

/**
 * Устаревшие контролы списка.
 * @library
 * @public
 */
export { Remover, Mover, ItemActionsHelpers };
export { getItemsBySelection } from 'Controls/_listDeprecate/Utils/getItemsBySelection';
export {
    IMoveItemsParams,
    IMover,
    IRemover,
    BEFORE_ITEMS_MOVE_RESULT,
} from 'Controls/_listDeprecate/interface/IMoverAndRemover';
