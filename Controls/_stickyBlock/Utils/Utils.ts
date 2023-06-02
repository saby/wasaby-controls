/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { detection } from 'Env/Env';
import { getDimensions } from 'Controls/sizeUtils';
import { StickyPosition } from 'Controls/_stickyBlock/types';

let lastId = 0;

export enum POSITION {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
    none = '',
}

export enum StickyVerticalPosition {
    top = 'top',
    bottom = 'bottom',
    topBottom = 'topBottom',
}

export enum StickyHorizontalPosition {
    left = 'left',
    right = 'right',
    leftRight = 'leftRight',
}

export interface IPositionOrientation {
    vertical: StickyVerticalPosition;
    horizontal: StickyHorizontalPosition;
}

export enum SHADOW_VISIBILITY {
    visible = 'visible',
    hidden = 'hidden',
    lastVisible = 'lastVisible',
    initial = 'initial',
}

/**
 * @typedef {String} TYPE_FIXED_HEADERS
 * @variant initialFixed учитываются высоты заголовков которые были зафиксированы изначально
 * @variant fixed зафиксированные в данный момент заголовки
 * @variant allFixed высота всех заголовков, если бы они были зафиксированы
 */
export enum TYPE_FIXED_HEADERS {
    initialFixed = 'initialFixed',
    fixed = 'fixed',
    allFixed = 'allFixed',
}

export enum MODE {
    stackable = 'stackable',
    replaceable = 'replaceable',
    notsticky = 'notsticky',
}

export interface IOffset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

/**
 * The position property with sticky value is not supported in ie and edge lower version 16.
 * https://developer.mozilla.org/ru/docs/Web/CSS/position
 */
export function isStickySupport(): boolean {
    return !detection.isIE || detection.IEVersion > 15;
}

export function getNextId(): string {
    return (lastId++).toString();
}

export function _lastId(): number {
    return lastId - 1;
}

export function getOffset(
    parentElement: HTMLElement,
    element: HTMLElement,
    position: POSITION | StickyPosition,
    stickyFix?: boolean
): number {
    // TODO redo after complete https://online.sbis.ru/opendoc.html?guid=7c921a5b-8882-4fd5-9b06-77950cbe2f79
    parentElement =
        parentElement && parentElement.get
            ? parentElement.get(0)
            : parentElement;
    element = element && element.get ? element.get(0) : element;

    if (!parentElement || !element) {
        return 0;
    }

    const offset = getDimensions(element);
    const parentOffset = getDimensions(parentElement, null, stickyFix);
    if (position === 'top') {
        return offset.top - parentOffset.top;
    } else if (position === 'bottom') {
        return parentOffset.bottom - offset.bottom;
    } else if (position === 'left') {
        return offset.left - parentOffset.left;
    } else {
        return parentOffset.right - offset.right;
    }
}

/**
 * Проверяет, является ли элемент скрытым.
 * @param element Проверяемый элемент.
 * @param forceCalc Использовать ли при расчете getBoundingClientRect.
 */
export function isHidden(
    element: HTMLElement,
    forceCalc: boolean = false
): boolean {
    if (!element) {
        return false;
    }

    if (forceCalc) {
        const dimensions = getDimensions(element);
        return dimensions.height === 0 && dimensions.width === 0;
    } else {
        return !!element.closest('.ws-hidden');
    }
}
