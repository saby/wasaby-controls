import { IListState } from 'Controls-DataEnv/list';

/**
 * Тип аргументов функции для преобразования полей стейта в читаемые/сериализуемые структуры
 * */
export type TChangeMapperArgs<TState extends IListState = IListState> = {
    [K in keyof TState]-?: [key: K, value: TState[K]];
}[keyof TState];

/**
 * Тип функции для преобразования полей стейта в читаемые/сериализуемые структуры
 * */
export type TChangeMapper<TState extends IListState = IListState> = (
    ...args: TChangeMapperArgs<TState>
) => unknown;
