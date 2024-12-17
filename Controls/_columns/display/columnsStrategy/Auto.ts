/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import ColumnsCollection from 'Controls/_columns/display/Collection';
import IColumnsStrategy from 'Controls/_columns/interface/IColumnsStrategy';
import { Model } from 'Types/entity';

/**
 * Стратегия подсчета столбца, который высчитывается автоматически
 * @private
 */
export default class Auto implements IColumnsStrategy {
    calcColumn(collection: ColumnsCollection<Model>, index: number, columnsCount: number): number {
        return index % columnsCount;
    }
}
