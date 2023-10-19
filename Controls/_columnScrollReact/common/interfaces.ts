import * as React from 'react';

/**
 * Размеры частей скроллируемой области.
 * Интерфейс должен быть полный, но не избыточный.
 * Если какой-то размер можно вычислить на основании других, то его не нужно хранить.
 * Расчет делается в Controls/_columnScrollReact/common/helpers
 * @private
 */
export interface IColumnScrollWidths {
    /**
     * Ширина контейнера таблицы.
     */
    viewPortWidth: number;

    /**
     * Ширина контента таблицы.
     */
    contentWidth: number;

    /**
     * Ширина зафиксированной части в начале.
     */
    startFixedWidth: number;

    /**
     * Ширина зафиксированной части в конце.
     */
    endFixedWidth: number;
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
