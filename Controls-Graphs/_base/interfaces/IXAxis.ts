import IDisplayFormatter from './IDisplayFormatter';

/**
 * Интерфейс, описывающий опции для конфигурации оси X.
 * @public
 */
export default interface IXAxis extends IDisplayFormatter {
    /**
     * Объект с конфигурацией {@link https://api.highcharts.com/highcharts/xAxis оси X}.
     */
    xAxis?: object;
}
