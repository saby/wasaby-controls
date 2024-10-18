/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TSelectionRecordContent } from 'Controls/interface';

/**
 * Интерфейс состояния выделения.
 * @interface Controls/_dataFactory/interface/ISliceWithSelection
 * @public
 */
export interface ISliceWithSelection {
    readonly '[ISliceWithSelection]': true;
    getSelection(): Promise<TSelectionRecordContent>;
}

export function isSliceWithSelection(slice: object): slice is ISliceWithSelection {
    return !!(slice && (slice as ISliceWithSelection)['[ISliceWithSelection]']);
}
