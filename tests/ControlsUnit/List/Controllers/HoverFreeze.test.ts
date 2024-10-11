import { SyntheticEvent } from 'UI/Vdom';

import HoverFreeze, { IHoverFreezeOptions } from 'Controls/_baseList/Controllers/HoverFreeze';

// const + 1
const TEST_HOVER_FREEZE_TIMEOUT: number = 201;
const TEST_HOVER_UNFREEZE_TIMEOUT: number = 101;

function createFakeMouseEvent(
    clientX?: number,
    clientY?: number,
    parentNode?: object
): SyntheticEvent {
    const children = new Array(50);
    const itemContainer = {
        parentNode:
            parentNode !== undefined
                ? parentNode
                : {
                      children,
                  },
    } as undefined as HTMLElement;
    children[50] = itemContainer;
    return {
        nativeEvent: {
            clientX,
            clientY,
        },
        target: {
            closest: () => {
                return itemContainer;
            },
        } as undefined as HTMLElement,
    };
}

function mockViewContainer(itemActionsHeight: number, hoverContainerRect: object): HTMLElement {
    return {
        querySelector: () => {
            return {
                querySelector: () => {
                    return {
                        offsetHeight: itemActionsHeight,
                    };
                },
                getBoundingClientRect: () => {
                    return hoverContainerRect;
                },
            } as undefined as HTMLElement;
        },
        querySelectorAll: (selector: string) => {
            return [
                {
                    querySelector: () => {
                        return null;
                    },
                    closest: () => {
                        return {
                            querySelector: () => {
                                return {
                                    offsetHeight: itemActionsHeight,
                                };
                            },
                        };
                    },
                    getBoundingClientRect: () => {
                        return hoverContainerRect;
                    },
                } as undefined as HTMLElement,
            ];
        },
    } as undefined as HTMLElement;
}

function mockStylesContainer(): HTMLElement {
    return {
        innerHTML: '',
    } as undefined as HTMLElement;
}

