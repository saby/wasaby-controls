/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TKey } from 'Controls/interface';

export interface IPromiseSelectableOptions {
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
}

/**
 * Интерфейс для контролов, где одновременно можно выбрать несколько элементов и количество выбранных элементов неизвестно.
 * @public
 * @see Controls/_interface/ISingleSelectable
 * @see Controls/interface/IMultiSelectable
 */
export default interface IPromiseSelectable {
    readonly '[Controls/_interface/IPromiseSelectable]': boolean;
}
