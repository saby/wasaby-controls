/**
 * Приватное имя действия для публичного метода установки нового состояния.
 */
export const PublicSetStateSymbol = Symbol('PublicSetStateSymbol');

/**
 * Приватное имя действия для расчета состояния по экшенам.
 */
export const StartUpdateSymbol = Symbol('StartUpdateSymbol');

/**
 * Приватное имя действия для имитации старого beforeApplyState.
 */
export const BeforeApplyStateSymbol = Symbol('BeforeApplyStateSymbol');

/**
 * Тип имени действия для публичного метода установки нового состояния.
 */
export type TPublicSetStateSymbol = typeof PublicSetStateSymbol;

/**
 * Тип имени действия для расчета состояния по экшенам.
 */
export type TStartUpdateSymbol = typeof StartUpdateSymbol;

/**
 * Тип имени действия для имитации старого beforeApplyState.
 */
export type TBeforeApplyStateSymbol = typeof BeforeApplyStateSymbol;
