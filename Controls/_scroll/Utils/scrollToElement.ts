/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import cInstance = require('Core/core-instance');
import { DimensionsMeasurer, getDimensions } from 'Controls/sizeUtils';
import { isStickyHidden as isHidden, StickyPosition, TypeFixedBlocks } from 'Controls/stickyBlock';
import { goUpByControlTree } from 'UI/NodeCollector';
import { IControl } from 'UICommon/interfaces';
import Container from '../Container';
import { SCROLL_DIRECTION } from 'Controls/_scroll/Utils/Scroll';

const SCROLL_CONTAINERS_SELECTOR = '.controls-Scroll, .controls-Scroll-Container';

enum SCROLL_POSITION {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
    center = 'center',
}

export type TScrollPosition = 'top' | 'bottom' | 'center';

interface IOffset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

type TPropertiesNames<T extends SCROLL_DIRECTION> = T extends SCROLL_DIRECTION.VERTICAL
    ? {
          stickyElementSize: 'offsetHeight';
          headerDimensions: ['top', 'topWithOffset', 'bottom'];
          stickyElementOffsetToEndEdge: 'topWithOffset';
          startPosition: 'top';
          endPosition: 'bottom';
          scroll: 'scrollTop';
      }
    : {
          stickyElementSize: 'offsetWidth';
          headerDimensions: ['left', 'leftWithOffset', 'right'];
          stickyElementOffsetToEndEdge: 'leftWithOffset';
          startPosition: 'left';
          endPosition: 'right';
          scroll: 'scrollLeft';
      };

function getPropertiesNames<T extends SCROLL_DIRECTION>(scrollDirection: T): TPropertiesNames<T> {
    return (
        scrollDirection === SCROLL_DIRECTION.VERTICAL
            ? {
                  stickyElementSize: 'offsetHeight',
                  headerDimensions: ['top', 'topWithOffset', 'bottom'],
                  stickyElementOffsetToEndEdge: 'topWithOffset',
                  startPosition: 'top',
                  endPosition: 'bottom',
                  scroll: 'scrollTop',
              }
            : {
                  stickyElementSize: 'offsetWidth',
                  headerDimensions: ['left', 'leftWithOffset', 'right'],
                  stickyElementOffsetToEndEdge: 'leftWithOffset',
                  startPosition: 'left',
                  endPosition: 'right',
                  scroll: 'scrollLeft',
              }
    ) as TPropertiesNames<T>;
}

function getScrollableParents(
    element: HTMLElement,
    inStickyHeaderElement: boolean,
    scrollDirection: SCROLL_DIRECTION,
    onlyFirstScrollableParent: boolean
): HTMLElement[] {
    const scrollableParents: HTMLElement[] = [];
    let currentElement = element.parentElement;

    const canBeScrolled = (el) => {
        return scrollDirection === SCROLL_DIRECTION.VERTICAL
            ? el.scrollHeight > el.clientHeight
            : el.scrollWidth > el.clientWidth;
    };
    const overflow = scrollDirection === SCROLL_DIRECTION.HORIZONTAL ? 'overflowX' : 'overflowY';

    while (currentElement) {
        const currentStyle = window.getComputedStyle(currentElement);

        if (
            (currentStyle[overflow] === 'auto' ||
                currentStyle[overflow] === 'scroll' ||
                // TODO fix for Container/Scroll, which has "overflow: hidden" in content block while mounting
                currentElement.className.indexOf('controls-Scroll__content_hidden') >= 0) &&
            // Элемент может находиться в полупустом скролл контейнере, который находится в стики блоке.
            (canBeScrolled(currentElement) || inStickyHeaderElement || onlyFirstScrollableParent)
        ) {
            scrollableParents.push(currentElement);
            if (onlyFirstScrollableParent) {
                return scrollableParents;
            }
        }

        currentElement = currentElement.parentElement;
    }

    return scrollableParents;
}

/**
 * Если элемент является стикиблоком ИЛИ элемент display: contents, но его прямые дочерние элементы стикиблоки,
 * то считаем, что он - стикиблок.
 * @returns HTMLElement | undefined
 */
function isStickyElement(element: HTMLElement): HTMLElement {
    const stickyHeaderClass = 'controls-StickyBlock';
    let stickyElement;

    if (element.classList.contains(stickyHeaderClass)) {
        stickyElement = element;
    } else {
        const elementStyle = window.getComputedStyle(element);
        if (
            elementStyle.display === 'contents' &&
            element.children[0].classList.contains(stickyHeaderClass)
        ) {
            stickyElement = element.children[0];
        }
    }
    return stickyElement;
}

