import ISingleItem from './ISingleItem';

/**
 * Интерфейс, описывающий функцию-форматер данных, которые передаются в график.
 * @public
 */
export default interface IValueFormatter {
    /**
     * Функция-форматер данных.
     */
    valueFormatter?: (dataItem: ISingleItem, concreteParams: object) => ISingleItem;
}
