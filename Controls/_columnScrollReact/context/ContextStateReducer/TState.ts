import { IColumnScrollContext } from '../ColumnScrollContext';
import { TUpdateSizesState } from './actions/updateSizes';
import { TInternalUpdateSizesState } from './actions/internalUpdateSizes';
import { TSetAutoScrollModeState } from './actions/setAutoScrollMode';
import { TSetIsScrollbarDraggingState } from './actions/setIsScrollbarDragging';
import { TSetIsMobileScrollingState } from './actions/setIsMobileScrolling';

/**
 * Состояние ContextStateReducer
 */
export type TState = Pick<
    IColumnScrollContext,
    | 'SELECTORS'
    | 'viewPortWidth'
    | 'contentWidth'
    | 'startFixedWidth'
    | 'endFixedWidth'
    | 'isMobile'
    | 'mobileSmoothedScrollPosition'
> &
    TInternalUpdateSizesState &
    TUpdateSizesState &
    TSetAutoScrollModeState &
    TSetIsScrollbarDraggingState &
    TSetIsMobileScrollingState;