function getStickyElementOffset(stickyElement: HTMLElement): IOffset {
    const oldTop = stickyElement.style.top;
    const oldLeft = stickyElement.style.left;
    stickyElement.style.position = 'relative';
    stickyElement.style.top = '0px';
    stickyElement.style.left = '0px';

    // eslint-disable-next-line prefer-const
    let { top, height, left, width } = getDimensions(stickyElement);
    // В IE, в отличие от Chrome, getBoundingClientRect возвращает нецелочисленные значения top
    top = Math.round(top);
    left = Math.round(left);

    const windowDimensions = DimensionsMeasurer.getWindowDimensions(stickyElement);

    stickyElement.style.position = 'sticky';
    stickyElement.style.top = oldTop;
    stickyElement.style.left = oldLeft;

    return {
        top: top + windowDimensions.pageYOffset,
        bottom: top + height + windowDimensions.pageYOffset,
        left: left + windowDimensions.pageXOffset,
        right: left + width + windowDimensions.pageXOffset,
    };
}

function getOffset(element: HTMLElement): IOffset {
    if (element === document.body || element === document.documentElement) {
        const elementDimensions = DimensionsMeasurer.getElementDimensions(element);
        const bodyDimensions = DimensionsMeasurer.getElementDimensions(document.body);
        return {
            top: bodyDimensions.scrollTop,
            bottom: elementDimensions.clientHeight,
            left: bodyDimensions.scrollLeft,
            right: elementDimensions.clientWidth,
        };
    } else {
        // eslint-disable-next-line prefer-const
        let { top, height, left, width } = getDimensions(element);
        // В IE, в отличие от Chrome, getBoundingClientRect возвращает нецелочисленные значения top
        top = Math.round(top);
        left = Math.round(left);

        const windowDimensions = DimensionsMeasurer.getWindowDimensions(element);

        return {
            top: top + windowDimensions.pageYOffset,
            bottom: top + height + windowDimensions.pageYOffset,
            left: left + windowDimensions.pageXOffset,
            right: left + width + windowDimensions.pageXOffset,
        };
    }
}

function getScrollContainerByElement(scrollableElement: HTMLElement): Container {
    const controls = goUpByControlTree(scrollableElement);
    return controls.find((control: IControl) => {
        return cInstance.instanceOfModule(control, 'Controls/scroll:_ContainerBase');
    }) as Container;
}

type TStickyHeaderDimensions<T extends SCROLL_DIRECTION> = T extends SCROLL_DIRECTION.VERTICAL
    ? {
          top: number;
          bottom: number;
          topWithOffset: number;
      }
    : {
          left: number;
          right: number;
          leftWithOffset: number;
      };

// FIXME: Не считает отступ слева для зафиксированной группы.
//  https://online.sbis.ru/opendoc.html?guid=7ca2e0e8-a61a-408d-bd0c-73c844dd49a7
function getStickyHeaderDimensions<T extends SCROLL_DIRECTION>(
    targetElement: HTMLElement,
    scrollableElement: HTMLElement,
    scrollDirection: T,
    elemOffset: IOffset
): TStickyHeaderDimensions<T> {
    if (targetElement.classList.contains('controls-StickyHeader__isolatedGroup')) {
        return {
            top: 0,
            bottom: 0,
            topWithOffset: 0,
            left: 0,
            right: 0,
            leftWithOffset: 0,
        } as unknown as TStickyHeaderDimensions<T>;
    }

    const scrollControlNode: HTMLElement = scrollableElement.closest(SCROLL_CONTAINERS_SELECTOR);
    if (scrollControlNode) {
        const scrollContainer = getScrollContainerByElement(scrollControlNode);

        if (scrollContainer) {
            // Перед считыванием размеров стики блоков нужно зарегистрировать отложенные.
            scrollContainer.syncRegisterDelayedBlocks();
            const topHeadersRects = scrollContainer.getHeadersRects(
                StickyPosition.Top,
                TypeFixedBlocks.Fixed
            );
            const topDimensions = getTopDimensions(elemOffset, topHeadersRects);

            if (scrollDirection === SCROLL_DIRECTION.VERTICAL) {
                return {
                    top: topDimensions.top,
                    topWithOffset: topDimensions.topWithOffset,
                    bottom: scrollContainer.getHeadersHeight(
                        StickyPosition.Bottom,
                        TypeFixedBlocks.Fixed
                    ),
                } as TStickyHeaderDimensions<T>;
            } else {
                const left = scrollContainer.getHeadersWidth(
                    StickyPosition.Left,
                    TypeFixedBlocks.Fixed
                );
                return {
                    left,
                    right: 0,
                    leftWithOffset: left,
                } as TStickyHeaderDimensions<T>;
            }
        }
    }
    return {
        top: 0,
        bottom: 0,
        topWithOffset: 0,
        left: 0,
        right: 0,
        leftWithOffset: 0,
    } as unknown as TStickyHeaderDimensions<T>;
}