describe('Controls/list/HoverFreeze', () => {
    let cfg: IHoverFreezeOptions;
    let hoverContainerRect: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    let itemActionsHeight: number;
    let hoverFreeze: HoverFreeze;
    let isFreezeHoverCallbackCalled: boolean;
    let isUnFreezeHoverCallbackCalled: boolean;
    let startEvent: SyntheticEvent;

    let originalGetComputedStyle;

    before(() => {
        const isNode = typeof document === 'undefined';
        if (isNode) {
            originalGetComputedStyle = global.getComputedStyle;
            global.getComputedStyle = () => {
                return {};
            };
        }
    });

    after(() => {
        const isNode = typeof document === 'undefined';
        if (isNode) {
            global.getComputedStyle = originalGetComputedStyle;
        }
    });

    beforeEach(() => {
        isFreezeHoverCallbackCalled = false;
        isUnFreezeHoverCallbackCalled = false;
        jest.useFakeTimers();
        hoverContainerRect = {
            top: 25,
            left: 25,
            height: 30,
            width: 100,
        };
        itemActionsHeight = 30;
        startEvent = createFakeMouseEvent();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('startFreezeHoverTimeout', () => {
        beforeEach(() => {
            cfg = {
                viewContainer: mockViewContainer(itemActionsHeight, hoverContainerRect),
                stylesContainer: mockStylesContainer(),
                uniqueClass: 'unique-class',
                measurableContainerSelector: 'measurable-container-selector',
                freezeHoverCallback: () => {
                    isFreezeHoverCallbackCalled = true;
                },
                unFreezeHoverCallback: () => {
                    isUnFreezeHoverCallbackCalled = true;
                },
            };
            hoverFreeze = new HoverFreeze(cfg);
        });

        it('should start freeze timer', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);

            // until timer stops it must not be frozen
            expect(hoverFreeze.getCurrentItemKey()).not.toEqual('key_1');
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toEqual('key_1');
        });

        it('should freeze only the last key', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT / 2);
            hoverFreeze.startFreezeHoverTimeout('key_2', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT / 2);
            hoverFreeze.startFreezeHoverTimeout('key_3', startEvent, 0, 0);
            expect(hoverFreeze.getCurrentItemKey()).not.toEqual('key_3');

            // until timer stops it must not be frozen
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toEqual('key_3');
        });

        it('should call freezeHoverCallback', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            expect(isFreezeHoverCallbackCalled).toBe(false);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(isFreezeHoverCallbackCalled).toBe(true);
        });

        it('should not freeze if DOM parent of record was removed (parentNode === null)', () => {
            startEvent = createFakeMouseEvent(0, 0, null);
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            expect(hoverFreeze.getCurrentItemKey()).toBeNull();
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toBeNull();
        });
    });

    describe('startUnfreezeHoverTimeout', () => {
        beforeEach(() => {
            cfg = {
                viewContainer: mockViewContainer(itemActionsHeight, hoverContainerRect),
                stylesContainer: mockStylesContainer(),
                uniqueClass: 'unique-class',
                measurableContainerSelector: 'measurable-container-selector',
                freezeHoverCallback: () => {
                    isFreezeHoverCallbackCalled = true;
                },
                unFreezeHoverCallback: () => {
                    isUnFreezeHoverCallbackCalled = true;
                },
            };
            hoverFreeze = new HoverFreeze(cfg);
        });

        it('should start unfreeze timer when cursor position is in bottom of the moveArea', () => {
            // mouse cursor position is in bottom of the moveArea
            const event = createFakeMouseEvent(100, 80);
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.startUnfreezeHoverTimeout(event);

            // until timer stops it must not be unfrozen
            expect(hoverFreeze.getCurrentItemKey()).toEqual('key_1');
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);
        });

        it('should not start unfreeze timer when cursor position is under the moveArea', () => {
            // mouse cursor position is under the moveArea
            const event = createFakeMouseEvent(100, 100);
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.startUnfreezeHoverTimeout(event);

            // it must be unfrozen immediately
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);
        });

        it('should restart unfreeze timer', () => {
            // mouse cursor is moving right inside of the moveArea
            const event1 = createFakeMouseEvent(80, 60);
            const event2 = createFakeMouseEvent(90, 80);
            const event3 = createFakeMouseEvent(100, 80);
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.startUnfreezeHoverTimeout(event1);
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT / 2);
            hoverFreeze.startUnfreezeHoverTimeout(event2);
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT / 2);
            hoverFreeze.startUnfreezeHoverTimeout(event3);

            // until timer stops it must not be unfrozen
            expect(hoverFreeze.getCurrentItemKey()).toEqual('key_1');
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);
        });

        it('should call unFreezeHoverCallback deferred when cursor position is in bottom of the moveArea', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            const event = createFakeMouseEvent(100, 80);
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(false);
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback deferred when cursor position is inside of current item', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            const event = createFakeMouseEvent(
                100,
                hoverContainerRect.top + hoverContainerRect.height - 1
            );
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(false);
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback immediately when cursor position is under the moveArea', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            // mouse cursor position is under the moveArea
            const event = createFakeMouseEvent(100, 100);
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback immediately when cursor position is rights of current item', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            const event = createFakeMouseEvent(
                hoverContainerRect.left + hoverContainerRect.width + 1,
                54
            );
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback immediately when cursor position is lefts of current item', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            const event = createFakeMouseEvent(hoverContainerRect.left - 1, 54);
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback immediately when cursor position is above of current item', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            const event = createFakeMouseEvent(100, hoverContainerRect.top - 1);
            hoverFreeze.startUnfreezeHoverTimeout(event);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unFreezeHoverCallback immediately when cursor position is under the moveArea', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);

            // mouse cursor position is under the moveArea
            const event1 = createFakeMouseEvent(100, 80);
            const event2 = createFakeMouseEvent(45, 60);
            hoverFreeze.startUnfreezeHoverTimeout(event1);
            expect(isUnFreezeHoverCallbackCalled).toBe(false);

            // Вышли за угол треугольника
            hoverFreeze.startUnfreezeHoverTimeout(event2);
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });
    });

    describe('unfreezeHover', () => {
        beforeEach(() => {
            cfg = {
                viewContainer: mockViewContainer(itemActionsHeight, hoverContainerRect),
                stylesContainer: mockStylesContainer(),
                uniqueClass: 'unique-class',
                measurableContainerSelector: 'measurable-container-selector',
                freezeHoverCallback: () => {
                    isFreezeHoverCallbackCalled = true;
                },
                unFreezeHoverCallback: () => {
                    isUnFreezeHoverCallbackCalled = true;
                },
            };
            hoverFreeze = new HoverFreeze(cfg);
        });

        it('should clear getCurrentItemKey', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);

            // until timer stops it must not be frozen
            expect(hoverFreeze.getCurrentItemKey()).not.toEqual('key_1');
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(hoverFreeze.getCurrentItemKey()).toEqual('key_1');
            hoverFreeze.unfreezeHover();
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);
        });

        it('should clear freeze timer', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            hoverFreeze.unfreezeHover();
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            expect(isFreezeHoverCallbackCalled).toBe(false);
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);
        });

        it('should clear unfreeze timer', () => {
            // mouse cursor position is in bottom of the moveArea
            const event = createFakeMouseEvent(100, 80);
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.startUnfreezeHoverTimeout(event);
            hoverFreeze.unfreezeHover();
            expect(hoverFreeze.getCurrentItemKey()).toEqual(null);

            // unfreezeHover напрямую вызывает UnfreezeCallback. Выставим снова в false для проверки колбека.
            isUnFreezeHoverCallbackCalled = false;
            jest.advanceTimersByTime(TEST_HOVER_UNFREEZE_TIMEOUT);
            expect(isUnFreezeHoverCallbackCalled).toBe(false);
        });

        it('should unfreeze when item has 0 id', () => {
            hoverFreeze.startFreezeHoverTimeout(0, startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.unfreezeHover();
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it('should call unfreeze callback', () => {
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 0, 0);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
            hoverFreeze.unfreezeHover();
            expect(isUnFreezeHoverCallbackCalled).toBe(true);
        });

        it("shouldn't call unfreeze callback when no current key", () => {
            hoverFreeze.unfreezeHover();
            expect(isUnFreezeHoverCallbackCalled).toBe(false);
        });
    });

    describe('virtualScroll', () => {
        it('should start freeze timer with correct start index', () => {
            const viewContainer = mockViewContainer(itemActionsHeight, hoverContainerRect);
            cfg = {
                viewContainer,
                stylesContainer: mockStylesContainer(),
                uniqueClass: 'unique-class',
                measurableContainerSelector: 'measurable-container-selector',
                freezeHoverCallback: () => {
                    isFreezeHoverCallbackCalled = true;
                },
                unFreezeHoverCallback: () => {
                    isUnFreezeHoverCallbackCalled = true;
                },
            };
            hoverFreeze = new HoverFreeze(cfg);
            const originalQuerySelectorAll = viewContainer.querySelectorAll;
            viewContainer.querySelectorAll = (selector: string) => {
                expect(selector).toEqual(
                    ' .unique-class .controls-ListView__itemV:nth-child(51) > ' +
                        '.measurable-container-selector,  .unique-class .controls-ListView__itemV:nth-child(51)'
                );
                return originalQuerySelectorAll(selector);
            };
            hoverFreeze.startFreezeHoverTimeout('key_1', startEvent, 150, 100);
            jest.advanceTimersByTime(TEST_HOVER_FREEZE_TIMEOUT);
        });
    });
});
