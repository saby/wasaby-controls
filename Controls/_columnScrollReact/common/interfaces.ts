import * as React from 'react';

export interface IColumnScrollWidths {
    // Ширина контейнера таблицы.
    viewPortWidth: number;

    // Ширина контента таблицы.
    contentWidth: number;

    // Ширина скролируемой части таблицы.
    fixedWidth: number;
    // Остальное можно рассчитать из этих. Это делается в ./resources/helpers
}

// TODO: Расписать что это, для чего и как это реализовывать.
//  Написать что если значение контекста создается в хуке, то и ссылку обновлять можно только в хуках, т.к. код функционального компонента вызывается не
//  только при перерисовках и может быть отброшен реактом, тогда ссылка обновится, перерисовка отбросится и ссылка будет битой.
//
//
// export interface IContext extends IContextWithSelfRef<IContext> {
//     ...
// }
//
// Правильно
// export function ContextProvider(props: IContextProviderProps) {
//     const contextRefForHandlersOnly = React.useRef<IContext>();
//
//     const contextValue = React.useMemo<IContext>(() => {
//         const value = {
//             contextRefForHandlersOnly,
//             ...
//         };
//
//         contextRefForHandlersOnly.current = value;
//
//         return value;
//     }, [...]);
//
//     return <Context.Provider value={contextValue}>...</Context.Provider>;
// }
//
// Неправильно
// export function ContextProvider(props: IContextProviderProps) {
//     const contextRefForHandlersOnly = React.useRef<IContext>();
//
//     const contextValue = React.useMemo<IContext>(() => {
//         const value = {
//             contextRefForHandlersOnly,
//             ...
//         };
//         return value;
//     }, [...]);
//
//     contextRefForHandlersOnly.current = contextValue;
//     return <Context.Provider value={contextValue}>...</Context.Provider>;
// }
export interface IContextWithSelfRef<T> {
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}