function getTopDimensions(
    elemOffset: IOffset,
    sizes: IBlockSize[]
): {
    top: number;
    topWithOffset: number;
} {
    let top = 0;
    let topWithOffset = 0;
    // Не учитываем стикиблок, если он никогда не перекроет таргет элемент - контейнеры со стикиблоком и с таргет
    // элементом стоят рядом друг с другом.
    for (const size of sizes) {
        if (size.rect.left + size.rect.width > elemOffset.left) {
            top += size.rect.height + size.block.props.offsetTop;
            topWithOffset += size.rect.height;
        } else {
            break;
        }
    }
    return {
        top,
        topWithOffset,
    };
}

function getCenterOffset(
    scrollDirection: SCROLL_DIRECTION,
    parentElement: HTMLElement,
    element: HTMLElement,
    stickyHeaderOffset: number
): number {
    if (scrollDirection === SCROLL_DIRECTION.VERTICAL) {
        return (getDimensions(parentElement).height - getDimensions(element).height) / 2;
    } else {
        return (
            (getDimensions(parentElement).width -
                getDimensions(element).width -
                stickyHeaderOffset) /
            2
        );
    }
}

// Элемент, к которому нужно подскролить, может находиться в стики элементе.
function inOuterStickyElement(element: HTMLElement): boolean {
    // Элемент, к которому нужно подскролить, может находиться в стики блоке.
    const inStickyBlock = !!element.closest('.controls-StickyBlock');
    // Элемент, к которому нужно подскролить, может находиться в мастере в графической шапке.
    const inMasterHeaders =
        !!element.closest('.headers-Layout') && !!element.closest('.controls-MasterDetail_master');
    return inMasterHeaders || inStickyBlock;
}

