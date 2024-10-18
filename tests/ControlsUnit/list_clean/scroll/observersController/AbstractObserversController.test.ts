import jsdom = require('jsdom');
import { IObserversControllerOptions as ControllerOptions } from 'Controls/baseList';
import {
    getCollection,
    getListContainer,
    getListContainerWithNestedList,
    getListControl,
    getScrollContainerWithList,
    ListContainerUniqueClass,
    TriggerClass,
} from 'ControlsUnit/list_clean/scroll/DomUtils';
import { Logger } from 'UI/Utils';
import { TestObserverController } from 'ControlsUnit/list_clean/scroll/observersController/TestUtils';
import { DEFAULT_TRIGGER_OFFSET } from 'Controls/baseList';

function getDefaultControllerOptions(): ControllerOptions {
    return {
        listContainer: null,
        listControl: getListControl(),
        triggersQuerySelector: `.${TriggerClass}`,
        triggersPositions: { backward: 'offset', forward: 'offset' },
        triggersVisibility: { backward: true, forward: true },
        hasItemsOutsideOfRange: { backward: false, forward: false },
        triggersOffsetCoefficients: {
            backward: DEFAULT_TRIGGER_OFFSET,
            forward: DEFAULT_TRIGGER_OFFSET,
        },
        additionalTriggersOffsets: { backward: 0, forward: 0 },
        observersCallback: () => {
            return null;
        },
        viewportSize: null,
        contentSize: null,
        scrollPosition: null,
    };
}

function getController(options: Partial<ControllerOptions>): TestObserverController {
    return new TestObserverController({
        ...getDefaultControllerOptions(),
        ...options,
    });
}

