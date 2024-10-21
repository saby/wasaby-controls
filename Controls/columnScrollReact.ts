/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
export {
    ColumnScrollContext,
    IColumnScrollContext,
} from './_columnScrollReact/context/ColumnScrollContext';
export {
    default as ColumnScrollContextProvider,
    IColumnScrollContextProviderProps,
} from './_columnScrollReact/context/ColumnScrollContextProvider';

export {
    DragScrollContext,
    IDragScrollContext,
} from './_columnScrollReact/DragScroll/DragScrollContext';
export {
    default as DragScrollContextProvider,
    IDragScrollContextProviderProps,
} from './_columnScrollReact/DragScroll/DragScrollContextProvider';

export { default as DragScrollOverlayComponent } from './_columnScrollReact/DragScroll/OverlayComponent';
export { default as ApplyCssTransformComponent } from './_columnScrollReact/ApplyCssTransformComponent';
export {
    default as NavigationComponent,
    INavigationComponentProps,
} from './_columnScrollReact/NavigationComponent';
export { default as MirrorComponent } from './_columnScrollReact/Mirror/MirrorComponent';
export { default as ShadowsComponent } from './_columnScrollReact/ShadowsComponent';
export { default as ViewportObserverComponent } from './_columnScrollReact/SizeObservers/ViewportObserver';
export { default as ContentObserverComponent } from './_columnScrollReact/SizeObservers/ContentObserver';
export { default as AutoScrollTargetElement } from './_columnScrollReact/AutoScroll/TargetElement';

export {
    TSelectorsProps,
    ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME,
} from './_columnScrollReact/common/selectors';
export { QA_SELECTORS } from './_columnScrollReact/common/data-qa';
export {
    EdgeState,
    TColumnScrollStartPosition,
    TScrollIntoViewAlign,
} from './_columnScrollReact/common/types';

// require(['Controls/columnScrollReact'], (columnScroll) => { columnScroll._setDebug(true) });
import { DebugLogger } from './_columnScrollReact/common/DebugLogger';

const _setDebug = DebugLogger.setDebug;
export { DebugLogger, _setDebug };

import {
    getTransformCSSRule,
    getTransformCSSRuleReact,
    getScrollableViewPortWidth,
    getPrevPagePosition,
    getNextPagePosition,
    getMaxScrollPosition,
    WheelHelper,
} from './_columnScrollReact/common/helpers';

export const ColumnScrollUtils = {
    getTransformCSSRule,
    getTransformCSSRuleReact,
    getScrollableViewPortWidth,
    getPrevPagePosition,
    getNextPagePosition,
    getMaxScrollPosition,
    WheelHelper,
};
