import type { IAbstractListState } from 'Controls-DataEnv/abstractList';

export type TState = Pick<IAbstractListState, 'viewMode' | 'isLatestInteractorVersion'>;

export interface TDependencyDescriptor<T extends keyof TState> {
    prop: T;
    value: TState[T][] | ((state: TState) => boolean);
}

export type TUI_Dependencies = Record<string, TDependencyDescriptor<keyof TState>[]>;
