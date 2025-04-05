import IDisplayFormatter from './IDisplayFormatter';

/**
 * @public
 * @interface Controls-Graphs/_base/interfaces/IYAxis
 * Интерфейс, описывающий опции для конфигурации оси Y.
 */
export default interface IYAxis extends IDisplayFormatter {
    /**
     * @name Controls-Graphs/_base/interfaces/IYAxis#yAxis
     * @cfg {object} Объект или массив объектов с конфигурацией {@link https://api.highcharts.com/highcharts/yAxis оси Y}.
     */
    yAxis?: object[] | object;
}
