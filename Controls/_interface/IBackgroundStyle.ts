/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/IBackgroundStyle/TBackgroundStyle
 * @description Допустимые значения для настройки фона контрола.
 * @remark Посмотреть всю палитру цветов можно в {@link https://www.figma.com/proto/aoDaE5WOM1bcQMqXhz3uIH/%D0%A2%D0%B5%D0%BC%D0%B0-%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BC%D0%BE%D0%BB%D1%87%D0%B0%D0%BD%D0%B8%D1%8E?page-id=10265%3A2929&node-id=10969%3A10924&viewport=316%2C48%2C0.25&scaling=min-zoom&starting-point-node-id=10969%3A10924 стандарте по платформенным цветам}
 * @variant default
 * @variant danger
 * @variant success
 * @variant warning
 * @variant primary
 * @variant secondary
 * @variant unaccented
 * @variant readonly
 * @variant info
 */
export type TBackgroundStyle =
    | 'default'
    | 'danger'
    | 'success'
    | 'warning'
    | 'primary'
    | 'secondary'
    | 'unaccented'
    | 'readonly'
    | 'info'
    | 'none'
    | string;

export interface IBackgroundStyleOptions {
    backgroundStyle?: TBackgroundStyle;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку фона внутренних элементов.
 *
 * @public
 */
export default interface IBackgroundStyle {
    readonly '[Controls/_interface/IBackgroundStyle]': boolean;
}
/**
 * @name Controls/_interface/IBackgroundStyle#backgroundStyle
 * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Определяет префикс стиля для настройки фона внутренних элементов контрола.
 * @default default (фон цвета темы)
 * @demo Controls-demo/Spoiler/Cut/BackgroundStyle/Index
 * @demo Controls-demo/EditableArea/BackgroundStyle/Index
 */
