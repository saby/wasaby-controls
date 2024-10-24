/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import type { IAbstractRenderEventHandlers } from '../interface/IAbstractRenderEventHandlers';

export type TUseRenderEventHandlersHook<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
> = (props: TViewCommandHandlers) => TRenderEventHandlers;

export function withRenderEventHandlers<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TOuter,
>(
    Component: React.ComponentType<TOuter & TRenderEventHandlers>,
    useRenderHandlersConverterHook: TUseRenderEventHandlersHook<
        TViewCommandHandlers,
        TRenderEventHandlers
    >
): React.ComponentType<TOuter & TViewCommandHandlers> {
    function Composed(props: TOuter & TViewCommandHandlers) {
        const handlers = useRenderHandlersConverterHook(props);
        return <Component {...props} {...handlers} />;
    }

    Composed.displayName = `withRenderEventHandlers(${Component.displayName || Component.name})`;

    return Composed;
}
