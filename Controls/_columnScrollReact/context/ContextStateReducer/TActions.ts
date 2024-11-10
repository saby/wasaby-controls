import { TSetIsMobileScrollingAction } from './actions/setIsMobileScrolling';
import { TSetIsScrollbarDraggingAction } from './actions/setIsScrollbarDragging';
import { TSetPositionAction } from './actions/setPosition';
import { TScrollIntoViewAction } from './actions/scrollIntoView';
import { TUpdateSizesAction } from './actions/updateSizes';
import { TSetAutoScrollAnimationAction } from './actions/setAutoScrollAnimation';
import { TInternalUpdateSizesAction } from './actions/internalUpdateSizes';
import { TSetAutoScrollModeAction } from './actions/setAutoScrollMode';

/**
 * Экшены менеджера управления состояниями контекста скролла.
 * @private
 */
export type TActions =
    | TSetIsMobileScrollingAction
    | TSetAutoScrollAnimationAction
    | TSetIsScrollbarDraggingAction
    | TScrollIntoViewAction
    | TSetPositionAction
    | TUpdateSizesAction
    | TSetAutoScrollModeAction
    | TInternalUpdateSizesAction;
