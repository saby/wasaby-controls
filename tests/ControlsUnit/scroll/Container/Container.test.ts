import Container from 'Controls/_scroll/Container';
import { compatibility, constants } from 'Env/Env';
import {
    SHADOW_VISIBILITY,
    SHADOW_MODE,
} from 'Controls/_scroll/Container/Interface/IShadows';
import {
    SCROLL_DIRECTION,
    SCROLL_POSITION,
} from 'Controls/_scroll/Utils/Scroll';
import ScrollbarsModel from 'Controls/_scroll/Container/ScrollbarsModel';

function createComponent(Component, cfg) {
    if (Component.getDefaultOptions) {
        cfg = { theme: 'default', ...Component.getDefaultOptions(), ...cfg };
    }
    const cmp = new Component(cfg);
    cmp.saveOptions(cfg);
    cmp._beforeMount(cfg);
    return cmp;
}

function getBoundingClientRectMock() {
    return { height: 100, width: 100 };
}

const classList = {
    contains: () => {
        return false;
    },
};

describe('Controls/scroll:Container', () => {
    describe('constructor', () => {
        it('should initialize by default', () => {
            const component = createComponent(Container, {});

            expect(component._scrollCssClass).toBe(
                ' controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hideNativeScrollbar_ff-ie-edge controls-Scroll-ContainerBase__scroll_vertical'
            );
        });
    });

    describe('_beforeMount', () => {
        [
            {
                shadowMode: SHADOW_MODE.CSS,
            },
            {
                shadowMode: SHADOW_MODE.MIXED,
            },
        ].forEach((options) => {
            it(`should initialize with css shadows. Options ${JSON.stringify(
                options
            )}`, () => {
                const component = createComponent(Container, options);
                expect(component._isOptimizeShadowEnabled).toBe(true);
            });
        });

        [
            {
                shadowMode: SHADOW_MODE.JS,
            },
            {
                shadowMode: SHADOW_MODE.MIXED,
                bottomShadowVisibility: SHADOW_VISIBILITY.VISIBLE,
                topShadowVisibility: SHADOW_VISIBILITY.VISIBLE,
            },
        ].forEach((options) => {
            it(`should initialize with js shadows. Options ${JSON.stringify(
                options
            )}`, () => {
                const component = createComponent(Container, options);
                expect(component._isOptimizeShadowEnabled).toBe(false);
            });
        });
    });

    describe('_beforeUnmount', () => {
        it('should call beforeUnmount in ContainerBase', () => {
            const component = createComponent(Container);
            const state = (component._scrollModel = {
                scrollTop: 200,
            });
            component._container = {
                dataset: {
                    scrollContainerNode: 0,
                },
            };
            component._stickyController = {
                destroy: () => {
                    return;
                },
            };
            component._dnDAutoScroll = {
                destroy: () => {
                    return 0;
                },
            };
            component._beforeUnmount();

            expect(state).not.toEqual(component._scrollModel);
            expect(component._scrollModel).toBeNull();
        });
    });

    describe('_afterMount', () => {
        let component: Container;
        beforeEach(() => {
            component = createComponent(Container, {});
            jest.spyOn(component._stickyController, 'init')
                .mockClear()
                .mockImplementation();
            jest.spyOn(component, '_switchInitialScrollPosition')
                .mockClear()
                .mockImplementation();
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
                userContent: {
                    children: [
                        {
                            classList: {
                                contains: () => {
                                    return true;
                                },
                            },
                        },
                    ],
                },
            };
            component._container = {
                closest: jest.fn().mockReturnValue(false),
            };
        });
        it("should't init sticky header controller on not touch devices", () => {
            jest.spyOn(component, '_updateScrollbarsPadding')
                .mockClear()
                .mockImplementation();
            component._afterMount({}, {});
            expect(component._stickyController.init).not.toHaveBeenCalled();
        });
        it('should init sticky header controller on touch devices', () => {
            const touch = compatibility.touch;
            compatibility.touch = true;
            jest.spyOn(component, '_updateScrollbarsPadding')
                .mockClear()
                .mockImplementation();
            component._afterMount({}, {});
            expect(component._stickyController.init).toHaveBeenCalled();
            compatibility.touch = touch;
        });

        it('should init sticky header controller if shadows are forced enabled.', () => {
            component = createComponent(Container, {
                topShadowVisibility: SHADOW_VISIBILITY.VISIBLE,
            });
            jest.spyOn(component, '_switchInitialScrollPosition')
                .mockClear()
                .mockImplementation();
            jest.spyOn(component._stickyController, 'init')
                .mockClear()
                .mockImplementation();
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
                userContent: {
                    children: [
                        {
                            classList: {
                                contains: () => {
                                    return true;
                                },
                            },
                        },
                    ],
                },
            };
            component._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            jest.spyOn(component, '_updateScrollbarsPadding')
                .mockClear()
                .mockImplementation();
            component._afterMount(
                { topShadowVisibility: SHADOW_VISIBILITY.VISIBLE },
                {}
            );
            expect(component._stickyController.init).toHaveBeenCalled();
        });
    });

    describe('shadowMode', () => {
        const optimizeShadowClass: string =
            'controls-Scroll__backgroundShadow controls-Scroll__background-Shadow_style-default controls-Scroll__background-Shadow_top-auto_bottom-auto_style-default';
        [
            {
                shadowMode: SHADOW_MODE.JS,
                canScroll: true,
                isOptimizeShadowEnabled: false,
                isOptimizeShadowEnabledAfterMouseEnter: false,
                optimizeShadowClass: '',
                optimizeShadowClassAfterMouseEnter: '',
            },
            {
                shadowMode: SHADOW_MODE.MIXED,
                canScroll: true,
                isOptimizeShadowEnabled: true,
                isOptimizeShadowEnabledAfterMouseEnter: false,
                optimizeShadowClass,
                optimizeShadowClassAfterMouseEnter: '',
            },
            {
                shadowMode: SHADOW_MODE.MIXED,
                canScroll: false,
                isOptimizeShadowEnabled: true,
                isOptimizeShadowEnabledAfterMouseEnter: true,
                optimizeShadowClass,
                optimizeShadowClassAfterMouseEnter: optimizeShadowClass,
            },
            {
                shadowMode: SHADOW_MODE.CSS,
                canScroll: true,
                isOptimizeShadowEnabled: true,
                isOptimizeShadowEnabledAfterMouseEnter: true,
                optimizeShadowClass,
                optimizeShadowClassAfterMouseEnter: optimizeShadowClass,
            },
        ].forEach((test) => {
            it(`${test.shadowMode}, canScroll ${test.canScroll}`, () => {
                const component = createComponent(Container, {
                    shadowMode: test.shadowMode,
                });
                component._children = {
                    content: {
                        getBoundingClientRect: getBoundingClientRectMock,
                        children: [],
                    },
                };
                component._isStateInitialized = true;
                component._scrollModel = {};

                expect(component._isOptimizeShadowEnabled).toBe(
                    test.isOptimizeShadowEnabled
                );
                expect(component._optimizeShadowClass).toBe(
                    test.optimizeShadowClass
                );

                component._scrollModel.canVerticalScroll = test.canScroll;
                component._mouseenterHandler();

                expect(component._isOptimizeShadowEnabled).toBe(
                    test.isOptimizeShadowEnabledAfterMouseEnter
                );
                expect(component._optimizeShadowClass).toBe(
                    test.optimizeShadowClassAfterMouseEnter
                );
            });
        });
    });

    describe('_updateState', () => {
        const state = {
            scrollTop: 0,
            scrollLeft: 0,
            clientHeight: 100,
            scrollHeight: 200,
            clientWidth: 100,
            scrollWidth: 200,
            verticalPosition: 'start',
            horizontalPosition: 'start',
            canVerticalScroll: true,
            canHorizontalScroll: true,
        };

        it('should update _scrollCssClass, scrollOrientation: "vertical"', () => {
            const component = createComponent(Container, {
                scrollOrientation: 'vertical',
            });
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                },
            };
            component._container = {
                offsetHeight: 100,
            };
            component._scrollbars._scrollContainerStyles = '';
            component._scrollModel = {
                clone: () => {
                    return 0;
                },
                updateState: () => {
                    return true;
                },
            };
            component._updateState(state);
            expect(component._scrollCssClass).toBe(
                ' controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hideNativeScrollbar_ff-ie-edge controls-Scroll-ContainerBase__scroll_vertical'
            );
        });
        it('should update _scrollCssClass, scrollOrientation: "verticalHorizontal"', () => {
            const component = createComponent(Container, {
                scrollOrientation: 'verticalHorizontal',
            });
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                },
            };
            component._container = {
                offsetHeight: 100,
            };
            component._scrollbars._scrollContainerStyles = '';
            component._scrollModel = {
                clone: () => {
                    return 0;
                },
                updateState: () => {
                    return true;
                },
            };
            component._updateState(state);
            expect(component._scrollCssClass).toBe(
                ' controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hideNativeScrollbar_ff-ie-edge controls-Scroll-ContainerBase__scroll_verticalHorizontal'
            );
        });

        describe('shadows', () => {
            it('should update shadows models if optimized shadows are enabled and there are sticky headers', () => {
                const component = createComponent(Container, {
                    scrollOrientation: 'vertical',
                });
                component._isOptimizeShadowEnabled = true;
                component._children = {
                    content: {
                        getBoundingClientRect: getBoundingClientRectMock,
                    },
                };
                component._scrollModel = {
                    clone: () => {
                        return 0;
                    },
                    updateState: () => {
                        return true;
                    },
                    canVerticalScroll: true,
                };
                jest.spyOn(component._stickyController, 'hasFixed')
                    .mockClear()
                    .mockReturnValue(true);

                expect(
                    component._shadows.top.isStickyHeadersShadowsEnabled()
                ).toBe(false);
                component._updateState({
                    ...state,
                    scrollTop: 10,
                });
                expect(
                    component._shadows.top.isStickyHeadersShadowsEnabled()
                ).toBe(true);
            });
        });

        describe('scrollbars', () => {
            it('should initialize scrollbars only after mouseenter', () => {
                const component = createComponent(Container, {
                    scrollOrientation: 'vertical',
                });
                component._children = {
                    content: {
                        getBoundingClientRect: getBoundingClientRectMock,
                    },
                };
                component._container = {
                    offsetHeight: 100,
                };
                component._scrollModel = {
                    clone: () => {
                        return 0;
                    },
                    updateState: () => {
                        return true;
                    },
                    canVerticalScroll: true,
                    clientHeight: 1000,
                    scrollHeight: 2000,
                };
                // В реальнности метод задебоунсен, в тестах выключаем дебоунс.
                component._scrollbars._updateContainerSizes =
                    ScrollbarsModel.prototype._updateContainerSizes;
                component._updateState(state);
                expect(component._scrollbars.vertical.isVisible).toBe(false);
                component._mouseenterHandler();
                expect(component._scrollbars.vertical.isVisible).toBe(true);
            });

            it('should initialize scrollbars in _updateState  after mouseenter', () => {
                const component = createComponent(Container, {
                    scrollOrientation: 'vertical',
                });
                component._children = {
                    content: {
                        getBoundingClientRect: getBoundingClientRectMock,
                    },
                };
                component._container = {
                    offsetHeight: 100,
                };

                // В реальнности метод задебоунсен, в тестах выключаем дебоунс.
                component._scrollbars._updateContainerSizes =
                    ScrollbarsModel.prototype._updateContainerSizes;

                component._mouseenterHandler();
                expect(component._scrollbars.vertical.isVisible).toBe(false);

                component._scrollModel = {
                    clone: () => {
                        return 0;
                    },
                    updateState: () => {
                        return true;
                    },
                    canVerticalScroll: true,
                    clientHeight: 1000,
                    scrollHeight: 2000,
                };
                component._scrollModel.canVerticalScroll = true;

                component._updateState(state);
                expect(component._scrollbars.vertical.isVisible).toBe(true);
            });

            it('should update scrollbars on mode changed', () => {
                const cfg = {
                    scrollbarVisible: true,
                    scrollOrientation: 'verticalHorizontal',
                };
                const component = createComponent(Container, cfg);
                let isValidCall = false;
                jest.spyOn(component._scrollbars, 'updateOptions')
                    .mockClear()
                    .mockImplementation((options, scrollbarVisible) => {
                        if (
                            options.scrollbarVisible &&
                            options.scrollbarVisible.vertical &&
                            !options.scrollbarVisible.horizontal
                        ) {
                            isValidCall = true;
                        }
                    });
                component._setHorizontalScrollMode('custom');
                expect(isValidCall).toBe(true);
            });
        });

        describe('paging', () => {
            it('should update _contentWrapperCssClass if paging appears', () => {
                const component = createComponent(Container, {
                    scrollOrientation: 'vertical',
                });
                component._children = {
                    content: {
                        getBoundingClientRect: getBoundingClientRectMock,
                    },
                };

                component._updateState({
                    ...state,
                });
                component._dnDAutoScroll = {
                    updateOptions: () => {
                        return 0;
                    },
                };
                jest.spyOn(component, '_updateScrollbarsPadding')
                    .mockClear()
                    .mockImplementation();
                component._pagingVisible = true;
                component._beforeUpdate({ scrollOrientation: 'vertical' });
                expect(component._contentWrapperCssClass).toContain(
                    'controls-Scroll__content_paging'
                );
            });
        });
    });

    describe('_keydownHandler', () => {
        it('should scroll top 40px when key up', () => {
            const component = createComponent(Container, {});
            const result = 960;
            component._topPlaceholderSize = 0;
            component._scrollModel = {
                scrollTop: 1000,
            };
            component._children = {
                content: {
                    scrollTop: 1000,
                    children: [],
                },
            };
            const event = {
                nativeEvent: {
                    isTrusted: false,
                    which: constants.key.up,
                },
                preventDefault: () => {
                    return 0;
                },
            };
            component._keydownHandler(event);
            expect(component._children.content.scrollTop).toBe(result);
        });
        it('should scroll down 40px when key down', () => {
            const component = createComponent(Container, {});
            const result = 1040;
            component._topPlaceholderSize = 0;
            component._scrollModel = {
                scrollTop: 1000,
                scrollHeight: 2000,
                clientHeight: 600,
            };
            component._children = {
                content: {
                    scrollTop: 1000,
                    children: [],
                },
            };
            const event = {
                nativeEvent: {
                    isTrusted: false,
                    which: constants.key.down,
                },
                preventDefault: () => {
                    return 0;
                },
            };
            component._keydownHandler(event);
            expect(component._children.content.scrollTop).toBe(result);
        });
        it('should not scroll down 40px when key down', () => {
            const component = createComponent(Container, {});
            const result = 1000;
            component._topPlaceholderSize = 0;
            component._scrollModel = {
                scrollTop: 1000,
                scrollHeight: 2000,
                clientHeight: 1000,
            };
            component._children = {
                content: {
                    scrollTop: 1000,
                    children: [],
                },
            };
            const event = {
                nativeEvent: {
                    isTrusted: false,
                    which: constants.key.down,
                },
                preventDefault: () => {
                    return 0;
                },
            };
            component._keydownHandler(event);
            expect(component._children.content.scrollTop).toBe(result);
        });
        it('should not scroll down 40px when key up', () => {
            const component = createComponent(Container, {});
            const result = 0;
            component._topPlaceholderSize = 0;
            component._scrollModel = {
                scrollTop: 0,
            };
            component._children = {
                content: {
                    scrollTop: 0,
                    children: [],
                },
            };
            const event = {
                nativeEvent: {
                    isTrusted: false,
                    which: constants.key.up,
                },
                preventDefault: () => {
                    return 0;
                },
            };
            component._keydownHandler(event);
            expect(component._children.content.scrollTop).toBe(result);
        });
        it('should not scroll anywhere if not native keydown', () => {
            const component = createComponent(Container, {});
            const result = 0;
            component._topPlaceholderSize = 0;
            component._scrollModel = {
                scrollTop: 0,
            };
            component._children = {
                content: {
                    scrollTop: 0,
                    children: [],
                },
            };
            const event = {
                nativeEvent: {
                    isTrusted: true,
                    which: constants.key.up,
                },
                preventDefault: () => {
                    return 0;
                },
            };
            component._keydownHandler(event);
            expect(component._children.content.scrollTop).toBe(result);
        });
    });

    describe('_updateShadowVisibility', () => {
        const event = {
            stopImmediatePropagation: () => {
                return undefined;
            },
        };

        it('should stop event propagation', () => {
            const component = createComponent(Container, {});
            const event = {
                stopImmediatePropagation: jest.fn(),
            };
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.HIDDEN,
                bottom: SHADOW_VISIBILITY.HIDDEN,
            });
            expect(event.stopImmediatePropagation).toHaveBeenCalled();
        });

        it('should`t update models if shadow visibility does not changed', () => {
            const component = createComponent(Container, {});

            jest.spyOn(component._shadows, 'updateVisibilityByInnerComponents')
                .mockClear()
                .mockImplementation();

            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.AUTO,
                bottom: SHADOW_VISIBILITY.AUTO,
            });

            expect(
                component._shadows.updateVisibilityByInnerComponents
            ).not.toHaveBeenCalled();
        });

        it('should set always visible', () => {
            const component = createComponent(Container, {});
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
            };
            const version: number = component._shadows.getVersion();
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._wasMouseEnter = true;
            component._gridAutoShadows = false;
            component._shadows._models.top._scrollState.canVerticalScroll =
                true;
            component._shadows._models.bottom._scrollState.canVerticalScroll =
                true;
            component._shadows._models.top._isVisible = false;
            component._shadows._models.bottom._isVisible = false;
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(component._shadows._models.top.isVisible).toBe(true);
            expect(component._shadows._models.bottom.isVisible).toBe(true);
            expect(component._shadows.getVersion()).not.toEqual(version);
        });
        it("should't update version until the mouse has been hover.", () => {
            const component = createComponent(Container, {});
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
            };
            const version: number = component._shadows.getVersion();
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._shadows._models.top._scrollState.canVerticalScroll =
                true;
            component._shadows._models.bottom._scrollState.canVerticalScroll =
                true;
            component._shadows._models.top._isVisible = false;
            component._shadows._models.bottom._isVisible = false;
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(component._shadows._models.top.isVisible).toBe(true);
            expect(component._shadows._models.bottom.isVisible).toBe(true);
            expect(component._shadows.getVersion()).toBe(version);
        });
        it("should't synchronize view if optimized shadows enabled.", () => {
            const component = createComponent(Container, {});
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
            };
            const version: number = component._shadows.getVersion();
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._isOptimizeShadowEnabled = true;
            component._wasMouseEnter = true;
            component._shadows._models.top._scrollState.canVerticalScroll =
                true;
            component._shadows._models.bottom._scrollState.canVerticalScroll =
                true;
            component._shadows._models.top._isVisible = false;
            component._shadows._models.bottom._isVisible = false;
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(component._shadows._models.top.isVisible).toBe(true);
            expect(component._shadows._models.bottom.isVisible).toBe(true);
            expect(component._shadows.getVersion()).toBe(version);
        });
        it('should init headers if mouse has not been hover and shadows are forced enabled.', () => {
            const component = createComponent(Container, {});
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    children: [],
                },
            };
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            jest.spyOn(component._stickyController, 'init')
                .mockClear()
                .mockImplementation();
            component._shadows._models.top._scrollState.canVerticalScroll =
                true;
            component._shadows._models.bottom._scrollState.canVerticalScroll =
                true;
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(component._stickyController.init).toHaveBeenCalled();
        });
        it('should set always invisible', () => {
            const component = createComponent(Container, {});
            const version: number = component._shadows.getVersion();
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._wasMouseEnter = true;
            component._shadows._models.top._scrollState.canVerticalScroll =
                true;
            component._shadows._models.bottom._scrollState.canVerticalScroll =
                true;
            component._shadows._models.top._scrollState.verticalPosition =
                SCROLL_POSITION.MIDDLE;
            component._shadows._models.bottom._scrollState.verticalPosition =
                SCROLL_POSITION.MIDDLE;
            component._shadows._models.top._isVisible = true;
            component._shadows._models.bottom._isVisible = true;
            component._updateShadowVisibility(event, {
                top: SHADOW_VISIBILITY.HIDDEN,
                bottom: SHADOW_VISIBILITY.HIDDEN,
            });
            expect(component._shadows._models.top.isVisible).toBe(false);
            expect(component._shadows._models.bottom.isVisible).toBe(false);
            expect(component._shadows.getVersion()).not.toEqual(version);
        });
    });

    describe('_positionChangedHandler', () => {
        it('should update scrollTop, scrollOrientation: "vertical"', () => {
            const component = createComponent(Container, {
                scrollOrientation: 'vertical',
            });
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    scrollTop: 100,
                },
            };
            component._container = {
                offsetHeight: 100,
            };
            jest.spyOn(component, '_updateStateAndGenerateEvents')
                .mockClear()
                .mockImplementation();
            component._positionChangedHandler(
                {},
                10,
                SCROLL_DIRECTION.VERTICAL
            );
            expect(component._children.content.scrollTop).toBe(10);
        });
    });
});
