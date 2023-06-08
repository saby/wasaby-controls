/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/IRoundBorder/TRoundBorderSize
 * @description Варианты скруглений углов. Значения соответствую стандартной {@link http://axure.tensor.ru/StandardsV8/%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5.html линейке скруглений}
 * @variant null Без скругления.
 * @variant 3xs 2px (по стандарту онлайна)
 * @variant 2xs 4px (по стандарту онлайна)
 * @variant xs 6px (по стандарту онлайна)
 * @variant s 8px (по стандарту онлайна)
 * @variant m 12px (по стандарту онлайна)
 * @variant l 16px (по стандарту онлайна)
 * @variant xl 20px (по стандарту онлайна)
 * @variant 2xl 24px (по стандарту онлайна)
 * @variant 3xl 28px (по стандарту онлайна)
 */
export type TRoundBorderSize =
    | 'null'
    | '3xs'
    | '2xs'
    | 'xs'
    | 's'
    | 'm'
    | 'l'
    | 'xl'
    | '2xl'
    | '3xl';

/**
 * Интерфейс конфигурации скругления углов записей.
 * @interface Controls/_interface/IRoundBorder
 * @description
 * Настройка скругления производится для каждого угла записи.
 * @public
 */
export interface IRoundBorder {
    /**
     * Левый верхний угол
     */
    tl: TRoundBorderSize;

    /**
     * Правый верхний угол.
     */
    tr: TRoundBorderSize;

    /**
     * Левый нижний угол.
     */
    bl: TRoundBorderSize;

    /**
     * Правый нижний угол.
     */
    br: TRoundBorderSize;
}
