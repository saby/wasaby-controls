/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Набор стандартных значений размеров шрифта.
 * @typedef {String} Controls/_interface/IFontSize/TFontSize
 * @variant inherit
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @variant 6xl
 * @variant 7xl
 * @variant 8xl
 */
export type TFontSize =
    | 'inherit'
    | '3xs'
    | '2xs'
    | 'xs'
    | 's'
    | 'm'
    | 'l'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl';

export interface IFontSizeOptions {
    fontSize?: TFontSize;
}

/**
 * Интерфейс для контролов, которые поддерживают разные размеры шрифта.
 * @public
 */
export default interface IFontSize {
    readonly '[Controls/_interface/IFontSize]': boolean;
}
/**
 * @name Controls/_interface/IFontSize#fontSize
 * @cfg {String} Размер шрифта.
 * @remark
 * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
 * Дополнительно о размерах:
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%88%D1%80%D0%B8%D1%84%D1%82%D1%8B.html Спецификация Axure}
 * @variant inherit
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @variant 6xl
 * @variant 7xl
 * @variant 8xl
 * @default m
 * @see Icon
 */

/*
 * @name Controls/_interface/IFontSize#fontSize
 * @cfg {Enum} Font size value
 * @variant inherit
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @example
 * Button with xl font size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" fontSize="xl" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */
