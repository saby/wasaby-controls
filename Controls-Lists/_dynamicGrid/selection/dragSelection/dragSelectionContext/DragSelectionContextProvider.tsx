/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { useHandler } from 'Controls/hooks';
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
    const [isDragging, setIsDragging] = React.useState(false);

    const onDragEnd = useHandler(
        React.useCallback<IDragSelectionControllerProps['onDragEnd']>(
            (partialPlainSelection) => {
                const gridSelectionCtx = gridSelectionContext.contextRefForHandlersOnly.current;
                unstable_batchedUpdates(() => {
                    gridSelectionCtx.changeSelection(bounds.plainSelection, partialPlainSelection);
                    setBounds(undefined);
                    setIsDragging(false);
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
        (mouseEvent, selectionBounds) => {
            controller.manageStart(mouseEvent, selectionBounds);
            unstable_batchedUpdates(() => {
                setBounds(selectionBounds);
                setIsDragging(true);
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
            isDragging,
        };
        value.contextRefForHandlersOnly.current = value;
        return value;
    }, [startDrag, moveDrag, isDragging]);

    return (
        <DragSelectionContext.Provider value={dragSelectionContextValue}>
            {props.children}
        </DragSelectionContext.Provider>
    );
}

const DragSelectionContextProviderMemo = React.memo(DragSelectionContextProvider);
export default DragSelectionContextProviderMemo;