describe('Controls/baseList:AbstractObserversController', () => {
    let observersCallback;
    let listContainer: HTMLElement;
    let triggers: HTMLElement[];

    let stubLoggerError;
    let oldWindow;

    const isNode = typeof document === 'undefined';

    beforeAll(() => {
        // TODO: можно было бы перевести на полноценный jsDOM, но видимо там меняется offsetParent и тесты нужно править
        if (isNode) {
            oldWindow = window;
            window = new jsdom.JSDOM('').window;
            Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
                get() {
                    return this.parentNode;
                },
                set() {
                    /* NEED */
                },
            });
        }
    });

    afterAll(() => {
        if (isNode) {
            window = oldWindow;
        }
    });

    beforeEach(() => {
        const collection = getCollection([{ key: 1 }]);
        const scrollContainer = getScrollContainerWithList(collection);
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;
        observersCallback = jest.fn();
        triggers = Array.from(listContainer.querySelectorAll(`.${TriggerClass}`)) as HTMLElement[];

        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();
    });

    describe('constructor', () => {
        it('should create intersection observer', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersObserver()).toBeTruthy();
        });

        it('should calculate offsets', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersOffsets()).toEqual({
                backward: 90,
                forward: 90,
            });
        });

        it('should apply offsets', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });

        it('should hide triggers', () => {
            getController({
                observersCallback,
                listContainer,
                triggersVisibility: { backward: false, forward: false },
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(triggers[0].style.display).toEqual('none');
            expect(triggers[1].style.display).toEqual('none');
        });

        it("triggers' offsets should include additional offsets", () => {
            const controller = getController({
                observersCallback,
                listContainer,
                additionalTriggersOffsets: { backward: 40, forward: 40 },
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersOffsets()).toEqual({
                backward: 130,
                forward: 130,
            });
        });

        it('should not create IntersectionObserver if list container is not passed', () => {
            const controller = getController({
                observersCallback,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersObserver()).toBeFalsy();
        });

        it('should not calculate offsets if list container is not passed', () => {
            const controller = getController({
                observersCallback,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersOffsets()).toEqual({
                backward: 0,
                forward: 0,
            });
        });
    });

    describe('setListContainer', () => {
        it('should find new triggers and apply visibility and offsets to them', () => {
            const controller = getController({
                observersCallback,
                triggersVisibility: { backward: false, forward: true },
                viewportSize: 300,
                contentSize: 1000,
            });
            controller.setListContainer(listContainer);

            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
            expect(triggers[0].style.display).toEqual('none');
            expect(triggers[1].style.display).toEqual('');
        });

        it('should log error if triggers count are wrong', () => {
            const collection = getCollection([{ key: 1 }]);
            const listContainer = getListContainer(collection, null, true);
            const controller = getController({
                observersCallback,
                triggersVisibility: { backward: false, forward: true },
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setListContainer(listContainer);

            expect(stubLoggerError).toHaveBeenCalled();
        });

        it('should not update triggers in nested list', () => {
            const collection = getCollection([{ key: 1 }]);
            const nestedCollection = getCollection([{ key: 11 }]);
            const listContainer = getListContainerWithNestedList(collection, nestedCollection);
            const triggers = Array.from(
                listContainer.querySelectorAll(`.${TriggerClass}`)
            ) as HTMLElement[];
            const controller = getController({
                observersCallback,
                triggersVisibility: { backward: false, forward: false },
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setListContainer(listContainer);

            expect(triggers[0].style.display).toEqual('none');
            expect(triggers[1].style.display).toEqual('');
            expect(triggers[2].style.display).toEqual('');
            expect(triggers[3].style.display).toEqual('none');
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[3],
                },
            });
        });
    });

    describe('setViewportSize', () => {
        it("should recalculate triggers' offsets", () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setViewportSize(600);

            expect(newOffsets).toEqual({ backward: 180, forward: 180 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 180,
                    element: triggers[0],
                },
                forward: {
                    offset: 180,
                    element: triggers[1],
                },
            });
        });
    });

    describe('setListContainerSize', () => {
        it('should calculate offsets from contentSize if it is less than viewportSize', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setListContainerSize(150);

            expect(newOffsets).toEqual({ backward: 45, forward: 45 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 45,
                    element: triggers[0],
                },
                forward: {
                    offset: 45,
                    element: triggers[1],
                },
            });
        });

        it('should calculate offsets from viewportSize if it is more than contentSize', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setListContainerSize(1000);

            expect(newOffsets).toEqual({ backward: 90, forward: 90 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });
    });

    describe('setBackwardTriggerPosition', () => {
        it('should calculate offset 1 for trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setBackwardTriggerPosition('null');

            expect(newOffsets).toEqual({ backward: 1, forward: 90 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 1,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });

        it('should calculate offset 90 for trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                triggersPositions: { backward: 'null', forward: 'null' },
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setBackwardTriggerPosition('offset');

            expect(newOffsets).toEqual({ backward: 90, forward: 1 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 1,
                    element: triggers[1],
                },
            });
        });
    });

    describe('setForwardTriggerPosition', () => {
        it('should calculate offset 1 for trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setForwardTriggerPosition('null');

            expect(newOffsets).toEqual({ backward: 90, forward: 1 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 1,
                    element: triggers[1],
                },
            });
        });

        it('should calculate offset 90 for trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                triggersPositions: { backward: 'null', forward: 'null' },
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setForwardTriggerPosition('offset');

            expect(newOffsets).toEqual({ backward: 1, forward: 90 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 1,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });
    });

    describe('setAdditionalTriggersOffsets', () => {
        it('should recalculate triggers offsets', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.setAdditionalTriggersOffsets({
                backward: 48,
                forward: 48,
            });

            expect(newOffsets).toEqual({ backward: 138, forward: 138 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 138,
                    element: triggers[0],
                },
                forward: {
                    offset: 138,
                    element: triggers[1],
                },
            });
        });
    });

    describe('getTriggersOffsets', () => {
        it('should return current offsets', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            expect(controller.getTriggersOffsets()).toEqual({
                backward: 90,
                forward: 90,
            });
        });
    });

    describe('setBackwardTriggerVisibility', () => {
        it('should hide backward trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setBackwardTriggerVisibility(false);

            expect(triggers[0].style.display).toEqual('none');
            expect(triggers[1].style.display).toEqual('');
        });

        it('should display backward trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                triggersVisibility: { backward: false, forward: false },
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setBackwardTriggerVisibility(true);

            expect(triggers[0].style.display).toEqual('');
            expect(triggers[1].style.display).toEqual('none');
        });

        it('should not recalculate offsets when the trigger gets hidden', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setBackwardTriggerVisibility(false);

            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });

        it('should log error if trigger has invalid display style', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });
            triggers[0].style.display = 'absolute';

            controller.setBackwardTriggerVisibility(false);

            expect(stubLoggerError).toHaveBeenCalled();
        });
    });

    describe('setForwardTriggerVisibility', () => {
        it('should hide forward trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setForwardTriggerVisibility(false);

            expect(triggers[0].style.display).toEqual('');
            expect(triggers[1].style.display).toEqual('none');
        });

        it('should display forward trigger', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                triggersVisibility: { backward: false, forward: false },
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setForwardTriggerVisibility(true);

            expect(triggers[0].style.display).toEqual('none');
            expect(triggers[1].style.display).toEqual('');
        });

        it('should not recalculate offsets when the trigger gets hidden', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.setForwardTriggerVisibility(false);

            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 90,
                    element: triggers[0],
                },
                forward: {
                    offset: 90,
                    element: triggers[1],
                },
            });
        });

        it('should log error if trigger has invalid display style', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });
            triggers[1].style.display = 'absolute';

            controller.setForwardTriggerVisibility(false);

            expect(stubLoggerError).toHaveBeenCalled();
        });
    });

    describe('resetItems', () => {
        it("should reset triggers' offsets", () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            const newOffsets = controller.resetItems();

            expect(newOffsets).toEqual({ backward: 1, forward: 1 });
            expect(controller.getTriggerOffsetParams()).toEqual({
                backward: {
                    offset: 1,
                    element: triggers[0],
                },
                forward: {
                    offset: 1,
                    element: triggers[1],
                },
            });
        });

        it('should not hide triggers', () => {
            const controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 1000,
            });

            controller.resetItems();

            expect(triggers[0].style.display).toEqual('');
            expect(triggers[1].style.display).toEqual('');
        });
    });

    describe('checkTriggersVisibility', () => {
        let controller: TestObserverController;

        beforeEach(() => {
            controller = getController({
                observersCallback,
                listContainer,
                viewportSize: 300,
                contentSize: 600,
                scrollPosition: 0,
            });
        });

        it('should call callback with direction "backward" if backward trigger is visible in viewport', () => {
            controller.checkTriggersVisibility();

            expect(observersCallback).toHaveBeenCalledWith('backward');
            expect(observersCallback).not.toHaveBeenCalledWith('forward');
        });

        it('should not call callback with direction "backward" if backward trigger is not visible in viewport', () => {
            controller.setContentSizeBeforeList(200);
            controller.setScrollPosition(350);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('backward');
            expect(observersCallback).not.toHaveBeenCalledWith('forward');
        });

        it('should call callback with direction "backward" if backward trigger is visible in viewport', () => {
            controller.setContentSizeBeforeList(200);
            controller.setScrollPosition(150);

            controller.checkTriggersVisibility();

            expect(observersCallback).toHaveBeenCalledWith('backward');
            expect(observersCallback).not.toHaveBeenCalledWith('forward');
        });

        it('should call callback with direction "forward" if forward trigger is visible in viewport', () => {
            controller.setScrollPosition(300);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('backward');
            expect(observersCallback).toHaveBeenCalledWith('forward');
        });

        it('should not call callback with direction "forward" if forward trigger is not visible in viewport', () => {
            controller.setScrollPosition(350);
            controller.setContentSizeBeforeList(200);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('forward');
        });

        it('should call callback with direction "forward" if forward trigger is visible in viewport', () => {
            controller.setContentSizeBeforeList(200);
            controller.setScrollPosition(550);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('backward');
            expect(observersCallback).toHaveBeenCalledWith('forward');
        });

        it('should call callback for both directions if both triggers are visible in viewport', () => {
            controller.setListContainerSize(300);

            controller.checkTriggersVisibility();

            expect(observersCallback).toHaveBeenCalledWith('backward');
            expect(observersCallback).toHaveBeenCalledWith('forward');
            expect(observersCallback.mock.calls[0]).toEqual(['forward']);
            expect(observersCallback.mock.calls[1]).toEqual(['backward']);
        });

        it('both triggers are visible in viewport but should call callback only with forward direction', () => {
            // т.к. у нас есть записи вперед, то нужно сместить записи в первую очередь вперед
            controller.setHasItemsOutRange({ backward: false, forward: true });
            controller.setListContainerSize(300);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('backward');
            expect(observersCallback).toHaveBeenCalledWith('forward');
        });

        it('should not call callback with backward direction if backward trigger is hidden', () => {
            controller.setBackwardTriggerVisibility(false);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('backward');
        });

        it('should not call callback with forward direction if forward trigger is hidden', () => {
            controller.setForwardTriggerVisibility(false);
            controller.setScrollPosition(300);

            controller.checkTriggersVisibility();

            expect(observersCallback).not.toHaveBeenCalledWith('forward');
        });
    });
});
