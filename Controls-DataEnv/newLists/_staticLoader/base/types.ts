type TObjDescriptor<TState extends Record<string, unknown>, TProp extends keyof TState> = {
    prop: TProp;
    value: TState[TProp][];
};

type TFnDescriptor<TState extends Record<string, unknown>> = (state: TState) => boolean;

export type TDependencyDescriptor<T extends Record<string, unknown>> =
    | TObjDescriptor<T, keyof T>
    | TFnDescriptor<T>;

export type TUI_Dependencies<T extends Record<string, unknown>> = Record<
    string,
    TDependencyDescriptor<T>[]
>;
