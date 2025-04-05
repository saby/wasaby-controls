import ISingleItem from './ISingleItem';

/**
 * @public
 * @interface Controls-Graphs/_base/interfaces/IValueFormatter
 * Интерфейс, описывающий функцию-форматер данных, которые передаются в график.
 */
export default interface IValueFormatter {
    /**
     * @name Controls-Graphs/_base/interfaces/IValueFormatter#valueFormatter
     * @cfg {Function} Функция-форматер данных.
     * @param dataItem ISingleItem[]
     * @param concreteParams object
     */
    valueFormatter?: (dataItem: ISingleItem, concreteParams: object) => ISingleItem;
}
