import {
    DragScrollController as DragScroll,
    DRAG_SCROLL_JS_SELECTORS,
} from 'Controls/columnScroll';

describe('Controls/columnScroll/dragScroll', () => {
    it('should not prevent default on touch start', () => {
        const dragScroll = new DragScroll({
            canStartDragScrollCallback: (target: HTMLElement) => {
                return !target.closest(
                    DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE
                );
            },
        });
        const event = {
            preventDefault: () => {
                return void 0;
            },
            touches: [
                {
                    clientX: 0,
                    clientY: 0,
                },
            ],
            target: {
                closest: (selector) => {
                    return selector === 'controls-DragNDrop__notDraggable'
                        ? true
                        : false;
                },
            },
        };
        expect(() => {
            const isStarted = dragScroll.startDragScroll(event);
            expect(isStarted).toBe(true);
        }).not.toThrow();
    });
});
