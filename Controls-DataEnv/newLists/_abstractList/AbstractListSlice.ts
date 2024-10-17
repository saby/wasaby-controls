/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { Slice } from 'Controls-DataEnv/slice';
import type { IAbstractListState } from './interface/IAbstractListState';
import type { IAbstractListAPI } from './interface/IAbstractListAPI';
import type { CrudEntityKey } from 'Types/source';
import type { TFilter, TSelectionRecordContent, MarkerDirection, TKey } from 'Controls/interface';

export abstract class AbstractListSlice<TState extends IAbstractListState = IAbstractListState>
    extends Slice<TState>
    implements IAbstractListAPI
{
    abstract changeRoot(key: TKey): void;

    abstract collapse(key: CrudEntityKey, params?: { markItem?: boolean }): void;

    abstract expand(key: CrudEntityKey, params?: { markItem?: boolean }): void;

    abstract getSelection(): Promise<TSelectionRecordContent>;

    abstract invertSelection(): void;

    abstract mark(key: TKey | undefined): void;

    abstract next(): void;

    abstract prev(): void;

    abstract resetSelection(): void;

    abstract search(searchValue: string): void;

    abstract select(key: CrudEntityKey, direction?: MarkerDirection): void;

    abstract selectAll(): void;

    abstract setFilter(filter: TFilter): void;
}
