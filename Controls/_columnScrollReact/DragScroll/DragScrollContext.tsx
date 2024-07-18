/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { IDragScrollParams as IDragScrollControllerProps } from 'Controls/dragScroll';
import { IContextWithSelfRef } from '../common/interfaces';

export interface IDragScrollContext extends IContextWithSelfRef<IDragScrollContext> {
    contextRefForHandlersOnly: React.MutableRefObject<IDragScrollContext>;

    isEnabled: boolean;
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
