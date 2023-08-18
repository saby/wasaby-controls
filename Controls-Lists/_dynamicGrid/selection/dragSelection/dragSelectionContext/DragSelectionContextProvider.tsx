import * as React from 'react';
import { useHandler } from 'Controls/Hooks/useHandler';
import { DragSelectionContext, IDragSelectionContext } from './DragSelectionContext';
import { GridSelectionContext } from '../../selectionContext/gridSelectionContext/GridSelectionContext';
import { DragSelectionController, IDragSelectionControllerProps } from '../DragSelectionController';
import { TSelectionBounds } from '../../SelectionModel';
import { unstable_batchedUpdates } from 'react-dom';

export interface IDragSelectionContextProviderProps
    extends Omit<IDragSelectionControllerProps, 'onDragEnd'> {
    children: JSX.Element;
}

export function DragSelectionContextProvider(
    props: IDragSelectionContextProviderProps
): JSX.Element {
    const gridSelectionContext = React.useContext(GridSelectionContext);
    const contextRefForHandlersOnly = React.useRef<IDragSelectionContext>();
    const [bounds, setBounds] = React.useState<TSelectionBounds>();

    const onDragEnd = useHandler(
        React.useCallback<IDragSelectionControllerProps['onDragEnd']>(
            (partialPlainSelection) => {
                const gridSelectionCtx = gridSelectionContext.contextRefForHandlersOnly.current;
                unstable_batchedUpdates(() => {
                    gridSelectionCtx.changeSelection(bounds.plainSelection, partialPlainSelection);
                    gridSelectionCtx.showCellsSelection(bounds.startItemKey, bounds.startColumnKey);
                    setBounds(undefined);
                });
            },
            [bounds]
        )
    );

    const controller = React.useMemo(() => {
        return new DragSelectionController({
            ...props,
            onDragEnd,
        });
    }, []);

    React.useLayoutEffect(() => {
        return () => {
            controller.destroy();
        };
    }, []);

    const startDrag = React.useCallback<IDragSelectionContext['startDrag']>(
        (mouseEvent, selectionBounds, direction) => {
            const gridSelectionCtx = gridSelectionContext.contextRefForHandlersOnly.current;
            controller.manageStart(mouseEvent, selectionBounds, direction);
            unstable_batchedUpdates(() => {
                gridSelectionCtx.hideCellsSelection(
                    selectionBounds.startItemKey,
                    selectionBounds.startColumnKey
                );
                setBounds(selectionBounds);
            });
        },
        []
    );

    const moveDrag = React.useCallback<IDragSelectionContext['moveDrag']>((mouseEvent) => {
        controller.manageMove(mouseEvent);
    }, []);

    const dragSelectionContextValue = React.useMemo<IDragSelectionContext>(() => {
        const value: IDragSelectionContext = {
            contextRefForHandlersOnly,
            startDrag,
            moveDrag,
        };
        value.contextRefForHandlersOnly.current = value;
        return value;
    }, [startDrag, moveDrag]);

    return (
        <DragSelectionContext.Provider value={dragSelectionContextValue}>
            {props.children}
        </DragSelectionContext.Provider>
    );
}

const DragSelectionContextProviderMemo = React.memo(DragSelectionContextProvider);
export default DragSelectionContextProviderMemo;
