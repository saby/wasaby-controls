/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';

/**
 * Размеры частей скроллируемой области.
 * Интерфейс должен быть полный, но не избыточный - если какой-то размер можно
 * вычислить на основании других, то его не нужно хранить.
 * Расчет делается в Controls/_columnScrollReact/common/helpers
 * @private
 */
export interface IColumnScrollWidths {
    /**
     * Ширина контейнера таблицы.
     */
    viewPortWidth: number;

    /**
     * Ширина контента таблицы, включая зафиксированные части.
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

/**
 * Утилитарный интерфейс, описывающий контекст, который обогащен ссылкой на самого себя.
 * Данная ссылка должна использоваться исключительно в обработчиках событий, которые используют контекст.
 * Если значение контекста создается в хуке, то и ссылку обновлять можно только в хуках, т.к. код функционального компонента вызывается не
 * только при перерисовках и может быть отброшен React, тогда ссылка обновится, перерисовка отбросится и ссылка будет битой.
 * @private
 * @example
 * export interface IContext extends IContextWithSelfRef<IContext> { ... }
 *
 * // Правильно
 * export function ContextProvider() {
 *     const contextRefForHandlersOnly = React.useRef<IContext>();
 *
 *     const contextValue = React.useMemo<IContext>(() => {
 *         const value = {
 *             contextRefForHandlersOnly,
 *             ...
 *         };
 *
 *         contextRefForHandlersOnly.current = value;
 *
 *         return value;
 *     }, [...]);
 *
 *     return <Context.Provider value={contextValue}>...</Context.Provider>;
 * }
 */
// TODO: Убрать контекст, перевести оставшихся пользователей на редьюсер, вроде это должно решить проблему.
export interface IContextWithSelfRef<T> {
    /**
     * @cfg contextRefForHandlersOnly ссылка на контекст.
     */
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}
