import ISingleItem from './ISingleItem';

/**
 * Интерфейс, о
 */
export default interface IValueFormatter {
    valueFormatter?: (dataItem: ISingleItem, concreteParams: object) => number;
}
