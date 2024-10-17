/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import ColumnsCollection from 'Controls/_columns/display/Collection';
import { Model } from 'Types/entity';

/**
 * Интерфейс стратегии подсчета столбца
 * @private
 */
export default interface IColumnsStrategy {
    calcColumn(collection: ColumnsCollection<Model>, index: number, columnsCount?: number): number;
}
