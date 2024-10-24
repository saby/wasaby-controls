/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { TSelectionRecordContent } from 'Controls/interface';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';

export interface IAbstractListAPI extends IListOwnAPI, IListEnvAPI {}

interface IListEnvAPI {
    openOperationsPanel(): void;
    closeOperationsPanel(): void;

    openFilterDetailPanel(): void;
    closeFilterDetailPanel(): void;
}

interface IListOwnAPI {
    connect(): void;
    disconnect(): void;

    // FIXME: создать тип для direction. Именно тип, не enum
    select(key: CrudEntityKey, direction?: 'backward' | 'forward'): void;

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

    resetSearch(): void;

    setFilter(filter: TFilter): void;
}
