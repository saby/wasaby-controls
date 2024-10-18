/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { TSelectorsProps } from 'Controls/columnScrollReact';

export interface IGridSelectors
    extends Pick<
        TSelectorsProps,
        | 'FIXED_ELEMENT'
        | 'FIXED_TO_RIGHT_EDGE_ELEMENT'
        | 'SCROLLABLE_ELEMENT'
        | 'NOT_DRAG_SCROLLABLE'
        | 'ROOT_TRANSFORMED_ELEMENT'
        | 'STRETCHED_TO_VIEWPORT_ELEMENT'
    > {
    // Помимо базовых селекторов фиксации справа и слева, вводим дополнительные селекторы для ячеек.
    // FIXED_CELL - для всех фиксированных ячеек(не элементов, элементов может быть больше, например, ItemActions).
    // FIXED_START_CELL и FIXED_END_CELL для фиксированных слева и справа соответственно.
    // Они нужны для стилизации ячеек(z-index) и трансформации в мобильной версии и на пререндере в десктопной.
    FIXED_CELL: 'js-controls-GridColumnScroll__cell_fixed';
    FIXED_START_CELL: 'js-controls-GridColumnScroll__cell_fixedStart';
    FIXED_END_CELL: 'js-controls-GridColumnScroll__cell_fixedEnd';
    // Аналогично для скроллируемых ячеек
    SCROLLABLE_CELL: 'js-controls-GridColumnScroll__cell_scrollable';
}

// Набор базовых селекторов, которые передаются в контекст скролла.
// Также, здесь можно указать кастомные селекторы, которые будут доступны в
// контексте горизонтально скроллируемой таблицы.
export const SELECTORS: IGridSelectors = {
    FIXED_ELEMENT: 'js-controls-GridColumnScroll_fixed',
    FIXED_CELL: 'js-controls-GridColumnScroll__cell_fixed',
    FIXED_START_CELL: 'js-controls-GridColumnScroll__cell_fixedStart',
    FIXED_END_CELL: 'js-controls-GridColumnScroll__cell_fixedEnd',

    SCROLLABLE_CELL: 'js-controls-GridColumnScroll__cell_scrollable',

    SCROLLABLE_ELEMENT: 'js-controls-GridColumnScroll_scrollable',
    NOT_DRAG_SCROLLABLE: 'js-controls-GridColumnScroll_notDragScrollable',
    ROOT_TRANSFORMED_ELEMENT: 'js-controls-GridColumnScroll_rootTransformedElement',
};

export const HEADER_CELL = 'controls-GridReact__header-cell';
export const RESULTS_CELL = 'controls-GridReact__results-cell';
export const ITEM = 'controls-GridReact__row';
export const NAVIGATION_CELL = 'controls-GridReact__navigation-cell';

export const FIXED_START_VIEW_WRAPPER_CLASS_NAME =
    'controls-GridReact__view_columnScroll_fixedStart';
export const FIXED_END_VIEW_WRAPPER_CLASS_NAME = 'controls-GridReact__view_columnScroll_fixedEnd';
export const SCROLLABLE_VIEW_WRAPPER_CLASS_NAME =
    'controls-GridReact__view_columnScroll_scrollable';

export const MOBILE_MIRROR_JS_SELECTOR = 'js-controls-GridColumnScroll_mirror';
