import type { IColumnScrollWidths } from './interfaces';
import { EdgeState } from './types';
import type * as React from 'react';
import { detection } from 'Env/Env';

const WHEEL_DELTA_INCREASE_COEFFICIENT = 100;
const WHEEL_SCROLLING_SMOOTH_COEFFICIENT = 0.4;
const PAGE_SMOOTH_SCROLLING_COEFFICIENT = 0.9;

// region УТИЛИТЫ РАЗМЕРОВ
export function getScrollableWidth(widths: IColumnScrollWidths): number {
    return Math.max(widths.contentWidth - widths.fixedWidth, 0);
}

export function getScrollableViewPortWidth(
    widths: IColumnScrollWidths
): number {
    return _minMax(widths.viewPortWidth - widths.fixedWidth, [
        0,
        getScrollableWidth(widths),
    ]);
}

// endregion

// region УТИЛИТЫ ПОЗИЦИИ СКРОЛА
export function getMaxScrollPosition(widths: IColumnScrollWidths): number {
    return getScrollableWidth(widths) - getScrollableViewPortWidth(widths);
}

export function getPrevPagePosition(
    currentPosition: number,
    widths: IColumnScrollWidths
): number {
    return _calcNearbyPagePosition(currentPosition, -1, widths);
}

export function getNextPagePosition(
    currentPosition: number,
    widths: IColumnScrollWidths
): number {
    return _calcNearbyPagePosition(currentPosition, 1, widths);
}

export function getLimitedPosition(
    current: number,
    widths: IColumnScrollWidths
): number {
    return _minMax(current, [0, getMaxScrollPosition(widths)]);
}

export function calcNewPositionByWheelEvent(
    e: React.WheelEvent,
    currentPosition: number,
    widths: IColumnScrollWidths
): number {
    if (!(e.shiftKey || e.deltaX)) {
        return currentPosition;
    }

    // deltaX определена, когда качаем колесом мыши
    const delta = _correctWheelDelta(e.deltaX || e.deltaY);

    return getLimitedPosition(currentPosition + delta, widths);
}

function _correctWheelDelta(delta: number): number {
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

function _calcNearbyPagePosition(
    currentPosition: number,
    coef: -1 | 1,
    widths: IColumnScrollWidths
): number {
    const scrollableViewPortWidth = getScrollableViewPortWidth(widths);
    // Проскроливаем не весь вьюпорт, а немного меньше, чтобы пользователь видел
    // немного прошлых колонок (было 1-10, стало 9-19, а не 10-20).
    const delta = scrollableViewPortWidth * PAGE_SMOOTH_SCROLLING_COEFFICIENT;
    return _minMax(currentPosition + coef * delta, [
        0,
        getMaxScrollPosition(widths),
    ]);
}

function _minMax(value: number, bounds: [number, number]): number {
    return Math.min(Math.max(value, bounds[0]), bounds[1]);
}

// endregion

// region УТИЛИТЫ CSS ТРАНСФОРМАЦИИ

function _getTransformCSSValue(
    position: number
): `translate3d(${number}px,0,0)` {
    return `translate3d(${position}px,0,0)`;
}

export function getTransformCSSRule(
    position: number
): `transform:${ReturnType<typeof _getTransformCSSValue>};` {
    return `transform:${_getTransformCSSValue(position)};`;
}

export function getTransformCSSRuleReact(
    position: number
): React.CSSProperties {
    return { transform: _getTransformCSSValue(position) };
}

// endregion

// region УТИЛИТЫ ОПРЕДЕЛЕНИЯ СОСТОЯНИЯ ГРАНИЦ

export function getEdgesState(
    position: number,
    widths: IColumnScrollWidths
): [EdgeState, EdgeState] {
    if (widths.viewPortWidth >= widths.contentWidth) {
        return [EdgeState.Invisible, EdgeState.Invisible];
    }
    return [
        position > 0 ? EdgeState.Invisible : EdgeState.Visible,
        position < getMaxScrollPosition(widths)
            ? EdgeState.Invisible
            : EdgeState.Visible,
    ];
}

export function getEdgesStateAfterScroll(
    edgePositions: [backwardEdgePosition: number, forwardEdgePosition: number],
    prevPosition: number,
    newPosition: number,
    smooth: boolean
): [EdgeState, EdgeState] {
    const params: [prevPosition: number, newPosition: number, smooth: boolean] =
        [prevPosition, newPosition, smooth];
    return [
        getEdgeStateAfterScroll(edgePositions[0], ...params),
        getEdgeStateAfterScroll(edgePositions[1], ...params),
    ];
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
        return newPosition === edgePosition
            ? EdgeState.Visible
            : EdgeState.Invisible;
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
    return (
        edgeState !== EdgeState.Invisible &&
        edgeState !== EdgeState.AnimatedInvisible
    );
}

// endregion
