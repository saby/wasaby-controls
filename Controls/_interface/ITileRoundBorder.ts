/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/ITileRoundBorder/TTileRoundBorderSize
 * @variant null Без скругления.
 * @variant 3xs Минимальный радиус скругления.
 * @variant 2xs Малый радиус скругления.
 * @variant xs Средний радиус скругления.
 * @variant s Большой радиус скругления.
 * @variant m Максимальный радиус скругления.
 */
export type TTileRoundBorderSize = 'null' | '3xs' | '2xs' | 'xs' | 's' | 'm';

/**
 * @public
 */
export interface ITileRoundBorder {
    /**
     * @cfg {Controls/_interface/ITileRoundBorder/TTileRoundBorderSize.typedef} Левый верхний угол
     */
    tl: TTileRoundBorderSize;

    /**
     * @cfg {Controls/_interface/ITileRoundBorder/TTileRoundBorderSize.typedef} Правый верхний угол.
     */
    tr: TTileRoundBorderSize;

    /**
     * @cfg {Controls/_interface/ITileRoundBorder/TTileRoundBorderSize.typedef} Левый нижний угол.
     */
    bl: TTileRoundBorderSize;

    /**
     * @cfg {Controls/_interface/ITileRoundBorder/TTileRoundBorderSize.typedef} Правый нижний угол.
     */
    br: TTileRoundBorderSize;
}
