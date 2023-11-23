/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import ColumnsCollection from 'Controls/_columns/display/Collection';
import IColumnsStrategy from 'Controls/_columns/interface/IColumnsStrategy';
import { Model } from 'Types/entity';

/**
 * Стратегия подсчета столбца, который высчитывается с учетом заполненности столбцов
 * @private
 */
export default class Adaptive implements IColumnsStrategy {
    calcColumn(collection: ColumnsCollection<Model>): number {
        return collection.getSmallestColumnIndex();
    }
}
