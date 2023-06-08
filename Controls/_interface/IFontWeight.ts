/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/IFontWeight/TFontWeight
 * @description Допустимые значения для опции {@link Controls/interface:IFontWeight#fontWeight fontWeight}.
 * @variant default начертание, которое задается при помощи переменной темы оформления
 * @variant normal нормальное начертание
 * @variant bold полужирное начертание
 */
export type TFontWeight = 'default' | 'normal' | 'bold';

export interface IFontWeightOptions {
    /**
     * @name Controls/_interface/IFontWeight#fontWeight
     * @cfg {Controls/_interface/IFontWeight/TFontWeight.typedef} Насыщенность шрифта.
     * @default default
     * @demo Controls-demo/Decorator/Money/FontWeight/Index
     */
    fontWeight?: TFontWeight;
}

/**
 * Интерфейс для контролов, которые поддерживают разные начертания шрифта.
 * @public
 */
export default interface IFontWeight {
    readonly '[Controls/_interface/IFontWeight]': boolean;
}
