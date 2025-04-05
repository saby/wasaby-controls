import * as React from 'react';

interface IDraggingProcessState {
    startEventKey: string | null;
    buttonPosition: 'left' | 'right' | null;
    eventColor: string | null;
}

interface UseDragDependencyProps {
    onAddEventDependency: (
        eventFrom: string,
        eventTo: string,
        buttonPosition: 'left' | 'right'
    ) => void;
}

const CLASS_EVENT_CELL = 'ControlsLists-dynamicGrid__eventCell';

export const useDragDependency = ({ onAddEventDependency }: UseDragDependencyProps) => {
    const [eventInDraggingProcess, setEventInDraggingProcess] =
        React.useState<IDraggingProcessState>({
            startEventKey: null,
            buttonPosition: null,
            eventColor: null,
        });

    const eventInDraggingProcessRef = React.useRef(eventInDraggingProcess);
    React.useEffect(() => {
        eventInDraggingProcessRef.current = eventInDraggingProcess;
    }, [eventInDraggingProcess]);

    const handleDependencyButtonMouseDown = React.useCallback(
        (eventKey: string, buttonPosition: 'left' | 'right', eventColor: string) => {
            setEventInDraggingProcess({
                startEventKey: eventKey,
                buttonPosition,
                eventColor,
            });
        },
        []
    );

    const handleMouseUp = React.useCallback(
        (event: MouseEvent) => {
            const currentState = eventInDraggingProcessRef.current;
            if (currentState.startEventKey && currentState.buttonPosition) {
                const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
                let eventCell = null;
                elementsAtPoint.forEach((el) => {
                    const eventRender = el.closest(
                        '.ControlsLists-timelineGrid__Event:not(.ControlsLists-timelineGrid__Event_non-interactive)'
                    );
                    if (eventRender) {
                        eventCell = eventRender.closest(`.${CLASS_EVENT_CELL}`);
                    }
                });
                if (eventCell) {
                    const { startEventKey, buttonPosition } = currentState;
                    const eventTo = eventCell?.getAttribute('data-key');

                    onAddEventDependency(startEventKey, eventTo, buttonPosition);
                }
                setEventInDraggingProcess({
                    startEventKey: null,
                    buttonPosition: null,
                    eventColor: null,
                });
            }
        },
        [onAddEventDependency]
    );

    React.useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    const hasDragStartEventKey = React.useCallback(
        () => eventInDraggingProcess.startEventKey,
        [eventInDraggingProcess.startEventKey]
    );

    return {
        eventInDraggingProcess,
        handleDependencyButtonMouseDown,
        hasDragStartEventKey,
    };
};
