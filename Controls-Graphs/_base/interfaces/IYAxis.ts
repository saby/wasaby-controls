import IDisplayFormatter from './IDisplayFormatter';

/**
 * Интерфейс, описывающий опции для конфигурации оси Y.
 * @public
 */
export default interface IYAxis extends IDisplayFormatter {
    /**
     * Объект или массив объектов с конфигурацией {@link https://api.highcharts.com/highcharts/yAxis оси Y}.
     */
    yAxis?: object[] | object;
}
