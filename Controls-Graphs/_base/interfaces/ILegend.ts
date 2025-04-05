export type TLegendVerticalPosition = 'top' | 'bottom';
export type THorizontalAlignment = 'start' | 'end' | 'center';

/**
 * @interface Controls-Graphs/_base/interfaces/ILegend
 * Интерфейс, опиывающий опции, с помощью которых можно сконфигурировать легенду.
 * @public
 */
export default interface ILegend {
    /**
     * @name Controls-Graphs/_base/interfaces/ILegend#legendVisible
     * @cfg {Boolean} Определяет наличие легенды у графика.
     * @default true
     */
    legendVisible?: boolean;

    /**
     * @name Controls-Graphs/_base/interfaces/ILegend#legendVerticalPosition
     * @cfg {String} Определяет положение легенды по вертикали.
     * @variant top
     * @variant bottom
     * @default top
     */
    legendVerticalPosition?: TLegendVerticalPosition;

    /**
     * @name Controls-Graphs/_base/interfaces/ILegend#legendHorizontalAlignment
     * @cfg {String} Определяет горизонтальное выравнивание легенды.
     * @variant start
     * @variant center
     * @variant end
     * @default center
     */
    legendHorizontalAlignment?: THorizontalAlignment;
}
