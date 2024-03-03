import { Logger } from 'UICommon/Utils';
import { _ContainerBase as ContainerBase } from 'Controls/scroll';
import { IContainerBaseOptions } from 'Controls/_scroll/ContainerBase';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';
import { SCROLL_DIRECTION, SCROLL_POSITION } from 'Controls/_scroll/Utils/Scroll';
import * as Env from 'Env/Env';

const global = (function () {
    // eslint-disable-next-line no-eval
    return this || (0 || eval)('this');
})();

function getBoundingClientRectMock() {
    return { height: 30, width: 50 };
}

describe('Controls/scroll:ContainerBase', () => {
    const options: IContainerBaseOptions = {
        scrollOrientation: SCROLL_MODE.VERTICAL,
    };

    const contains: Function = () => {
        return false;
    };
    const classList = {
        contains: () => {
            return false;
        },
    };

    describe('_beforeMount', () => {
        it('should create models', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._beforeMount(options);
            expect(control._resizeObserver).toBeDefined();
            expect(control._scrollCssClass).toBe('controls-Scroll-ContainerBase__scroll_vertical');
            expect(control._initialScrollPositionCssClass).toBe(
                'controls-Scroll-ContainerBase__scrollPosition-regular'
            );
        });

        it('initialScrollPosition, vertical: end', () => {
            const testOptions = {
                ...options,
                initialScrollPosition: {
                    vertical: SCROLL_POSITION.END,
                },
            };
            const control: ContainerBase = new ContainerBase(testOptions);
            control._beforeMount(testOptions);
            expect(control._initialScrollPositionCssClass).toBe(
                'controls-Scroll-ContainerBase__scrollPosition-vertical-end'
            );
        });

        it('initialScrollPosition, horizontal: end', () => {
            const testOptions = {
                ...options,
                initialScrollPosition: {
                    horizontal: SCROLL_POSITION.END,
                },
            };
            const control: ContainerBase = new ContainerBase(testOptions);
            control._beforeMount(testOptions);
            expect(control._initialScrollPositionCssClass).toBe(
                'controls-Scroll-ContainerBase__scrollPosition-horizontal-end'
            );
        });
    });

    describe('_componentDidMount', () => {
        it('should restore scrollTop to 0', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._children = { content: { scrollTop: 10 } };
            control._container = {
                dataset: {
                    scrollContainerNode: 'true',
                },
            };
            control._componentDidMount();
            expect(control._children.content.scrollTop).toBe(0);
        });

        it('should not restore scrollTop to 0', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._children = { content: { scrollTop: 10 } };
            control._container = {
                dataset: {
                    /* scrollContainerNode is missing */
                },
            };
            control._componentDidMount();
            expect(control._children.content.scrollTop).toBe(10);
        });

        it('should restore flex-direction and set scrollTop to end. vertical: end.', () => {
            const testOptions = {
                ...options,
                initialScrollPosition: {
                    vertical: SCROLL_POSITION.END,
                },
            };
            const control: ContainerBase = new ContainerBase(testOptions);
            control._options = testOptions;
            control._children = {
                content: {
                    scrollTop: 10,
                    scrollHeight: 100,
                    classList: {
                        remove: jest.fn(),
                        add: jest.fn(),
                    },
                },
            };
            control._componentDidMount();
            expect(control._children.content.scrollTop).toBe(100);
            expect(control._children.content.classList.remove).toHaveBeenCalledWith(
                'controls-Scroll-ContainerBase__scrollPosition-vertical-end'
            );
            expect(control._children.content.classList.add).toHaveBeenCalledWith(
                'controls-Scroll-ContainerBase__scrollPosition-regular'
            );
        });

        it('should restore flex-direction and set scrollTop to end. horizontal: end.', () => {
            const testOptions = {
                ...options,
                initialScrollPosition: {
                    horizontal: SCROLL_POSITION.END,
                },
            };
            const control: ContainerBase = new ContainerBase(testOptions);
            control._options = testOptions;
            control._children = {
                content: {
                    scrollLeft: 10,
                    scrollWidth: 100,
                    classList: {
                        remove: jest.fn(),
                        add: jest.fn(),
                    },
                },
            };
            control._container = {
                dataset: {},
            };
            control._componentDidMount();
            expect(control._children.content.scrollLeft).toBe(100);
            expect(control._children.content.classList.remove).toHaveBeenCalledWith(
                'controls-Scroll-ContainerBase__scrollPosition-horizontal-end'
            );
            expect(control._children.content.classList.add).toHaveBeenCalledWith(
                'controls-Scroll-ContainerBase__scrollPosition-regular'
            );
        });
    });

    describe('_afterMount', () => {
        it('should initialize models', () => {
            const control: ContainerBase = new ContainerBase(options);
            const children = [{ classList: { contains } }, { classList: { contains } }];
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            jest.spyOn(control._resizeObserver, 'observe').mockClear().mockImplementation();
            control._controlResizeHandler = jest.fn();
            control._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                },
                userContent: {
                    children,
                },
            };
            control._afterMount();
            expect(control._resizeObserver.observe).toHaveBeenCalled();
            expect(Object.keys(control._observedElements)).toHaveLength(0);
        });
    });

    describe('_beforeUpdate', () => {
        it('should update state and generate events if ResizeObserver is not supported ', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);
            control._scrollModel = {
                scrollTop: 0,
                scrollLeft: 0,
            };
            control._dnDAutoScroll = {
                updateOptions: () => {
                    return 0;
                },
            };
            control._beforeUpdate({
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });
            expect(control._scrollCssClass).toBe(
                'controls-Scroll-ContainerBase__scroll_verticalHorizontal'
            );
        });
    });

    describe('_afterUpdate', () => {
        let control;
        const content = {
            scrollTop: 10,
            scrollLeft: 20,
            clientHeight: 30,
            scrollHeight: 40,
            clientWidth: 50,
            scrollWidth: 60,
            getBoundingClientRect: getBoundingClientRectMock,
        };

        beforeEach(() => {
            control = new ContainerBase();
            control._state = {};
            control._children = {
                content,
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

            jest.spyOn(control, '_generateEvent').mockClear().mockImplementation();
            jest.spyOn(control._listCompatible, 'generateCompatibleEvents')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control._listCompatible, 'onRegisterNewListScrollComponent')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control._listCompatible, 'sendByListScrollRegistrar')
                .mockClear()
                .mockImplementation();
        });

        afterEach(() => {
            control = null;
        });

        it('should update state from dom if resize observer unavailable', () => {
            control._resizeObserverSupported = false;
            jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(control, '_unobserveDeleted').mockClear().mockImplementation();
            control._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            jest.spyOn(control, '_isHorizontalScroll').mockClear().mockImplementation();
            control._afterMount();
            control._afterUpdate();

            expect(control._scrollModel.scrollTop).toBe(content.scrollTop);
            expect(control._scrollModel.scrollLeft).toBe(content.scrollLeft);
            expect(control._scrollModel.clientHeight).toBe(content.clientHeight);
            expect(control._scrollModel.scrollHeight).toBe(content.scrollHeight);
            expect(control._scrollModel.clientWidth).toBe(content.clientWidth);
            expect(control._scrollModel.scrollWidth).toBe(content.scrollWidth);
        });

        it("should't update state from dom if resize observer available", () => {
            control._resizeObserverSupported = true;
            jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(control, '_unobserveDeleted').mockClear().mockImplementation();

            control._afterUpdate();

            expect(control._state.scrollTop).not.toBeDefined();
            expect(control._state.scrollLeft).not.toBeDefined();
            expect(control._state.clientHeight).not.toBeDefined();
            expect(control._state.scrollHeight).not.toBeDefined();
            expect(control._state.clientWidth).not.toBeDefined();
            expect(control._state.scrollWidth).not.toBeDefined();
        });

        it('should update observed containers', () => {
            const children = [
                {
                    classList: {
                        contains: () => {
                            return true;
                        },
                    },
                },
                { classList: { contains } },
            ];
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);
            control._resizeObserverSupported = true;

            jest.spyOn(control._resizeObserver, 'observe').mockClear().mockImplementation();
            jest.spyOn(control._resizeObserver, 'unobserve').mockClear().mockImplementation();
            control._children.userContent.children = children;
            control._observedElements = [children[0], 'children3'];
            control._contentType = 'restricted';
            control._afterUpdate();

            expect(control._observedElements).toEqual(children);
        });
    });

    describe('_beforeUnmount', () => {
        it('should destroy models and controllers', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                dataset: {
                    scrollContainerNode: 0,
                },
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            jest.spyOn(control._resizeObserver, 'terminate').mockClear().mockImplementation();
            control._dnDAutoScroll = {
                destroy: () => {
                    return 0;
                },
            };

            control._beforeUnmount();

            expect(control._resizeObserver.terminate).toHaveBeenCalled();
            expect(control._scrollModel).toBeNull();
            expect(control._oldScrollState).toBeNull();
        });
    });

    describe('_resizeHandler', () => {
        it('should destroy models and controllers', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            const content = {
                scrollTop: 10,
                scrollLeft: 20,
                clientHeight: 30,
                scrollHeight: 40,
                clientWidth: 50,
                scrollWidth: 60,
                getBoundingClientRect: getBoundingClientRectMock,
            };

            control._children = {
                content,
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

            control._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(control, '_isHorizontalScroll').mockClear().mockImplementation();
            control._afterMount();

            control._resizeHandler();

            expect(control._scrollModel.scrollTop).toBe(content.scrollTop);
            expect(control._scrollModel.scrollLeft).toBe(content.scrollLeft);
            expect(control._scrollModel.clientHeight).toBe(content.clientHeight);
            expect(control._scrollModel.scrollHeight).toBe(content.scrollHeight);
            expect(control._scrollModel.clientWidth).toBe(content.clientWidth);
            expect(control._scrollModel.scrollWidth).toBe(content.scrollWidth);
        });
    });

    describe('_resizeObserverCallback', () => {
        it("should't update state if container is invisible", () => {
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            control._container = {
                closest: jest.fn().mockReturnValue(true),
                className: '',
            };

            const getComputedStyle = global.getComputedStyle;
            global.getComputedStyle = () => {
                return {};
            };

            jest.spyOn(control, '_updateStateAndGenerateEvents').mockClear().mockImplementation();

            control._resizeObserverCallback();

            expect(control._updateStateAndGenerateEvents).not.toHaveBeenCalled();

            global.getComputedStyle = getComputedStyle;
        });
    });

    describe('_scrollHandler', () => {
        it('should scroll to locked position if its specified', () => {
            const position: number = 10;
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            control._scrollLockedPosition = position;
            control._children = {
                content: {
                    scrollTop: 0,
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

            control._scrollHandler({ currentTarget: { scrollTop: position } });

            expect(control._children.content.scrollTop).toBe(position);
        });

        it("should't scroll if locked position is not specified", () => {
            const position: number = 10;
            const control: ContainerBase = new ContainerBase(options);
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._beforeMount(options);

            control._scrollLockedPosition = null;
            control._children = {
                content: {
                    scrollTop: position,
                    getBoundingClientRect: getBoundingClientRectMock,
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
            control._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(control, '_isHorizontalScroll').mockClear().mockImplementation();
            control._afterMount();

            control._scrollHandler({ currentTarget: { scrollTop: position } });

            expect(control._children.content.scrollTop).toBe(position);
        });
    });

    describe('_registerIt', () => {
        it('should register on all registrars', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._beforeMount(options);

            jest.spyOn(control._registrars.scrollStateChanged, 'register')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control._registrars.listScroll, 'register').mockClear().mockImplementation();
            jest.spyOn(control._registrars.customscroll, 'register')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control, '_onRegisterNewComponent').mockClear().mockImplementation();
            control._scrollModel = {};

            const registerTypes = ['scrollStateChanged', 'listScroll', 'customscroll'];
            registerTypes.forEach((registerType) => {
                control._registerIt('event', registerType);
            });

            expect(control._registrars.scrollStateChanged.register).toHaveBeenCalled();
            expect(control._registrars.listScroll.register).toHaveBeenCalled();
            expect(control._registrars.customscroll.register).toHaveBeenCalled();
        });
    });

    describe('_unRegisterIt', () => {
        it('should unregister on all registrars', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._beforeMount(options);

            jest.spyOn(control._registrars.scrollStateChanged, 'unregister')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control._registrars.listScroll, 'unregister')
                .mockClear()
                .mockImplementation();
            jest.spyOn(control._registrars.customscroll, 'unregister')
                .mockClear()
                .mockImplementation();

            const registerTypes = ['scrollStateChanged', 'listScroll', 'customscroll'];
            registerTypes.forEach((registerType) => {
                control._unRegisterIt('event', registerType);
            });

            expect(control._registrars.scrollStateChanged.unregister).toHaveBeenCalled();
            expect(control._registrars.listScroll.unregister).toHaveBeenCalled();
            expect(control._registrars.customscroll.unregister).toHaveBeenCalled();
        });
    });

    describe('scrollTo', () => {
        it('should scroll vertical', () => {
            const control: ContainerBase = new ContainerBase(options);
            const newPosition: number = 10;
            control._beforeMount(options);

            control._children = {
                content: {
                    scrollTop: 0,
                },
            };

            control.scrollTo(newPosition);

            expect(control._children.content.scrollTop).toBe(newPosition);
        });

        it('should scroll horizontal', () => {
            const control: ContainerBase = new ContainerBase(options);
            const newPosition: number = 10;
            control._beforeMount(options);

            control._children = {
                content: {
                    scrollLeft: 0,
                },
            };

            control.scrollTo(newPosition, SCROLL_DIRECTION.HORIZONTAL);

            expect(control._children.content.scrollLeft).toBe(newPosition);
        });
    });

    describe('canScrollTo', () => {
        [
            {
                offset: 0,
                scrollHeight: 100,
                clientHeight: 100,
                result: true,
            },
            {
                offset: 50,
                scrollHeight: 200,
                clientHeight: 100,
                result: true,
            },
            {
                offset: 50,
                scrollHeight: 100,
                clientHeight: 100,
                result: false,
            },
        ].forEach((test) => {
            it(`should return ${test.result} if offset = ${test.offset},  scrollHeight = ${test.scrollHeight},  clientHeight = ${test.clientHeight}`, () => {
                const control: ContainerBase = new ContainerBase(options);
                control._scrollModel = {
                    scrollHeight: test.scrollHeight,
                    clientHeight: test.clientHeight,
                };

                if (test.result) {
                    expect(control.canScrollTo(test.offset)).toBe(true);
                } else {
                    expect(control.canScrollTo(test.offset)).toBe(false);
                }
            });
        });
    });

    describe('Scroll Smooth', () => {
        it('should instant scroll if browser is IE', () => {
            const control = new ContainerBase(options);
            const originalDetection = Env.detection.isIE11;
            Env.detection.isIE11 = true;
            const scrollToSpy = jest.fn();
            control._children = {
                content: {
                    scrollTo: scrollToSpy,
                },
            };

            control._scrollTo(0, true);
            expect(scrollToSpy).not.toHaveBeenCalled();
            Env.detection.isIE11 = originalDetection;
        });
    });

    describe('horizontalScrollTo', () => {
        it('should scroll', () => {
            const control: ContainerBase = new ContainerBase(options);
            const newPosition: number = 10;
            control._beforeMount(options);

            control._children = {
                content: {
                    scrollLeft: 0,
                },
            };

            control.horizontalScrollTo(newPosition);

            expect(control._children.content.scrollLeft).toBe(newPosition);
        });
    });

    describe('scrollTo edge', () => {
        [
            {
                position: 'Top',
                scrollPosition: 0,
                checkProperty: 'scrollTop',
            },
            {
                position: 'Bottom',
                scrollPosition: 100,
                checkProperty: 'scrollTop',
            },
            {
                position: 'Left',
                scrollPosition: 0,
                checkProperty: 'scrollLeft',
            },
            {
                position: 'Right',
                scrollPosition: 100,
                checkProperty: 'scrollLeft',
            },
        ].forEach((test) => {
            it(`should scroll to ${test.position}`, () => {
                const control: ContainerBase = new ContainerBase(options);
                control._beforeMount(options);

                control._children = {
                    content: {
                        scrollTop: 10,
                        scrollHeight: 200,
                        clientHeight: 100,
                        scrollLeft: 10,
                        scrollWidth: 200,
                        clientWidth: 100,
                        getBoundingClientRect: getBoundingClientRectMock,
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
                control._resizeObserver = {
                    isResizeObserverSupported: () => {
                        return true;
                    },
                    observe: () => {
                        return 0;
                    },
                    controlResizeHandler: () => {
                        return 0;
                    },
                };
                jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
                jest.spyOn(control, '_isHorizontalScroll').mockClear().mockImplementation();
                control._container = {
                    closest: jest.fn().mockReturnValue(false),
                };
                control._afterMount();

                control._scrollModel._scrollTop = control._children.content.scrollTop;
                control._scrollModel._scrollHeight = control._children.content.scrollHeight;
                control._scrollModel._clientHeight = control._children.content.clientHeight;
                control._scrollModel._scrollLeft = control._children.content.scrollLeft;
                control._scrollModel._scrollWidth = control._children.content.scrollWidth;
                control._scrollModel._clientWidth = control._children.content.clientWidth;

                control[`scrollTo${test.position}`]();

                expect(control._children.content[test.checkProperty]).toBe(test.scrollPosition);
            });
        });
    });

    describe('_onRegisterNewComponent', () => {
        it('should propagate event to registered component', () => {
            const registeredControl: string = 'registeredControl';
            const control: ContainerBase = new ContainerBase(options);
            control._beforeMount(options);
            control._isStateInitialized = true;
            control._scrollModel = {
                clone: () => {
                    return 0;
                },
            };
            control._oldScrollState = {
                clone: () => {
                    return 0;
                },
            };

            jest.spyOn(control._registrars.scrollStateChanged, 'startOnceTarget')
                .mockClear()
                .mockImplementation();
            control._onRegisterNewComponent(registeredControl);
            expect(control._registrars.scrollStateChanged.startOnceTarget).toHaveBeenCalledWith(
                registeredControl,
                0,
                0
            );
        });
    });

    describe('_updateState', () => {
        it('scrollState and oldScrollState should be different', () => {
            const component = new ContainerBase();
            component._children = {
                content: {
                    getBoundingClientRect: getBoundingClientRectMock,
                    scrollTop: 100,
                },
            };
            component._updateState({});
            expect(component._scrollModel.scrollTop).not.toEqual(
                component._oldScrollState.scrollTop
            );
            expect(component._oldScrollState.scrollTop).not.toBeDefined();
        });

        it('should not update state if unchanged state arrives', () => {
            const inst: ContainerBase = new ContainerBase();
            inst._children = {
                content: {
                    scrollTop: 0,
                    getBoundingClientRect: getBoundingClientRectMock,
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
            inst._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            jest.spyOn(inst, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(inst, '_isHorizontalScroll').mockClear().mockImplementation();
            inst._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            inst._afterMount();
            expect(inst._updateState({ scrollTop: 0 })).toBe(false);
        });

        it('should update state if changed state arrives', () => {
            const inst = new ContainerBase();
            inst._children = {
                content: {
                    scrollTop: 0,
                    getBoundingClientRect: getBoundingClientRectMock,
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
            inst._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            jest.spyOn(inst, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(inst, '_isHorizontalScroll').mockClear().mockImplementation();
            inst._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            inst._afterMount();
            expect(inst._updateState({ scrollTop: 1 })).toBe(true);
        });
    });

    describe('onRegisterNewListScrollComponent', () => {
        it('should propagate event to registered component', () => {
            const registeredControl: string = 'registeredControl';
            const control: ContainerBase = new ContainerBase(options);
            control._beforeMount(options);
            control._children = {
                content: {
                    scrollTop: 0,
                    scrollLeft: 0,
                    clientHeight: 100,
                    scrollHeight: 100,
                    clientWidth: 100,
                    scrollWidth: 100,
                    getBoundingClientRect: () => {
                        return { height: 100, width: 100 };
                    },
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
            control._resizeObserver = {
                isResizeObserverSupported: () => {
                    return true;
                },
                observe: () => {
                    return 0;
                },
                controlResizeHandler: () => {
                    return 0;
                },
            };
            jest.spyOn(control, '_getFullStateFromDOM')
                .mockClear()
                .mockReturnValue({ height: 100, width: 100 });
            jest.spyOn(control, '_observeContentSize').mockClear().mockImplementation();
            jest.spyOn(control, '_isHorizontalScroll').mockClear().mockImplementation();
            control._container = {
                closest: jest.fn().mockReturnValue(false),
            };
            control._afterMount();

            jest.spyOn(control._registrars.listScroll, 'startOnceTarget')
                .mockClear()
                .mockImplementation();
            control._listCompatible.onRegisterNewListScrollComponent(
                control._registrars.listScroll,
                control._scrollModel,
                registeredControl
            );
            expect(control._registrars.listScroll.startOnceTarget).toHaveBeenCalledWith(
                registeredControl,
                'cantScroll',
                expect.anything()
            );
            expect(control._registrars.listScroll.startOnceTarget).toHaveBeenCalledWith(
                registeredControl,
                'viewportResize',
                expect.anything()
            );
        });
    });

    describe('_lockScrollPositionUntilKeyboardShown', () => {
        it('should set 0 if scroll state is not initialized', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._lockScrollPositionUntilKeyboardShown();
            expect(control._scrollLockedPosition).toBe(0);
        });

        it('should set value from scroll state', () => {
            const control: ContainerBase = new ContainerBase(options);
            control._scrollModel = { scrollTop: 10 };
            control._lockScrollPositionUntilKeyboardShown();
            expect(control._scrollLockedPosition).toBe(control._scrollModel.scrollTop);
        });
    });

    describe('_enableVirtualNavigationHandler, _disableVirtualNavigationHandler', () => {
        ['_enableVirtualNavigationHandler', '_disableVirtualNavigationHandler'].forEach(
            (method) => {
                it('should stop event propagation', () => {
                    const control: ContainerBase = new ContainerBase(options);
                    control._beforeMount(options);
                    const event = {
                        stopImmediatePropagation: jest.fn(),
                    };
                    control[method](event);
                    expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
                });
            }
        );
    });

    describe('_logScrollPosition', () => {
        it('не логирует положение скролла если логирование выключено', () => {
            const control: ContainerBase = new ContainerBase(options);
            jest.spyOn(Logger, 'warn').mockClear().mockImplementation();

            control._logScrollPosition(10, 10);

            expect(Logger.warn).not.toHaveBeenCalled();
        });

        it('логирует положение скролла если логирование включено', () => {
            const control: ContainerBase = new ContainerBase(options);
            ContainerBase.setDebug(true);

            jest.spyOn(Logger, 'warn').mockClear().mockImplementation();

            control._logScrollPosition(10, 10);

            expect(Logger.warn).toHaveBeenCalledWith(
                'Controls/scroll:ContainerBase: изменение положения скролла. ' +
                    'По вертикали: новое 10, старое 0. По горизонтали: новое 10, старое 0.',
                expect.anything()
            );
        });
    });
});
