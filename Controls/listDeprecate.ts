import Remover = require('Controls/_listDeprecate/Remover');
import Mover from 'Controls/_listDeprecate/WrappedMover';
import ItemActionsHelpers = require('Controls/_listDeprecate/Helpers');

/**
 * Устаревшие контролы списка.
 * @library
 * @public
 */
export { Remover, Mover, ItemActionsHelpers };
export {
    IMoveItemsParams,
    IMover,
    IRemover,
    BEFORE_ITEMS_MOVE_RESULT,
} from 'Controls/_listDeprecate/interface/IMoverAndRemover';
