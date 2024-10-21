/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
/**
 * Интерфейс для контролов, ограничивающих контент заданным числом строк.
 * @interface Controls/_cut/interface/ILines
 * @public
 */

type TLineHeight = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

interface ILinesOptions {
    /**
     * @name Controls/_cut/interface/ILines#lineHeight
     * @cfg {String} Высота строки
     * @variant xs
     * @variant s
     * @variant m
     * @variant l
     * @variant xl
     * @variant 2xl
     * @variant 3xl
     * @variant 4xl
     * @variant 5xl
     * @default m
     * @demo Controls-demo/Spoiler/Cut/LineHeight/Index
     * @remark
     * Высота строки задается константой из стандартного набора размеров, который определен для текущей {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления}.
     */
    lineHeight: TLineHeight;
    /**
     * @name Controls/_cut/interface/ILines#lines
     * @cfg {Number|null} Количество строк.
     * @remark
     * Доступен диапазон от 1 до 10 строк.
     * Указав значение null, контент не будет иметь ограничение.
     * @demo Controls-demo/Spoiler/Cut/Lines/Index
     */
    lines: number | null;
}
