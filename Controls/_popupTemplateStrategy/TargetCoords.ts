/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { DimensionsMeasurer, getDimensions } from 'Controls/sizeUtils';

import { getStore } from 'Application/Env';
import { detection } from 'Env/Env';

export interface ITargetCoords extends ClientRect {
    topScroll: number;
    leftScroll: number;
    boundingClientRect?: ClientRect;
    zoom: number;
}
export default function getTargetCoords(target: HTMLElement): ITargetCoords {
    if (!target) {
        throw new Error('Target parameter is required');
    }

    // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
    if (target.get) {
        target = target.get(0);
    }

    if (target._container) {
        target = target._container;
    }

    /*
      There are two options how we can work if the target has display: contents:
      1) Don't allow such targets, and create an option like targetCoords in popups.
      Then everyone would calculate coordinates of the target and pass them.
      2) Calculate boundingClientRect of such targets based on content.

      I've chosen option 2 because it's less error-prone and doesn't have real drawbacks.
    */
    const box = getDimensions(target);
    const viewportDimensions = DimensionsMeasurer.getVisualViewportDimensions(target);
    const offsetTop: number = viewportDimensions.offsetTop || 0;
    const offsetLeft: number = viewportDimensions.offsetLeft || 0;
    const top: number = box.top + offsetTop;
    const left: number = box.left + offsetLeft;
    const bottom: number = box.bottom + offsetTop;
    const right: number = box.right + offsetLeft;
    const windowDimensions = DimensionsMeasurer.getWindowDimensions(target);
    const documentDimensions = DimensionsMeasurer.getElementDimensions(document.documentElement);
    const bodyDimensions = DimensionsMeasurer.getElementDimensions(document.body);
    const fullTopOffset: number =
        windowDimensions.pageYOffset ||
        documentDimensions.scrollTop ||
        bodyDimensions.scrollTop ||
        0 - documentDimensions.clientTop ||
        bodyDimensions.clientTop ||
        0;
    const fullLeftOffset: number =
        windowDimensions.pageXOffset ||
        documentDimensions.scrollLeft ||
        bodyDimensions.scrollLeft ||
        0 - documentDimensions.clientLeft ||
        bodyDimensions.clientLeft ||
        0;
    const isScrollOnBody =
        !!detection.isMobilePlatform && getStore('AdaptiveInitializer').get('isScrollOnBody');
    return {
        top: isScrollOnBody ? top : top + fullTopOffset,
        bottom: isScrollOnBody ? bottom : bottom + fullTopOffset,
        left: left + fullLeftOffset,
        right: right + fullLeftOffset,
        width: box.width,
        height: box.height,
        topScroll: fullTopOffset,
        leftScroll: fullLeftOffset,
        boundingClientRect: box,
        zoom: DimensionsMeasurer.getZoomValue(target),
    };
}
