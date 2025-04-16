/**
 *
 */
export type TObjDescriptor<TState extends Record<string, unknown>, TProp extends keyof TState> = {
    prop: TProp;
    value: TState[TProp][];
};

/**
 *
 */
export type TFnDescriptor<TState extends Record<string, unknown>> = (state: TState) => boolean;

/**
 * Дескриптор предиката, который определяет нужна ли библиотека для данного состояния.
 */
export type TDependencyDescriptor<T extends Record<string, unknown>> =
    | TObjDescriptor<T, keyof T>
    | TFnDescriptor<T>;

/**
 * Описание типа объекта, в котором перечислены зависимости библиотек от некоторого состояния.
 */
export type TUI_Dependencies<T extends Record<string, unknown>> = Record<
    string,
    TDependencyDescriptor<T>[]
>;
