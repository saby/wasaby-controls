/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TKey, IMultiBaseSourceConfig, IBaseSourceConfig } from 'Controls/interface';

/**
 * Интерфейс состояния списка, которое хранится в оперативной памяти
 * @public
 */
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

/**
 * Список полей состояния списка, которые сохраняются в оперативную память
 * @public
 */
export type TListStateProps = (keyof IListSavedState)[];

const LocalMemoryState: Record<string, IListSavedState> = {};

/**
 * Сохраняет состояние списка в оперативную память
 * @param id
 * @param state
 */
export function saveState(id: string, state: IListSavedState): void {
    LocalMemoryState[id] = state;
}

/**
 * Возвращает сохранённое состояние списка из оперативной памяти
 * @param id
 * @param stateProps
 */
export function getState(id: string, stateProps?: TListStateProps): IListSavedState | undefined {
    const memoryState = LocalMemoryState[id];

    if (stateProps) {
        return stateProps.reduce<Record<string, unknown>>((acc, field) => {
            if (memoryState?.[field] !== undefined) {
                acc[field] = memoryState[field];
            }
            return acc;
        }, {});
    } else {
        return memoryState;
    }
}
