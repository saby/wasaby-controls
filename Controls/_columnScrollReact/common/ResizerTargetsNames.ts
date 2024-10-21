/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
// Уникальные в рамках ResizeObserverContainer идентификаторы структурных частей скролла,
// изменение размеров которых отслеживается.
export const VIEWPORT_TARGET_NAME = Symbol('viewPort');
export const START_FIXED_PART_TARGET_NAME = Symbol('startFixedPart');
export const END_FIXED_PART_TARGET_NAME = Symbol('endFixedPart');
export const SCROLLABLE_PART_TARGET_NAME = Symbol('scrollablePart');
