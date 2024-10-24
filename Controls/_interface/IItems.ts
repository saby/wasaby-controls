/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';

export interface IItemsOptions<T> {
    items?: RecordSet<T>;
}

/**
 * Ключ записи в списках.
 * Принимает значения string, number или null.
 * @typedef TKey
 */
export type TKey = CrudEntityKey | null;

/**
 * Набор записей.
 *
 * @public
 */
export default interface IItems {
    readonly '[Controls/_interface/IItems]': boolean;
}
/**
 * @name Controls/_interface/IItems#items
 * @cfg {RecordSet.<Controls/toolbars:IToolBarItem>} Определяет набор записей по которым строится контрол.
 * @demo Controls-demo/Toolbar/Items/Index
 */
