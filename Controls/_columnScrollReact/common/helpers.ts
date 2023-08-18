import type { IColumnScrollWidths } from './interfaces';
import { EdgeState } from './types';
import type * as React from 'react';
import { detection } from 'Env/Env';

const WHEEL_DELTA_INCREASE_COEFFICIENT = 100;
const WHEEL_SCROLLING_SMOOTH_COEFFICIENT = 0.4;
const PAGE_SMOOTH_SCROLLING_COEFFICIENT = 0.9;

// region УТИЛИТЫ РАЗМЕРОВ
/**
 * Возвращает размер скроллируемого контента.
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getScrollableWidth(widths: IColumnScrollWidths): number {
    return Math.max(widths.contentWidth - widths.startFixedWidth - widths.endFixedWidth, 0);
}

/**
 * Возвращает размер скроллируемого контента, который умещается в видимую область таблицы.
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getScrollableViewPortWidth(widths: IColumnScrollWidths): number {
    const width = widths.viewPortWidth - widths.startFixedWidth - widths.endFixedWidth;
    return _minMax(width, [0, getScrollableWidth(widths)]);
}

// endregion

// region УТИЛИТЫ ПОЗИЦИИ СКРОЛА
/**
 * Возвращает максимальную доступную позицию скролла.
 * Не может быть меньше нуля или настолько большой, что контент уедет "за предел".
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getMaxScrollPosition(widths: IColumnScrollWidths): number {
    return getScrollableWidth(widths) - getScrollableViewPortWidth(widths);
}

/**
 * Возвращает позицию скролла, которая соответствует "предыдущей странице".
 * Чаще всего, это такое положение скролла, которое соответствует текущему положению - 90% ширины видимой скроллируемой части.
 * Используется, например, при скроллировании кнопками, когда нужно проскролить контент на без малого страницу назад.
 * Погрешность в 10% сделана для большей дружелюбности к пользователю, чтобы при скролле назад было видно часть прошлого контента.
 * @param {number} currentPosition Текущая позиция скролла.
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getPrevPagePosition(currentPosition: number, widths: IColumnScrollWidths): number {
    return _calcNearbyPagePosition(currentPosition, -1, widths);
}

/**
 * Возвращает позицию скролла, которая соответствует "предыдущей странице".
 * Чаще всего, это такое положение скролла, которое соответствует текущему положению - 90% ширины видимой скроллируемой части.
 * Используется, например, при скроллировании кнопками, когда нужно проскролить контент на без малого страницу назад.
 * Погрешность в 10% сделана для большей дружелюбности к пользователю, чтобы при скролле назад было видно часть прошлого контента.
 * @param {number} currentPosition Текущая позиция скролла.
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getNextPagePosition(currentPosition: number, widths: IColumnScrollWidths): number {
    return _calcNearbyPagePosition(currentPosition, 1, widths);
}

/**
 * Возвращает позицию скролла, скорректированную относительно минимально и максимально возможной.
 * @param {number} currentPosition Текущая позиция скролла.
 * @param {IColumnScrollWidths} widths Размеры частей скроллируемой области.
 */
export function getLimitedPosition(currentPosition: number, widths: IColumnScrollWidths): number {
    return _minMax(currentPosition, [0, getMaxScrollPosition(widths)]);
}

function _calcNearbyPagePosition(
    currentPosition: number,
    coef: -1 | 1,
    widths: IColumnScrollWidths
): number {
    const scrollableViewPortWidth = getScrollableViewPortWidth(widths);
    // Проскроливаем не весь вьюпорт, а немного меньше, чтобы пользователь видел
    // немного прошлых колонок (было 1-10, стало 9-19, а не 10-20).
    const delta = scrollableViewPortWidth * PAGE_SMOOTH_SCROLLING_COEFFICIENT;
    return _minMax(Math.round(currentPosition + coef * delta), [0, getMaxScrollPosition(widths)]);
}

function _minMax(value: number, bounds: [number, number]): number {
    return Math.min(Math.max(value, bounds[0]), bounds[1]);
}

// endregion

// region УТИЛИТЫ CSS ТРАНСФОРМАЦИИ

type TValue<T extends number | string> = T extends number ? `${T}px` : `${T}`;
type TTranslate<T extends number | string> = `translate3d(${TValue<T>},0,0)`;
type TTransform<T extends number | string> = `transform:${TTranslate<T>};`;

function _getTransformCSSValue<T extends number | string>(position: T): TTranslate<T> {
    const value: TValue<T> = (
        typeof position === 'number' ? position + 'px' : position
    ) as TValue<T>;
    return `translate3d(${value},0,0)`;
}

