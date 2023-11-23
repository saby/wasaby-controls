import { Render } from 'Controls/listRender';
import { constants } from 'Env/Env';

describe('Controls/_listRender/Render', () => {
    const defaultCfg = {
        listModel: {
            // flag to prevent subscribe/unsubscribe being called
            destroyed: true,
        },
    };

    describe('_beforeMount()', () => {
        it('generates unique key prefix', () => {
            const render = new Render(defaultCfg);
            render._beforeMount(defaultCfg);

            const anotherRender = new Render(defaultCfg);
            anotherRender._beforeMount(defaultCfg);

            expect(anotherRender._templateKeyPrefix).toBe(render._templateKeyPrefix);
        });

        it('subscribes to model changes', () => {
            let subscribedToChanges = false;
            const cfg = {
                ...defaultCfg,
                listModel: {
                    subscribe(eventName, handler) {
                        if (eventName === 'onCollectionChange' && handler instanceof Function) {
                            subscribedToChanges = true;
                        }
                    },
                    unsubscribe(eventName) {
                        if (eventName === 'onCollectionChange') {
                            subscribedToChanges = false;
                        }
                    },
                },
            };
            const render = new Render(cfg);
            render._beforeMount(cfg);

            expect(subscribedToChanges).toBe(true);
        });
    });

    describe('_beforeUpdate()', () => {
        const oldModel = {
            subscribedToChanges: true,
            unsubscribe(eventName) {
                if (eventName === 'onCollectionChange') {
                    oldModel.subscribedToChanges = false;
                }
            },
            getActionsMenuConfig: () => {
                return null;
            },
        };
        const newModel = {
            subscribedToChanges: false,
            subscribe(eventName) {
                if (eventName === 'onCollectionChange') {
                    newModel.subscribedToChanges = true;
                }
            },
            getActionsMenuConfig: () => {
                return null;
            },
        };

        beforeEach(() => {
            oldModel.subscribedToChanges = true;
            newModel.subscribedToChanges = false;
        });

        it('moves changes listeners if model changes', () => {
            const oldCfg = {
                ...defaultCfg,
                listModel: oldModel,
            };
            const newCfg = {
                ...defaultCfg,
                listModel: newModel,
            };

            const render = new Render(oldCfg);
            render.saveOptions(oldCfg);

            render._beforeUpdate(newCfg);

            expect(oldModel.subscribedToChanges).toBe(false);
            expect(newModel.subscribedToChanges).toBe(true);
        });

        it('does not move changes listeners if model does not change', () => {
            const oldCfg = {
                ...defaultCfg,
                listModel: oldModel,
            };

            const render = new Render(oldCfg);
            render.saveOptions(oldCfg);

            render._beforeUpdate({ ...oldCfg });

            expect(oldModel.subscribedToChanges).toBe(true);
        });
    });

    describe('_afterRender()', () => {
        it('fires controlResize if collection was updated', () => {
            let controlResizeFired = false;
            const render = new Render(defaultCfg);
            render._notify = (eventName) => {
                if (eventName === 'controlResize') {
                    controlResizeFired = true;
                }
            };

            // add
            render._onCollectionChange(null, 'a');
            render._afterRender();
            expect(controlResizeFired).toBe(true);
        });

        it('does not fire collection resize if collection was not updated', () => {
            let controlResizeFired = false;
            const render = new Render(defaultCfg);
            render._notify = (eventName) => {
                if (eventName === 'controlResize') {
                    controlResizeFired = true;
                }
            };

            render._afterRender();

            expect(controlResizeFired).toBe(false);

            render._onCollectionChange(null, 'ch');
            render._afterRender();

            expect(controlResizeFired).toBe(false);
        });
    });

    it('_beforeUnmount()', () => {
        const model = {
            subscribedToChanges: true,
            unsubscribe(eventName) {
                if (eventName === 'onCollectionChange') {
                    model.subscribedToChanges = false;
                }
            },
        };
        const cfg = {
            ...defaultCfg,
            listModel: model,
        };

        const render = new Render(cfg);
        render.saveOptions(cfg);

        render._beforeUnmount();

        expect(model.subscribedToChanges).toBe(false);
    });

    it('getItemsContainer()', () => {
        const itemsContainer = {};

        const render = new Render(defaultCfg);
        render._children.itemsContainer = itemsContainer;

        expect(render.getItemsContainer()).toBe(itemsContainer);
    });

    it('_onItemClick()', () => {
        let itemClickFired = false;
        let itemClickParameter;
        let itemClickBubbling = false;
        const render = new Render(defaultCfg);
        render._notify = (eventName, params, opts) => {
            if (eventName === 'itemClick') {
                itemClickFired = true;
                itemClickParameter = params[0];
                itemClickBubbling = !!(opts && opts.bubbling);
            }
        };

        render._onItemClick(
            {},
            {
                isEditing() {
                    return true;
                },
                getContents: () => {
                    return {};
                },
            }
        );
        expect(itemClickFired).toBe(false);

        const expectedContents = {};
        render._onItemClick(
            {},
            {
                isEditing() {
                    return false;
                },
                getContents() {
                    return expectedContents;
                },
            }
        );

        expect(itemClickFired).toBe(true);
        expect(itemClickParameter).toBe(expectedContents);
    });

    it('_onItemContextMenu()', () => {
        let editingItem = null;
        const cfg = {
            ...defaultCfg,
            listModel: {
                find: () => {
                    return editingItem;
                },
            },
        };

        const render = new Render(cfg);
        render.saveOptions(cfg);

        let itemContextMenuFired = false;
        let itemContextMenuParameter;
        let itemContextMenuBubbling = false;
        let contextMenuStopped = false;
        const mockEvent = {
            stopPropagation(): void {
                contextMenuStopped = true;
            },
        };
        render._notify = (eventName, params, opts) => {
            if (eventName === 'itemContextMenu') {
                itemContextMenuFired = true;
                itemContextMenuParameter = params[0];
                itemContextMenuBubbling = !!(opts && opts.bubbling);
            }
        };

        render.saveOptions({
            ...cfg,
            contextMenuEnabled: false,
        });
        render._onItemContextMenu(mockEvent, {});

        expect(itemContextMenuFired).toBe(false);

        render.saveOptions({
            ...cfg,
            contextMenuEnabled: true,
            contextMenuVisibility: false,
        });
        render._onItemContextMenu(mockEvent, {});

        expect(itemContextMenuFired).toBe(false);

        render.saveOptions({
            ...cfg,
            contextMenuEnabled: true,
            contextMenuVisibility: true,
        });

        const item = {};
        editingItem = null;
        render._onItemContextMenu(mockEvent, item);

        expect(itemContextMenuFired).toBe(true);
        expect(contextMenuStopped).toBe(true);
        expect(itemContextMenuParameter).toBe(item);
        expect(itemContextMenuBubbling).toBe(false);
    });

    it('_onItemSwipe()', () => {
        const render = new Render(defaultCfg);

        let itemSwipeFired = false;
        let itemSwipeParameter;
        let itemSwipeClientWidth;
        let itemSwipeClientHeight;
        let itemSwipeBubbling = false;
        render._notify = (eventName, params, opts) => {
            if (eventName === 'itemSwipe') {
                itemSwipeFired = true;
                itemSwipeParameter = params[0];
                itemSwipeClientWidth = params[2];
                itemSwipeClientHeight = params[3];
                itemSwipeBubbling = !!(opts && opts.bubbling);
            }
        };

        let stopPropagationCalled = false;
        const event = {
            stopPropagation() {
                stopPropagationCalled = true;
            },
            target: {
                closest: () => {
                    return {
                        classList: {
                            contains: () => {
                                return true;
                            },
                        },
                        clientWidth: 321,
                        clientHeight: 123,
                    };
                },
            },
        };

        const item = {};
        render._onItemSwipe(event, item);

        expect(itemSwipeFired).toBe(true);
        expect(stopPropagationCalled).toBe(true);
        expect(itemSwipeParameter).toBe(item);
        expect(itemSwipeBubbling).toBe(false);
        expect(itemSwipeClientWidth).toBe(321);
        expect(itemSwipeClientHeight).toBe(123);
    });

    it('_onItemKeyDown()', () => {
        const render = new Render(defaultCfg);

        let keyDownFired = false;
        let keyDownParameter;
        let keyDownBubbling = false;
        render._notify = (eventName, params, opts) => {
            if (eventName === 'editingRowKeyDown') {
                keyDownFired = true;
                keyDownParameter = params[0];
                keyDownBubbling = !!(opts && opts.bubbling);
            }
        };

        render._onItemKeyDown(
            {},
            {
                isEditing() {
                    return false;
                },
            }
        );
        expect(keyDownFired).toBe(false);

        let stopPropagationCalled = false;
        const escEvent = {
            nativeEvent: {
                keyCode: constants.key.esc,
            },
            stopPropagation() {
                stopPropagationCalled = true;
            },
        };
        render._onItemKeyDown(escEvent, {
            isEditing() {
                return true;
            },
        });

        expect(keyDownFired).toBe(true);
        expect(keyDownParameter).toBe(escEvent.nativeEvent);
        expect(keyDownBubbling).toBe(true);
        expect(stopPropagationCalled).toBe(true);

        stopPropagationCalled = false;
        const tabEvent = {
            nativeEvent: {
                keyCode: constants.key.tab,
            },
            target: {
                closest() {
                    return false;
                },
            },
            stopPropagation() {
                stopPropagationCalled = true;
            },
        };
        render._onItemKeyDown(tabEvent, {
            isEditing() {
                return true;
            },
        });

        expect(stopPropagationCalled).toBe(false);

        stopPropagationCalled = false;
        const randomKeyEvent = {
            nativeEvent: {
                keyCode: constants.key.p,
            },
            target: {
                closest() {
                    return false;
                },
            },
            stopPropagation() {
                stopPropagationCalled = true;
            },
        };
        render._onItemKeyDown(randomKeyEvent, {
            isEditing() {
                return true;
            },
        });

        expect(stopPropagationCalled).toBe(true);

        stopPropagationCalled = false;
        const randomKeyInRichEditorEvent = {
            nativeEvent: {
                keyCode: constants.key.p,
            },
            target: {
                closest() {
                    return true;
                },
            },
            stopPropagation() {
                stopPropagationCalled = true;
            },
        };
        render._onItemKeyDown(randomKeyInRichEditorEvent, {
            isEditing() {
                return true;
            },
        });

        expect(stopPropagationCalled).toBe(false);
    });

    it('_canHaveMultiselect()', () => {
        const render = new Render(defaultCfg);

        expect(render._canHaveMultiselect({ multiselectVisibility: 'hidden' })).toBe(false);
        expect(render._canHaveMultiselect({ multiselectVisibility: 'onhover' })).toBe(true);
        expect(render._canHaveMultiselect({ multiselectVisibility: 'visible' })).toBe(true);
    });

    describe('Calling animation end handlers', () => {
        let render: Render;
        let lastCalledEvent: string;
        beforeEach(() => {
            lastCalledEvent = null;
            render = new Render(defaultCfg);
            render._notify = (eventName) => {
                lastCalledEvent = eventName;
            };
        });

        it('should not fire closeSwipe event on any event', () => {
            render._onActionsSwipeAnimationEnd({
                stopPropagation: jest.fn(),
                nativeEvent: {
                    animationName: 'test',
                },
            });
            expect(lastCalledEvent).toBeNull();
        });

        it("should fire closeSwipe event on 'itemActionsSwipeClose' event", () => {
            render._onActionsSwipeAnimationEnd({
                stopPropagation: jest.fn(),
                nativeEvent: {
                    animationName: 'itemActionsSwipeClose',
                },
            });
            expect(lastCalledEvent).toEqual('closeSwipe');
        });
    });
});
