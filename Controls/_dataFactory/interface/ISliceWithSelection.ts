import { TSelectionRecordContent } from 'Controls/interface';

export interface ISliceWithSelection {
    readonly '[ISliceWithSelection]': true;
    getSelection(): Promise<TSelectionRecordContent>;
}

export function isSliceWithSelection(slice: object): slice is ISliceWithSelection {
    return !!(slice && (slice as ISliceWithSelection)['[ISliceWithSelection]']);
}
