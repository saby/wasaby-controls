import { ISelectorsProps } from 'Controls/columnScrollReact';

export interface IGridSelectors
    extends Pick<
        ISelectorsProps,
        | 'FIXED_ELEMENT'
        | 'SCROLLABLE_ELEMENT'
        | 'NOT_DRAG_SCROLLABLE'
        | 'ROOT_TRANSFORMED_ELEMENT'
        | 'FIXED_TO_RIGHT_EDGE_ELEMENT'
    > {
    FIXED_CELL: 'js-controls-GridColumnScroll__cell_fixed';
    SCROLLABLE_CELL: 'js-controls-GridColumnScroll__cell_scrollable';
}

// Набор базовых селекторов, которые передаются в контекст скролла.
// Также, здесь можно указать кастомные селекторы, которые будут доступны в
// контексте горизонтально скроллируемой таблицы.
export const SELECTORS: IGridSelectors = {
    FIXED_ELEMENT: 'js-controls-GridColumnScroll_fixed',
    SCROLLABLE_ELEMENT: 'js-controls-GridColumnScroll_scrollable',
    NOT_DRAG_SCROLLABLE: 'js-controls-GridColumnScroll_notDragScrollable',
    ROOT_TRANSFORMED_ELEMENT: 'js-controls-GridColumnScroll_rootTransformedElement',
    FIXED_CELL: 'js-controls-GridColumnScroll__cell_fixed',
    SCROLLABLE_CELL: 'js-controls-GridColumnScroll__cell_scrollable',
};

export const HEADER_CELL = 'controls-GridReact__header-cell';
export const RESULTS_CELL = 'controls-GridReact__results-cell';
export const ITEM = 'controls-GridReact__row';
export const NAVIGATION_CELL = 'controls-GridReact__navigation-cell';

export const FIXED_VIEW_WRAPPER_CLASS_NAME = 'controls-GridReact__view_columnScroll_fixed';
export const SCROLLABLE_VIEW_WRAPPER_CLASS_NAME =
    'controls-GridReact__view_columnScroll_scrollable';

export const MOBILE_MIRROR_JS_SELECTOR = 'js-controls-GridColumnScroll_mirror';
