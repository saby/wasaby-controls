import type { CrudEntityKey } from 'Types/source';
import type { TSelectionRecordContent } from 'Controls/interface';
import type { TFilter, TKey, TSingleAxisDirection } from 'Controls-DataEnv/interface';

/**
 * API абстрактного списочного слайса.
 * Включает в себя непосредственно API ViewModel'и списка и API списочной раскладки (ПМО, фильтрация и т.д.).
 */
export interface IAbstractListAPI extends IListOwnAPI, IListEnvAPI {}

/**
 * API списочной раскладки.
 */
export interface IListEnvAPI {
    openOperationsPanel(): void;
    closeOperationsPanel(): void;

    openFilterDetailPanel(): void;
    closeFilterDetailPanel(): void;
}

/**
 * API ViewModel'и списка.
 */
export interface IListOwnAPI {
    connect(): void;
    disconnect(): void;

    select(key: CrudEntityKey, direction?: TSingleAxisDirection): void;

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
