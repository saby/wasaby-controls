/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export type TUnderline = 'hovered' | 'fixed' | 'none';

export interface IUnderlineOptions {
    underline?: TUnderline;
}

/**
 * Интерфейс для контролов, которые поддерживают разные стиль декоративной линии, отображаемой для текста.
 * @public
 */
export default interface IUnderline {
    readonly '[Controls/_interface/IUnderline]': boolean;
}

/**
 * @name Controls/_interface/IUnderline#underline
 * @cfg {String} Стиль декоративной линии
 * @variant fixed всегда будет подчеркивание
 * @variant none никогда не будет подчеркивания
 * @variant hovered подчеркивание только по наведению
 * @default fixed
 */
