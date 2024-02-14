import { TKey, TSelectionType } from 'Controls/interface';

export interface ISelectionState {
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    selectionType?: TSelectionType;
}