export function getTransformCSSRule<T extends number | string>(position: T): TTransform<T> {
    return `transform:${_getTransformCSSValue(position)};`;
}

export function getTransformCSSRuleReact<T extends number | string>(
    position: T
): {
    transform: TTranslate<T>;
} {
    return { transform: _getTransformCSSValue<T>(position) };
}

// endregion

// region HELPER расчета позиции по событию onWheel

export class WheelHelper {
    private _sum: number = 0;
    private _count: number = 0;

    calcNewPositionByWheelEvent(
        e: React.WheelEvent,
        currentPosition: number,
        widths: IColumnScrollWidths
    ): number {
        if (!(e.shiftKey || e.deltaX)) {
            return currentPosition;
        }

        // deltaX определена, когда качаем колесом мыши
        const delta = this._correctWheelDelta(this._getAverageDelta(e.deltaX || e.deltaY));

        return getLimitedPosition(Math.round(currentPosition + delta), widths);
    }

    private _getAverageDelta(delta: number): number {
        this._sum += Math.abs(delta);
        this._count++;

        const coef = delta < 0 ? -1 : 1;

        return (coef * this._sum) / this._count;
    }

    private _correctWheelDelta(delta: number): number {
        /**
         * Определяем смещение ползунка. В Firefox в дескрипторе события в свойстве deltaY лежит маленькое значение,
         * поэтому установим его сами. Нормальное значение есть в дескрипторе события MozMousePixelScroll в
         * свойстве detail, но на него нельзя подписаться.
         * TODO: https://online.sbis.ru/opendoc.html?guid=3e532f22-65a9-421b-ab0c-001e69d382c8
         */
        const correctDelta = detection.firefox
            ? Math.sign(delta) * WHEEL_DELTA_INCREASE_COEFFICIENT
            : delta;
        return correctDelta * WHEEL_SCROLLING_SMOOTH_COEFFICIENT;
    }
}

// endregion

// region УТИЛИТЫ ОПРЕДЕЛЕНИЯ СОСТОЯНИЯ ГРАНИЦ

export function getEdgesState(
    position: number,
    widths: IColumnScrollWidths
): { left: EdgeState; right: EdgeState } {
    if (widths.viewPortWidth >= widths.contentWidth) {
        return {
            left: EdgeState.Invisible,
            right: EdgeState.Invisible,
        };
    }
    return {
        left: position > 0 ? EdgeState.Invisible : EdgeState.Visible,
        right: position < getMaxScrollPosition(widths) ? EdgeState.Invisible : EdgeState.Visible,
    };
}

export function getEdgesStateAfterScroll(
    edgePositions: [backwardEdgePosition: number, forwardEdgePosition: number],
    prevPosition: number,
    newPosition: number,
    smooth: boolean
): { left: EdgeState; right: EdgeState } {
    const params: [prevPosition: number, newPosition: number, smooth: boolean] = [
        prevPosition,
        newPosition,
        smooth,
    ];
    return {
        left: getEdgeStateAfterScroll(edgePositions[0], ...params),
        right: getEdgeStateAfterScroll(edgePositions[1], ...params),
    };
}

/**
 *
 * @param {number} edgePosition Позиция границы, либо 0 либо maxScrollPosition().
 * @param {number} prevPosition Предыдущая позиция скрола.
 * @param {number} newPosition Новая позиция скрола.
 * @param {boolean} smooth Используется ли плавная прокрутка.
 */
export function getEdgeStateAfterScroll(
    edgePosition: number,
    prevPosition: number,
    newPosition: number,
    smooth?: boolean
): EdgeState {
    // Без анимации или такая же позиция.
    if (!smooth || newPosition === prevPosition) {
        return newPosition === edgePosition ? EdgeState.Visible : EdgeState.Invisible;
    }

    // Плавно скролим к границе, будет касание.
    if (newPosition === edgePosition) {
        return EdgeState.AnimatedFromInvisibleToVisible;
    }

    // Плавно скролим от границы, было касание, после анимации граница станет невидна.
    if (prevPosition === edgePosition) {
        return EdgeState.AnimatedFromVisibleToInvisible;
    }

    // Граница до и после анимации невидна, она где-то слева или справа, это неважно.
    // Состояния когда она до скролла была видна и после него будет видна быть не может.
    // Если она видна, то скроллить дальше в эту сторону невозможно.
    return EdgeState.AnimatedInvisible;
}

export function isEdgeAnimated(edgeState: EdgeState): boolean {
    return edgeState !== EdgeState.Invisible && edgeState !== EdgeState.Visible;
}

export function isEdgeVisibleOrAnimated(edgeState: EdgeState): boolean {
    return edgeState !== EdgeState.Invisible && edgeState !== EdgeState.AnimatedInvisible;
}

// endregion
