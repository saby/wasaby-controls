/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
/**
 * Библиотека контролов, которые позволяют организовать скроллирование областей. Содержит контейнер для скроллирования и механизм фиксации заголовков.
 * @library
 * @includes Container Controls/_scroll/Container
 * @public
 */

/*
 * Search library
 * @library
 * @public
 * @author Пьянков С.А.
 */

import Container from 'Controls/_scroll/Container';
export {
    scrollToElement,
    getScrollPosition,
    horizontalScrollToElement,
    getScrollContainerByElement,
    getScrollableParents,
} from 'Controls/_scroll/Utils/scrollToElement';
export { SCROLL_DIRECTION, SCROLL_POSITION } from 'Controls/_scroll/Utils/Scroll';
export { hasHorizontalScroll } from './_scroll/Utils/hasHorizontalScroll';
export { IScrollState } from './_scroll/Utils/ScrollState';
export { getScrollContentElement } from './_scroll/Utils/getScrollElement';
export { IShadows, SHADOW_MODE } from './_scroll/Container/Interface/IShadows';
export { TScrollMode } from 'Controls/_scroll/Container/Interface/IScrollMode';
export { SCROLL_MODE } from 'Controls/_scroll/Container/Type';
import ScrollContextProvider from 'Controls/_scroll/Contexts/ScrollContextProvider';
import IntersectionObserverController from 'Controls/_scroll/IntersectionObserver/Controller';
import IntersectionObserverContainer from 'Controls/_scroll/IntersectionObserver/Container';
import EdgeIntersectionObserver from 'Controls/_scroll/IntersectionObserver/EdgeIntersectionObserver';
import EdgeIntersectionObserverContainer from 'Controls/_scroll/IntersectionObserver/EdgeIntersectionContainer';
import IntersectionObserverSyntheticEntry from 'Controls/_scroll/IntersectionObserver/SyntheticEntry';
import _ContainerBase, { IInitialScrollPosition } from 'Controls/_scroll/ContainerBase';
import VirtualScrollContainer from 'Controls/_scroll/VirtualScrollContainer';
import { SHADOW_VISIBILITY } from 'Controls/_scroll/Container/Interface/IShadows';
import { IContainerOptions } from 'Controls/_scroll/Container';
import HotKeysContainer from 'Controls/_scroll/HotKeysContainer';
import { default as _ListScrollContextConsumer } from 'Controls/_scroll/Contexts/ListScrollContextConsumer';
import { IListScrollContextOptions as _IListScrollContextOptions } from 'Controls/_scroll/Contexts/ListScrollContextProvider';
import { ListScrollContext as _ListScrollContext } from 'Controls/_scroll/Contexts/ListScrollContext';

export {
    Container,
    ScrollContextProvider,
    _ListScrollContextConsumer,
    _ListScrollContext,
    _IListScrollContextOptions,
    HotKeysContainer,
    IntersectionObserverController,
    IntersectionObserverContainer,
    EdgeIntersectionObserver,
    EdgeIntersectionObserverContainer,
    IntersectionObserverSyntheticEntry,
    VirtualScrollContainer,
    _ContainerBase,
    SHADOW_VISIBILITY,
    IInitialScrollPosition,
    IContainerOptions,
};
