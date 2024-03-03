/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} BorderStyle
 * @variant success
 * @variant secondary
 * @variant warning
 */
export type BorderStyle = 'success' | 'secondary' | 'warning';

export interface IBorderStyleOptions {
    borderStyle: BorderStyle;
}

/**
 * Интерфейс для контролов, которые поддерживают разные цвета границы.
 * @public
 */
interface IBorderStyle {
    readonly '[Controls/interface/IBorderStyle]': boolean;
}

export default IBorderStyle;

/**
 * @name Controls/_interface/IBorderStyle#borderStyle
 * @cfg {BorderStyle} Цвет обводки контрола.
 * @demo Controls-demo/Input/BorderStyles/Index
 */
