/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import ColumnsCollection from 'Controls/_columns/display/Collection';
import IColumnsStrategy from 'Controls/_columns/interface/IColumnsStrategy';
import { Model } from 'Types/entity';

/**
 * Стратегия подсчета столбца, который высчитывается исходя из фиксированного числа колонок
 * @private
 */
export default class Fixed implements IColumnsStrategy {
    calcColumn(collection: ColumnsCollection<Model>, index: number): number {
        if (index < collection.getCollection().getCount()) {
            const item = collection.getCollection().at(index);
            return (item.get && item.get(collection.getColumnProperty() || 'column')) || 0;
        }
        return 0;
    }
}
