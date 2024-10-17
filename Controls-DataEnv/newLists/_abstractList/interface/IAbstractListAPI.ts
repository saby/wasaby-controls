/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { TFilter, TSelectionRecordContent, MarkerDirection, TKey } from 'Controls/interface';

export interface IAbstractListAPI {
    select(key: CrudEntityKey, direction?: MarkerDirection): void;

    selectAll(): void;

    resetSelection(): void;

    invertSelection(): void;

    mark(key: TKey | undefined): void;

    changeRoot(key: TKey): void;

    expand(
        key: CrudEntityKey,
        params?: {
            markItem?: boolean;
        }
    ): void;

    collapse(
        key: CrudEntityKey,
        params?: {
            markItem?: boolean;
        }
    ): void;

    next(): void;

    prev(): void;

    getSelection(): Promise<TSelectionRecordContent>;

    search(searchValue: string): void;

    setFilter(filter: TFilter): void;
}
