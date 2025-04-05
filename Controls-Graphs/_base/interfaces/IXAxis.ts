import IDisplayFormatter from './IDisplayFormatter';

/**
 * @public
 * @interface Controls-Graphs/_base/interfaces/IXAxis
 * Интерфейс, описывающий опции для конфигурации оси X.
 */
export default interface IXAxis extends IDisplayFormatter {
    /**
     * @name Controls-Graphs/_base/interfaces/IXAxis#xAxis
     * @cfg {object} Объект с конфигурацией {@link https://api.highcharts.com/highcharts/xAxis оси X}.
     */
    xAxis?: object;
}
