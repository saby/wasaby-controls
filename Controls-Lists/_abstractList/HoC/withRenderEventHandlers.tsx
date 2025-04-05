/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { TWithInteractorCommandsProvidedProps } from './withInteractorCommands';
import type { TWithInteractorProvidedProps } from './withInteractor';
import type { IAbstractRenderEventHandlers } from '../interface/IAbstractRenderEventHandlers';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';

//# region Тип хука для получения обработчиков собыий
/**
 * Параметры хука, получающего обработчики событий render'а.
 * @see TUseRenderEventHandlersHook
 */
type TUseRenderEventHandlersHookProps<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
> = TWithInteractorProvidedProps<TListAPI, TListState> &
    TWithInteractorCommandsProvidedProps<TViewCommandHandlers>;

/**
 * Тип хука, получающего обработчики событий render'а.
 */
// TODO: Порядок дженериков должен идти по убыванию частоты
//  переопределения, все должны иметь публичные значения.
export type TUseRenderEventHandlersHook<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
> = (
    props: TUseRenderEventHandlersHookProps<TListAPI, TListState, TViewCommandHandlers>
) => TRenderEventHandlers;
//# endregion Тип хука для получения обработчиков собыий

/**
 * Опции, поставлямые HoC'ом withRenderEventHandlers.
 * Содержит обработчики событий рендера.
 * В широком смылсе это ассоциации между "глупыми" событиями рендеров и "умными" командами.
 */
export type TWithRenderEventHandlersProvidedProps<
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
> = {
    renderEventHandlers: TRenderEventHandlers;
};

/**
 * HOC, который передает дочернем компоненту обработчики низкоуровневых событий (событий render'a).
 * @param Component Оборачиваемый компонент, рендер списка или его композиция.
 * @param useRenderHandlersConverterHook Хук, который получает обработчики событий render'а.
 */
export function withRenderEventHandlers<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TOuter extends TUseRenderEventHandlersHookProps<TListAPI, TListState, TViewCommandHandlers>,
>(
    Component: React.ComponentType<
        TOuter & TWithRenderEventHandlersProvidedProps<TRenderEventHandlers>
    >,
    useRenderHandlersConverterHook: TUseRenderEventHandlersHook<
        TListAPI,
        TListState,
        TRenderEventHandlers,
        TViewCommandHandlers
    >
) {
    function Composed(props: TOuter) {
        const renderEventHandlers = useRenderHandlersConverterHook(props);
        return (
            <Component
                {...(props as unknown as TOuter)}
                renderEventHandlers={renderEventHandlers}
            />
        );
    }

    Composed.displayName = `withRenderEventHandlers(${Component.displayName || Component.name})`;

    return Composed;
}

export default withRenderEventHandlers;
