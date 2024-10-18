/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TKey, IBasePositionSourceConfig, IMultiBaseSourceConfig } from 'Controls/interface';

export interface IListSavedState {
    searchValue?: string;
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    expandedItems?: TKey[];
    navigationSourceConfig?: Partial<IBasePositionSourceConfig> | IMultiBaseSourceConfig;
    root?: TKey;
    markedKey?: TKey;
}

const STATE = {};

export function saveState(id: string, state: IListSavedState): void {
    STATE[id] = state;
}

export function getState(id: string): IListSavedState | void {
    return STATE[id];
}
