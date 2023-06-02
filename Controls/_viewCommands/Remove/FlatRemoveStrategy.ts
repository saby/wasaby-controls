import { RecordSet } from 'Types/collection';
import { ISelectionObject } from 'Controls/interface';

export interface IFlatRemoveStrategyOptions {
    keyProperty?: string;
    selection: ISelectionObject;
    silent?: boolean;
}

export default class FlatRemoveStrategy {
    remove(items: RecordSet, options: IFlatRemoveStrategyOptions): void {
        this._removeFromRecordSet(items, options);
    }

    protected _removeFromRecordSet(
        items: RecordSet,
        { selection, silent }: IFlatRemoveStrategyOptions
    ): void {
        FlatRemoveStrategy._setEventRaising(false, items, silent);
        let item;
        selection.selected.forEach((key) => {
            item = items.getRecordById(key);
            if (item) {
                items.remove(item);
            }
        });
        FlatRemoveStrategy._setEventRaising(true, items, silent);
    }

    private static _setEventRaising(
        enabled: boolean,
        items: RecordSet,
        silent: boolean
    ): void {
        if (!silent) {
            items.setEventRaising(enabled, true);
        }
    }
}
