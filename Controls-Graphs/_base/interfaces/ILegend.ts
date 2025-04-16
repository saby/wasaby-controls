export type TLegendVerticalPosition = 'top' | 'bottom';
export type THorizontalAlignment = 'start' | 'end' | 'center';

/**
 * Интерфейс, опиывающий опции, с помощью которых можно сконфигурировать легенду.
 * @public
 */
export default interface ILegend {
    /**
     * Определяет наличие легенды у графика.
     * @default true
     */
    legendVisible?: boolean;

    /**
     * Определяет положение легенды по вертикали.
     * @variant top
     * @variant bottom
     * @default top
     */
    legendVerticalPosition?: TLegendVerticalPosition;

    /**
     * Определяет горизонтальное выравнивание легенды.
     * @variant start
     * @variant center
     * @variant end
     * @default center
     */
    legendHorizontalAlignment?: THorizontalAlignment;
}