function scrollTo(
    element: HTMLElement,
    scrollDirection: SCROLL_DIRECTION,
    position?: SCROLL_POSITION,
    force?: Boolean,
    waitInitialization: boolean = false,
    offset: number = 0,
    smooth: boolean = false,
    onlyFirstScrollableParent: boolean = false,
    forceAllScrollableParent: boolean = false
): Promise<void> {
    if (isHidden(element)) {
        return;
    }
    const inStickyElement = inOuterStickyElement(element);
    const scrollableParent = getScrollableParents(
        element,
        inStickyElement,
        scrollDirection,
        onlyFirstScrollableParent
    );
    const props = getPropertiesNames(scrollDirection);

    /* eslint-disable max-len */
    // Если будут подобные ошибки, то можно будет попробовать сделать по умолчанию waitInitialization = true.
    // Эта логика правильнее, но может сломать существующие сценарии.
    if (waitInitialization) {
        const promises: Promise<void>[] = [];
        for (const parent of scrollableParent) {
            const scrollContainer = getScrollContainerByElement(parent);
            // В начале дождемся полного маутинга скролл контейнера, чтобы рассчитался скроллСтейт и заголовки были
            // добавлены в headersStack и была правильно посчитана их высота.
            // Решаемый кейс: заголовки не добавляются в headersStack (а значит не учитывается их высота) из-за
            // canScroll = false, который рассчитается только в afterMount скролл контейнера.
            if (scrollContainer) {
                if (scrollContainer.containerLoaded === true) {
                    const headerControllerInited = scrollContainer.initHeaderController();
                    if (headerControllerInited !== undefined) {
                        promises.push(headerControllerInited);
                    }
                } else {
                    return new Promise(() => {
                        (scrollContainer.containerLoaded as Promise<void>).then(() => {
                            scrollTo(
                                element,
                                scrollDirection,
                                position,
                                force,
                                waitInitialization,
                                offset,
                                smooth,
                                onlyFirstScrollableParent
                            );
                        });
                    });
                }
            }
        }
        if (promises.length) {
            return Promise.all(promises).then(() => {
                scrollTo(
                    element,
                    scrollDirection,
                    position,
                    force,
                    waitInitialization,
                    offset,
                    smooth,
                    onlyFirstScrollableParent
                );
            });
        }
    }

    for (const parent of scrollableParent) {
        const elemToScroll = parent === document.documentElement ? document.body : parent;
        const scrollContainer = getScrollContainerByElement(elemToScroll);
        // Подскролл к элементу может сработать в старом скролл контейнере.
        if (!scrollContainer) {
            return;
        }
        const parentOffset = getOffset(parent);
        const stickyElement = isStickyElement(element);
        const elemOffset = stickyElement
            ? getStickyElementOffset(stickyElement)
            : getOffset(element);

        const stickyHeaderDimensions = getStickyHeaderDimensions(
            element,
            parent,
            scrollDirection,
            elemOffset
        );
        // Если внутри элемента, к которому хотят подскроллиться, лежит StickyHeader или элемент
        // является StickyHeader'ом, то мы не должны учитывать высоту предыдущего заголовка, т.к. заголовок
        // встанет вместо него.
        // Рассматривается кейс: https://online.sbis.ru/opendoc.html?guid=cf7d3b3a-de34-43f2-ad80-d545d462602b, где все
        // StickyHeader'ы одной высоты и сменяются друг за другом.
        const innerStickyHeaderSize = stickyElement && stickyElement[props.stickyElementSize];
        if (innerStickyHeaderSize) {
            const headerDimensions = props.headerDimensions;
            for (const pos of headerDimensions) {
                // Если мы отнимаем высоту заголовка и получаем результат меньше нуля, значит заголовок был последним.
                // В таком случае не нужно отнимать высоту.
                if (stickyHeaderDimensions[pos] - innerStickyHeaderSize >= 0) {
                    stickyHeaderDimensions[pos] -= innerStickyHeaderSize;
                }
            }
        }

        let targetPosition;
        if (force || parentOffset[props.endPosition] < elemOffset[props.endPosition]) {
            if (position === SCROLL_POSITION.center) {
                const stickyHeaderOffset =
                    stickyHeaderDimensions[props.stickyElementOffsetToEndEdge];
                const centerOffset: number = getCenterOffset(
                    scrollDirection,
                    parent,
                    element,
                    stickyHeaderOffset
                );
                targetPosition =
                    elemToScroll[props.scroll] +
                    Math.floor(
                        elemOffset[props.startPosition] -
                            parentOffset[props.startPosition] -
                            stickyHeaderOffset -
                            centerOffset +
                            offset
                    );
                scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
            } else if (position === SCROLL_POSITION.bottom || position === SCROLL_POSITION.right) {
                targetPosition =
                    elemToScroll[props.scroll] +
                    Math.ceil(
                        elemOffset[props.endPosition] -
                            parentOffset[props.endPosition] +
                            stickyHeaderDimensions[props.endPosition] +
                            offset
                    );
                scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
            } else {
                // При принудительном скролировании к верху не скролируем если заголовок с установленным offsetTop
                // частично скрыт.
                // Т.е. скролируем только когда верх элемента выше свернутой шапки, или когда ниже развернутой.

                // ---Проскролл вниз. Элемент ниже текущей позиции---
                if (
                    !force ||
                    elemOffset[props.startPosition] <
                        parentOffset[props.startPosition] +
                            stickyHeaderDimensions[props.stickyElementOffsetToEndEdge] ||
                    elemOffset[props.startPosition] >
                        parentOffset[props.startPosition] +
                            stickyHeaderDimensions[props.startPosition]
                ) {
                    targetPosition =
                        elemToScroll[props.scroll] +
                        Math.floor(
                            elemOffset[props.startPosition] -
                                parentOffset[props.startPosition] -
                                stickyHeaderDimensions[props.startPosition] +
                                offset
                        );

                    // stickyHeight будет равен 0, если таргет элемент - изолированная группа.
                    // См. функцию getStickyHeaderDimensions
                    if (
                        !element.classList.contains('controls-StickyHeader__isolatedGroup') &&
                        props.startPosition === 'top' &&
                        !innerStickyHeaderSize
                    ) {
                        const stickyHeight = Math.round(
                            scrollContainer.getBlocksHeightByScrollTop(elemOffset[props.startPosition]||targetPosition)
                        );
                        targetPosition -= Math.abs(
                            stickyHeaderDimensions[props.startPosition] - stickyHeight
                        );
                    }

                    scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
                }
            }
            // Принудительно скроллим в самый вверх или вниз, только первый родительский скролл контейнер,
            // остальные скролл контейнер, скроллим только если элемент невидим
            force = forceAllScrollableParent;
        } else {
            if (
                parentOffset[props.startPosition] + stickyHeaderDimensions[props.startPosition] >
                elemOffset[props.startPosition] - offset
            ) {
                if (position === SCROLL_POSITION.center) {
                    const stickyHeaderOffset =
                        stickyHeaderDimensions[props.stickyElementOffsetToEndEdge];
                    const centerOffset: number = getCenterOffset(
                        scrollDirection,
                        parent,
                        element,
                        stickyHeaderOffset
                    );
                    targetPosition =
                        elemToScroll[props.scroll] -
                        Math.max(
                            parentOffset[props.startPosition] -
                                elemOffset[props.startPosition] +
                                stickyHeaderOffset +
                                centerOffset +
                                offset,
                            0
                        );
                    scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
                } else if (
                    position === SCROLL_POSITION.bottom ||
                    position === SCROLL_POSITION.right
                ) {
                    targetPosition =
                        elemToScroll[props.scroll] -
                        Math.max(
                            parentOffset[props.endPosition] -
                                elemOffset[props.endPosition] +
                                stickyHeaderDimensions[props.endPosition] +
                                offset,
                            0
                        );
                    scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
                } else {
                    targetPosition =
                        elemToScroll[props.scroll] -
                        Math.max(
                            parentOffset[props.startPosition] -
                                elemOffset[props.startPosition] +
                                stickyHeaderDimensions[props.stickyElementOffsetToEndEdge] +
                                offset,
                            0
                        );
                    scrollContainer.scrollTo(targetPosition, scrollDirection, smooth);
                }
            }
        }
        /* eslint-enable max-len */

        // Мы подскролили к элементу, если он лежит в стики элементе.
        if (inStickyElement) {
            return;
        }
    }
}

