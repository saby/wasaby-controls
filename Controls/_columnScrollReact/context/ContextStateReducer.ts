/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TState } from './ContextStateReducer/TState';
import { TActions } from './ContextStateReducer/TActions';
import { setIsMobileScrolling } from './ContextStateReducer/actions/setIsMobileScrolling';
import { setIsScrollbarDragging } from './ContextStateReducer/actions/setIsScrollbarDragging';
import { setPosition } from './ContextStateReducer/actions/setPosition';
import { scrollIntoView } from './ContextStateReducer/actions/scrollIntoView';
import { updateSizes } from './ContextStateReducer/actions/updateSizes';
import { internalUpdateSizes } from './ContextStateReducer/actions/internalUpdateSizes';
import { setAutoScrollMode } from './ContextStateReducer/actions/setAutoScrollMode';

/**
 * Основной менеджер состояний контекста скролла.
 * @private
 */
function contextReducer(state: TState, action: TActions): TState {
    switch (action.type) {
        case 'setAutoScrollMode': {
            return setAutoScrollMode(state, action);
        }
        case 'setIsMobileScrolling': {
            return setIsMobileScrolling(state, action);
        }
        case 'setIsScrollbarDragging': {
            return setIsScrollbarDragging(state, action);
        }
        case 'setPosition': {
            return setPosition(state, action);
        }
        case 'scrollIntoView': {
            return scrollIntoView(state, action);
        }
        case 'internalUpdateSizes': {
            return internalUpdateSizes(state, action);
        }
        case 'updateSizes': {
            return updateSizes(state, action);
        }
    }
}

export default contextReducer;
