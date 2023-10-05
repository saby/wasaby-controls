/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { IDragScrollParams as IDragScrollControllerProps } from 'Controls/dragScroll';
import { IContextWithSelfRef } from '../common/interfaces';

export interface IDragScrollContext extends IContextWithSelfRef<IDragScrollContext> {
    contextRefForHandlersOnly: React.MutableRefObject<IDragScrollContext>;

    isOverlayShown: boolean;

    startDragScroll: (e: React.MouseEvent | React.TouchEvent) => void;
    moveDragScroll: (e: React.MouseEvent | React.TouchEvent) => void;
    stopDragScroll: () => void;
    setStartDragNDropCallback: (cb: IDragScrollControllerProps['startDragNDropCallback']) => void;
    setCanStartDragNDropCallback: (
        cb: IDragScrollControllerProps['canStartDragNDropCallback']
    ) => void;
}

export const DragScrollContext = React.createContext<IDragScrollContext>(undefined);
DragScrollContext.displayName = 'Controls/columnScrollReact:DragScrollContext';
