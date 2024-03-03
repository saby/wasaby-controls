/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} BorderRadius
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 */
export type BorderRadius = '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

export interface IBorderRadiusOptions {
    borderRadius?: BorderRadius;
}

/**
 * Интерфейс для контролов, которые поддерживают разные закругления границы.
 * @public
 */
interface IBorderRadius {
    readonly '[Controls/interface/IBorderRadius]': boolean;
}

export default IBorderRadius;
/**
 * @name Controls/_interface/IBorderRadius#borderRadius
 * @cfg {BorderRadius} Закругление обводки контрола.
 */
