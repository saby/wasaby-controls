/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TKey, IMultiBaseSourceConfig, IBaseSourceConfig } from 'Controls/interface';

export interface IListSavedState {
    searchValue?: string;
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    expandedItems?: TKey[];
    navigationSourceConfig?: IBaseSourceConfig | IMultiBaseSourceConfig;
    root?: TKey;
    markedKey?: TKey;
    count?: number | null;
}

const LocalMemoryState: Record<string, IListSavedState> = {};

export function saveState(id: string, state: IListSavedState): void {
    LocalMemoryState[id] = state;
}

export function getState(id: string): IListSavedState | undefined {
    return LocalMemoryState[id];
}
