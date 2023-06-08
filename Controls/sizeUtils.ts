/**
 * Библиотека методов, которые позволяют получать размеры текста.
 * @library
 * @includes getDimensions Controls/_utils/sizeUtils/getDimensions
 * @includes DOMUtil Controls/_utils/sizeUtils/DOMUtil
 * @includes getTextWidth Controls/_utils/sizeUtils/getTextWidth
 * @includes getWidth Controls/_utils/sizeUtils/getWidth
 * @public
 */

import * as DOMUtil from './_utils/sizeUtils/DOMUtil';
export {
    default as getDimensions,
    getOffsetTop,
} from './_utils/sizeUtils/getDimensions';
export { getTextWidth } from './_utils/sizeUtils/getTextWidth';
export { getWidth } from './_utils/sizeUtils/getWidth';
export {
    default as ResizeObserverUtil,
    RESIZE_OBSERVER_BOX,
} from './_utils/sizeUtils/ResizeObserverUtil';
export { default as DimensionsMeasurer } from './_utils/sizeUtils/DimensionsMeasurer';
export { default as IntersectionObserver } from './_utils/sizeUtils/IntersectionObserver';
export { DOMUtil };
