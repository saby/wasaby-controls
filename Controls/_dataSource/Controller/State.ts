/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TKey } from 'Controls/interface';
export interface IDataSourceControllerState {
    searchValue?: string;
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    expandedItems?: TKey[];
}

const STATE = {};

export function saveState(id: string, state: IDataSourceControllerState): void {
    STATE[id] = state;
}

export function getState(id: string): IDataSourceControllerState | void {
    return STATE[id];
}
