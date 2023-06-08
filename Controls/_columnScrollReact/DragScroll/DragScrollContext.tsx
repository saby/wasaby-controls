import * as React from 'react';
import { IDragScrollParams as IDragScrollControllerProps } from 'Controls/dragScroll';

export interface IDragScrollContext {
    contextRefForHandlersOnly: React.MutableRefObject<IDragScrollContext>;

    isOverlayShown: boolean;

    startDragScroll: (e: React.MouseEvent | React.TouchEvent) => void;
    moveDragScroll: (e: React.MouseEvent | React.TouchEvent) => void;
    stopDragScroll: () => void;
    setStartDragNDropCallback: (
        cb: IDragScrollControllerProps['startDragNDropCallback']
    ) => void;
    setCanStartDragNDropCallback: (
        cb: IDragScrollControllerProps['canStartDragNDropCallback']
    ) => void;
}

export const DragScrollContext =
    React.createContext<IDragScrollContext>(undefined);
DragScrollContext.displayName = 'Controls/columnScrollReact:DragScrollContext';
