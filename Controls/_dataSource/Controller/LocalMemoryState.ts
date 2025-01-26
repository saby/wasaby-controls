/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    TKey,
    IBasePositionSourceConfig,
    IMultiBaseSourceConfig,
    IBasePageSourceConfig,
} from 'Controls/interface';

export interface IListSavedState {
    searchValue?: string;
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    expandedItems?: TKey[];
    navigationSourceConfig?:
        | Partial<IBasePositionSourceConfig | IBasePageSourceConfig>
        | IMultiBaseSourceConfig;
    root?: TKey;
    markedKey?: TKey;
}

const LocalMemoryState: Record<string, IListSavedState> = {};

export function saveState(id: string, state: IListSavedState): void {
    LocalMemoryState[id] = state;
}

export function getState(id: string): IListSavedState | void {
    return LocalMemoryState[id];
}
