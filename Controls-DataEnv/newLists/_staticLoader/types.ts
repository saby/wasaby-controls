import type { IAbstractListState } from 'Controls-DataEnv/abstractList';

export interface TDependencyDescriptor<T extends keyof IAbstractListState> {
    prop: T;
    value: IAbstractListState[T][] | ((value: IAbstractListState[T]) => boolean);
}

export type TUI_Dependencies = Record<string, TDependencyDescriptor<keyof IAbstractListState>[]>;
