import ISingleSeriesItem from './ISingleSeriesItem';

/**
 * Интерфейс, описывающий конфигурацию серий данных.
 * @public
 */
export default interface ISeries {
    /**
     * Массив с конфигурациями серий.
     */
    series: ISingleSeriesItem[];
}
