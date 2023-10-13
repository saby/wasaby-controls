import { EdgeState, TAutoScrollMode } from '../../common/types';
import { IColumnScrollContext } from '../ColumnScrollContext';

/**
 * Состояние ContextStateReducer
 */
export type TState = Pick<
    IColumnScrollContext,
    | 'SELECTORS'
    | 'isMobileScrolling'
    | 'position'
    | 'viewPortWidth'
    | 'contentWidth'
    | 'startFixedWidth'
    | 'endFixedWidth'
    | 'isMobile'
    | 'isScrollbarDragging'
    | 'mobileSmoothedScrollPosition'
    | 'leftEdgeState'
    | 'rightEdgeState'
    | 'isNeedByWidth'
> & {
    autoScrollMode: TAutoScrollMode;
    previousAppliedPosition: number;
    leftTriggerEdgeState: EdgeState;
    rightTriggerEdgeState: EdgeState;
    columnScrollStartPosition: number | 'end';
};
