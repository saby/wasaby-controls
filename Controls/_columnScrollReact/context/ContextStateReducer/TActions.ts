import { TSetIsMobileScrollingAction } from './actions/setIsMobileScrolling';
import { TSetIsScrollbarDraggingAction } from './actions/setIsScrollbarDragging';
import { TSetPositionAction } from './actions/setPosition';
import { TScrollIntoViewAction } from './actions/scrollIntoView';
import { TUpdateSizesAction } from './actions/updateSizes';
import { TSetAutoScrollModeAction } from './actions/setAutoScrollMode';
import { TInternalUpdateSizesAction } from './actions/internalUpdateSizes';

/**
 * Экшены менеджера управления состояниями контекста скролла.
 * @private
 */
export type TActions =
    | TSetIsMobileScrollingAction
    | TSetAutoScrollModeAction
    | TSetIsScrollbarDraggingAction
    | TScrollIntoViewAction
    | TSetPositionAction
    | TUpdateSizesAction
    | TInternalUpdateSizesAction;
