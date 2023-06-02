import { ISelectorsProps } from 'Controls/columnScrollReact';

// Набор базовых селекторов, которые передаются в контекст скролла.
export const SELECTORS: ISelectorsProps = {
    FIXED_ELEMENT: 'js-controls-GridColumnScroll_fixed',
    SCROLLABLE_ELEMENT: 'js-controls-GridColumnScroll_scrollable',
    NOT_DRAG_SCROLLABLE: 'js-controls-GridColumnScroll_notDragScrollable',
    ROOT_TRANSFORMED_ELEMENT: 'js-controls-GridColumnScroll_rootTransformedElement',
};

export const FIXED_VIEW_WRAPPER_CLASS_NAME = 'controls-GridReact__view_columnScroll_fixed';
export const SCROLLABLE_VIEW_WRAPPER_CLASS_NAME =
    'controls-GridReact__view_columnScroll_scrollable';

export const MOBILE_MIRROR_JS_SELECTOR = 'js-controls-GridColumnScroll_mirror';
