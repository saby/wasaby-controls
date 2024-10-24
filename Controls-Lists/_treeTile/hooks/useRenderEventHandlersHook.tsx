/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractViewCommandHandlers } from 'Controls-Lists/abstractList';

import type { ITileRenderEventHandlers } from '../interface/IRenderEventHandlers';

export function useRenderEventHandlers<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends ITileRenderEventHandlers,
>(props: TViewCommandHandlers): TRenderEventHandlers {
    const handlers: ITileRenderEventHandlers = {
        onItemClick: (item, e) => props.onItemClick(e, item),
    } as ITileRenderEventHandlers;
    return handlers as TRenderEventHandlers;
}
