/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import {
    DragScrollContext,
    IDragScrollContext,
} from 'Controls/_columnScrollReact/DragScroll/DragScrollContext';
import { ColumnScrollContext } from 'Controls/_columnScrollReact/context/ColumnScrollContext';
import DragScrollOverlayComponentConsumer, {
    DragScrollOverlayComponent,
} from 'Controls/_columnScrollReact/DragScroll/OverlayComponent';

import * as React from 'react';

import { renderDragScrollOverlayComponent } from '../forTestsOnly/helpers';
import { fireEvent, waitFor } from '@testing-library/react';

function FakeContextProviderForOverlay(
    props: {
        children: JSX.Element;
    } & Omit<
        IDragScrollContext,
        'setCanStartDragNDropCallback' | 'setStartDragNDropCallback' | 'contextRefForHandlersOnly'
        >
): JSX.Element {
    const contextRefForHandlersOnly = React.useRef<IDragScrollContext>();

    const context: IDragScrollContext = React.useMemo(() => {
        const value: IDragScrollContext = {
            contextRefForHandlersOnly,
            setCanStartDragNDropCallback: () => {},
            setStartDragNDropCallback: () => {},
            isOverlayShown: props.isOverlayShown,
            startDragScroll: props.startDragScroll,
            moveDragScroll: props.moveDragScroll,
            stopDragScroll: props.stopDragScroll,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, []);
    return (
        <ColumnScrollContext.Provider value={{ isScrollbarDragging: false }}>
            <DragScrollContext.Provider value={context}>{props.children}</DragScrollContext.Provider>
        </ColumnScrollContext.Provider>
    );
}

describe('ControlsUnit/columnScrollReact/DragScroll/OverlayComponent', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('overlay render. should add hidden/visible class name ', () => {
        const { asFragment, rerender } = renderDragScrollOverlayComponent(
            <DragScrollOverlayComponent
                isOverlayShown={false}
                moveDragScroll={jest.fn()}
                stopDragScroll={jest.fn()}
            />,
            { container }
        );
        expect(asFragment()).toMatchSnapshot();

        rerender(
            <DragScrollOverlayComponent
                isOverlayShown={true}
                moveDragScroll={jest.fn()}
                stopDragScroll={jest.fn()}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should fire events on mouse events', async () => {
        expect.assertions(3);
        const onMoveDragScroll = jest.fn();
        const onStopDragScroll = jest.fn();

        const { getOverlay } = renderDragScrollOverlayComponent(
            <DragScrollOverlayComponent
                isOverlayShown={false}
                moveDragScroll={onMoveDragScroll}
                stopDragScroll={onStopDragScroll}
            />,
            { container }
        );

        const overlay = getOverlay();

        fireEvent.mouseMove(overlay);
        await waitFor(() => {
            expect(onMoveDragScroll).toBeCalledTimes(1);
        });

        fireEvent.mouseUp(overlay);
        await waitFor(() => {
            expect(onStopDragScroll).toBeCalledTimes(1);
        });

        fireEvent.mouseLeave(overlay);
        await waitFor(() => {
            expect(onStopDragScroll).toBeCalledTimes(2);
        });
    });

    describe('with context and consumer', () => {
        it('should call context methods on mouse events', async () => {
            expect.assertions(4);

            const onStartDragScroll = jest.fn();
            const onMoveDragScroll = jest.fn();
            const onStopDragScroll = jest.fn();

            const { getOverlay } = renderDragScrollOverlayComponent(
                <FakeContextProviderForOverlay
                    isOverlayShown={true}
                    startDragScroll={onStartDragScroll}
                    moveDragScroll={onMoveDragScroll}
                    stopDragScroll={onStopDragScroll}
                >
                    <DragScrollOverlayComponentConsumer />
                </FakeContextProviderForOverlay>,
                { container }
            );

            const overlay = getOverlay();
            expect(overlay).toMatchSnapshot();

            fireEvent.mouseMove(overlay);
            await waitFor(() => {
                expect(onMoveDragScroll).toBeCalledTimes(1);
            });

            fireEvent.mouseUp(overlay);
            await waitFor(() => {
                expect(onStopDragScroll).toBeCalledTimes(1);
            });

            fireEvent.mouseLeave(overlay);
            await waitFor(() => {
                expect(onStopDragScroll).toBeCalledTimes(2);
            });
        });
    });
});
