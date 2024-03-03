/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
// Уникальные в рамках ResizeObserverContainer идентификаторы структурных частей скролла,
// изменение размеров которых отслеживается.
export const VIEWPORT_TARGET_NAME = Symbol('viewPort');
export const START_FIXED_PART_TARGET_NAME = Symbol('startFixedPart');
export const END_FIXED_PART_TARGET_NAME = Symbol('endFixedPart');
export const SCROLLABLE_PART_TARGET_NAME = Symbol('scrollablePart');
