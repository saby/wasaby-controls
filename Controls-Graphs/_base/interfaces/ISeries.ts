import ISingleSeriesItem from './ISingleSeriesItem';

/**
 * Интерфейс, описывающий конфигурацию серий данных.
 * @public
 * @interface Controls-Graphs/_base/interfaces/ISeries
 */
export default interface ISeries {
    /**
     * @name Controls-Graphs/_base/interfaces/ISeries#series
     * @cfg {ISingleSeriesItem[]} Массив с конфигурациями серий.
     */
    series: ISingleSeriesItem[];
}