/**
 * Модуль с функциями без классов.
 * @module Controls/_scroll/Utils/scrollToElement
 * @private
 */

/**
 * Позволяет проскроллить содержимое, находящееся внутри родительского скролл-контейнера, к выбранному элементу, сделав его видимым.
 * @param {HTMLElement} element DOM-элемент, к которому нужно проскроллить содержимое.
 * @param {String} [position='top'] Целевое положение элемента, к которому происходит скроллирование. Допустимые значения: top, bottom, center.
 * @param {boolean} [force=false] Определяет форсированность скролла. Если true, то подскролл произойдет в любом случае. Если false, то подскролл произойдет только в случае, если элемент частично или полностью скрыт за пределами области прокрутки.
 * @param {boolean} [waitInitialization=false] Определяет, нужно ли дождаться инициализации скролл контейнера и прилипающих заголовков в нём.
 * @param {Number} [offset=0] Дополнительное смещение.
 * @param {Boolean} [smooth=false] Плавная прокрутка.
 * @param {Boolean} [onlyFirstScrollableParent=false] Проскролить только 1 найденный скролл-контейнер.
 * @param {Boolean} [forceAllScrollableParent=false] Определяет необходимость форсированности всех скроллов, а не только 1 найденного.
 *
 * @example
 * <pre class="brush: js">
 * // TypeScript
 * import {scrollToElement} from 'Controls/scroll';
 *
 * _onClick(): void {
 *    scrollToElement(this._children.child, 'top');
 * }
 * </pre>
 *
 * Вызовем scrollToElement с плавной прокруткой.
 * <pre class="brush: js">
 * // TypeScript
 * import {scrollToElement} from 'Controls/scroll';
 *
 * _onClick(): void {
 *    scrollToElement(this._children.child, 'top', false, false, 0, true);
 * }
 * </pre>
 */
export function scrollToElement(
    element: HTMLElement,
    position?:
        | TScrollPosition
        | Exclude<SCROLL_POSITION, SCROLL_POSITION.left | SCROLL_POSITION.right>,
    force?: Boolean,
    waitInitialization: boolean = false,
    offset: number = 0,
    smooth: boolean = false,
    onlyFirstScrollableParent: boolean = false,
    forceAllScrollableParent: boolean = false
): Promise<void> {
    return scrollTo(
        element,
        SCROLL_DIRECTION.VERTICAL,
        position as Exclude<SCROLL_POSITION, SCROLL_POSITION.left | SCROLL_POSITION.right>,
        force,
        waitInitialization,
        offset,
        smooth,
        onlyFirstScrollableParent,
        forceAllScrollableParent
    );
}

export function horizontalScrollToElement(
    element: HTMLElement,
    position?: Exclude<SCROLL_POSITION, SCROLL_POSITION.top | SCROLL_POSITION.bottom>,
    force?: Boolean,
    waitInitialization: boolean = false,
    offset: number = 0
): Promise<void> {
    return scrollTo(
        element,
        SCROLL_DIRECTION.HORIZONTAL,
        position,
        force,
        waitInitialization,
        offset
    );
}
