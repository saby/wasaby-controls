import * as React from 'react';
import { TSelectionBounds } from '../../SelectionModel';
import { IContextWithSelfRef } from '../../shared/IContextWithSelfRef';
import { TResizerDirection } from '../shared/types';

export interface IDragSelectionContext extends IContextWithSelfRef<IDragSelectionContext> {
    startDrag: (
        mouseEvent: React.MouseEvent,
        selectionBounds: TSelectionBounds,
        direction: TResizerDirection
    ) => void;
    moveDrag: (mouseEvent: React.MouseEvent) => void;
}

export const DragSelectionContext = React.createContext<IDragSelectionContext>(undefined);
DragSelectionContext.displayName = 'Controls/dynamicGrid:DragSelectionContext';
