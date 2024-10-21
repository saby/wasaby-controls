/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import {
    FIXED_START_VIEW_WRAPPER_CLASS_NAME,
    FIXED_END_VIEW_WRAPPER_CLASS_NAME,
    NAVIGATION_CELL,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
} from 'Controls/_gridColumnScroll/Selectors';
import { QA_SELECTORS } from 'Controls/_gridColumnScroll/common/data-qa';

export function ShadowsStyleRender(): JSX.Element {
    // Отключаем все тени и включаем те что нам нужны, другого способа нет.
    return (
        // TODO: Свести класс фиксации, сделать один.
        <style data-qa={QA_SELECTORS.SHADOWS_STYLE}>
            {`.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .controls-StickyHeader__shadow-bottom,` +
                `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .controls-StickyHeader__shadow-bottom ` +
                '{ visibility: hidden !important; }' +
                `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL} .controls-StickyHeader__shadow-bottom, ` +
                `.${FIXED_END_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL} .controls-StickyHeader__shadow-bottom, ` +
                `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}.js-controls-GridColumnScroll__cell_scrollable .controls-StickyHeader__shadow-bottom ` +
                '{ visibility: visible !important; }'}
        </style>
    );
}

const ShadowsStyleRenderMemo = React.memo(ShadowsStyleRender);
export default ShadowsStyleRenderMemo;
