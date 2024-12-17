/**
 * Библиотека компонента скроллбар.
 * @library
 * @includes Scrollbar Controls/_scrollbar/Scrollbar
 * @includes IScrollbars Controls/scrollbar:IScrollbars
 * @public
 */

import { default as Scrollbar, ScrollbarComponent } from 'Controls/_scrollbar/ScrollbarReact';
import IScrollbars from 'Controls/_scrollbar/interfaces/IScrollbars';

export {
    getScrollbarWidth,
    getScrollbarWidthByMeasuredBlock,
} from './_scrollbar/Utils/getScrollbarWidth';
export { Scrollbar, ScrollbarComponent, IScrollbars };
