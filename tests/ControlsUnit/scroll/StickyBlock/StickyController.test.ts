/**
 * @jest-environment jsdom
 */
import StickyController from 'Controls/_stickyBlock/Controllers/StickyController';
import { IStickyDataContext, ScrollShadowVisibility } from 'Controls/_stickyBlock/types';
import { StickyIntersectionController } from 'Controls/_stickyBlock/Controllers/StickyIntersectionController';
import StickySizeController from 'Controls/_stickyBlock/Controllers/StickySizeController';
import ScrollModel from 'Controls/_scroll/Utils/ScrollModel';
import * as functions from 'Controls/_stickyBlock/Controllers/helpers/functions';
import * as Utils from 'Controls/_stickyBlock/Utils/Utils';

describe('Controls/_stickyBlock/Controllers/StickyController', () => {
    const mockObservers = {
        observerTop: {
            current: 1,
        },
        observerTop2: {
            current: {
                style: {
                    top: 0,
                },
            },
        },
        observerTop2Right: {
            current: {
                style: {
                    top: 0,
                },
            },
        },
        observerBottomLeft: {
            current: 1,
        },
        observerBottomRight: {
            current: 1,
        },
        observerLeft: {
            current: 1,
        },
        observerRight: {
            current: 1,
        },
    };

    function mockStickyRef(isVisible: boolean, id: string): object {
        return {
            current: {
                id,
                closest: jest.fn(),
                display: 'block',
                style: {
                    position: 'sticky',
                    top: '',
                    bottom: '',
                    left: '',
                    right: '',
                },
                getBoundingClientRect: () => {
                    return { height: 10 };
                },
                querySelector: () => {
                    return {
                        closest: () => {
                            return !isVisible;
                        },
                        getBoundingClientRect: () => {
                            return { height: 1 };
                        },
                    };
                },
            },
        };
    }

    function mocksForRegister(stickyController: StickyController): void {
        jest.spyOn(StickyIntersectionController.prototype, 'observe').mockImplementation();
        jest.spyOn(StickyIntersectionController.prototype, 'init').mockImplementation();
        jest.spyOn(StickySizeController.prototype, 'unobserve').mockImplementation();
        jest.spyOn(Utils, 'isHidden').mockReturnValue(false);
        stickyController.scrollStateChanged(
            new ScrollModel(document.createElement('div'), {
                scrollHeight: 200,
                clientHeight: 100,
            })
        );
    }

    function getStickyBlocksData(): {
        block0: object;
        block1: object;
        block2: object;
    } {
        const block0 = {
            id: '0',
            stickyRef: mockStickyRef(true, '0'),
            isGroup: false,
            fixedPosition: '',
            props: {
                shadowVisibility: 'visible',
                mode: 'stackable',
                position: 'top',
                offsetTop: 0,
            },
            observers: mockObservers,
        };
        const block1 = {
            id: '1',
            stickyRef: mockStickyRef(true, '1'),
            isGroup: false,
            fixedPosition: '',
            props: {
                shadowVisibility: 'visible',
                mode: 'stackable',
                position: 'top',
                offsetTop: 0,
            },
            observers: mockObservers,
        };
        const block2 = {
            id: '2',
            stickyRef: mockStickyRef(true, '2'),
            isGroup: false,
            fixedPosition: '',
            props: {
                shadowVisibility: 'visible',
                mode: 'stackable',
                position: 'top',
                offsetTop: 0,
            },
            observers: mockObservers,
        };
        return { block0, block1, block2 };
    }

    describe('register', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn, jest.fn);
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        [
            {
                blocksData: {
                    block0: {
                        id: '0',
                        stickyRef: mockStickyRef(true, '0'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'replaceable',
                            position: 'top',
                            offsetTop: 0,
                        },
                        observers: mockObservers,
                    },
                    block1: {
                        id: '1',
                        stickyRef: mockStickyRef(true, '1'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'replaceable',
                            position: 'top',
                            offsetTop: 0,
                        },
                        observers: mockObservers,
                    },
                    block2: {
                        id: '2',
                        stickyRef: mockStickyRef(true, '2'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'replaceable',
                            position: 'top',
                            offsetTop: 0,
                        },
                        observers: mockObservers,
                    },
                },
                expectedData: {
                    0: {
                        offset: { top: 0 },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                    1: {
                        offset: { top: 0 },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                    2: {
                        offset: { top: 0 },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                },
            },
            {
                blocksData: {
                    block0: {
                        id: '0',
                        stickyRef: mockStickyRef(true, '0'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'stackable',
                            position: 'top',
                            offsetTop: 0,
                        },
                        observers: mockObservers,
                    },
                    block1: {
                        id: '1',
                        stickyRef: mockStickyRef(true, '1'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'replaceable',
                            position: 'top',
                            offsetTop: 0,
                        },
                        observers: mockObservers,
                    },
                    block2: {
                        id: '2',
                        stickyRef: mockStickyRef(true, '2'),
                        isGroup: false,
                        props: {
                            shadowVisibility: 'visible',
                            mode: 'stackable',
                            position: 'top',
                            offsetTop: 7,
                        },
                        observers: mockObservers,
                    },
                },
                expectedData: {
                    0: {
                        offset: {
                            top: 0,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                    1: {
                        offset: {
                            top: 27,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                    2: {
                        offset: {
                            top: 17,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        shadow: {
                            top: undefined,
                            bottom: undefined,
                            left: undefined,
                            right: undefined,
                        },
                        fixedPosition: '',
                        syntheticFixedPosition: {
                            fixedPosition: '',
                            prevPosition: '',
                        },
                    },
                },
            },
        ].forEach((testData, i) => {
            // 1. Зовем три раза register со стики блоками с разными пропсами
            // 2. Проверяем, что по итогу все они есть в модели с корректными оффсетами
            it(`${i}) возвращаются корректные модели при регистрации стики блоков с разными конфигурациями`, async () => {
                jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                    return 10;
                });
                mocksForRegister(stickyController);
                jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                    switch (element.id) {
                        case '0':
                            return 0;
                        case '1':
                            return 100;
                        case '2':
                            return 50;
                    }
                });

                const registerCallbackPromise = contextData.registerCallback(
                    testData.blocksData.block0
                );
                contextData.registerCallback(testData.blocksData.block1);
                contextData.registerCallback(testData.blocksData.block2);
                await registerCallbackPromise;
                expect(contextData.models).toEqual(testData.expectedData);
            });
        });

        it('При регистрации в модель проставляется offset.top равный значению опции offsetTop', async () => {
            mocksForRegister(stickyController);
            const block = {
                id: '0',
                stickyRef: mockStickyRef(true, '0'),
                isGroup: false,
                props: {
                    shadowVisibility: 'visible',
                    mode: 'stackable',
                    position: 'top',
                    offsetTop: -10,
                },
                observers: mockObservers,
            };
            const expectedData = {
                0: {
                    offset: {
                        top: -10,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: false,
                        bottom: false,
                        left: false,
                        right: false,
                    },
                    fixedPosition: '',
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
            };

            contextData.registerCallback(block);
            expect(contextData.models).toEqual(expectedData);
        });
    });

    describe('unregister', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn(), jest.fn());
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        // 1. Мокаем все данные, зарегано 3 блока
        // 2. Зовем для одного из блоков unregister
        // 3. Проверяем, что из модели он пропал и что у других блоков пересчитались оффсеты
        it('После разрегистрации одного стики блока контроллер пересчитывает оставшиеся', async () => {
            const stickyBlocksData = getStickyBlocksData();
            stickyBlocksData.block1.props.mode = 'replaceable';
            stickyBlocksData.block2.props.offsetTop = 7;

            mocksForRegister(stickyController);
            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 10;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            contextData.unregisterCallback('0');
            const expectedData = {
                1: {
                    fixedPosition: '',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                2: {
                    fixedPosition: '',
                    offset: {
                        top: 7,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
            };
            expect(contextData.models).toEqual(expectedData);
        });
    });

    describe('modeChanged', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn(), jest.fn());
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        // 1. Зарегано 3 блока
        // 2. Зовем у одного из них modeChanged
        // 3. Проверяем, что в модели пересчитались тени и оффсеты
        it('Пересчитываются тени и оффсеты, если поменялся mode', async () => {
            const stickyBlocksData = getStickyBlocksData();
            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            const spyUpdateShadows = jest.spyOn(stickyController, '_updateShadows');
            const spyUpdateOffsets = jest.spyOn(stickyController, '_updateOffsets');
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 20;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            const expectedData = {
                0: {
                    fixedPosition: '',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                1: {
                    fixedPosition: '',
                    offset: {
                        top: 20,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                2: {
                    fixedPosition: '',
                    offset: {
                        top: 40,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
            };
            expect(spyUpdateShadows).toHaveBeenCalledTimes(1);
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(1);
            expect(contextData.models).toEqual(expectedData);
            contextData.modeChangedCallback('1', 'replaceable');
            expect(spyUpdateShadows).toHaveBeenCalledTimes(2);
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(2);
            expectedData['2'].offset.top = 20;
            expect(contextData.models).toEqual(expectedData);
        });
    });

    describe('offsetChanged', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn(), jest.fn());
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        // 1. Зарегано 3 блока
        // 2. Зовем одного из них offsetChanged
        // 3. Проверяем, что в модели пересчитались оффсеты
        it('Пересчитываются оффсеты, если изменился offset', async () => {
            const stickyBlocksData = getStickyBlocksData();
            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            const spyUpdateOffsets = jest.spyOn(stickyController, '_updateOffsets');
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 20;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            const expectedData = {
                0: {
                    fixedPosition: '',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                1: {
                    fixedPosition: '',
                    offset: {
                        top: 20,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                2: {
                    fixedPosition: '',
                    offset: {
                        top: 40,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
            };
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(1);
            expect(contextData.models).toEqual(expectedData);
            contextData.offsetChangedCallback('1', 10);
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(2);
            expectedData['1'].offset.top = 30;
            expectedData['2'].offset.top = 50;
            expect(contextData.models).toEqual(expectedData);
        });
    });

    describe('scrollStateChanged', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn(), jest.fn());
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        // 1. Зарегано 3 блока
        // 2. Зовем scrollStateChanged и меняем verticalPosition
        // 3. Проверяем, что в модели пересчитались тени, оффсеты не пересчитываются
        it('Пересчитываются тени (оффсеты не пересчитываются), если был вызван scrollStateChanged', async () => {
            const stickyBlocksData = getStickyBlocksData();
            const spyUpdateShadows = jest.spyOn(stickyController, '_updateShadows');
            const spyUpdateOffsets = jest.spyOn(stickyController, '_updateOffsets');
            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 20;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            stickyController.init();
            expect(spyUpdateShadows).toHaveBeenCalledTimes(1);
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(1);
            stickyController.scrollStateChanged(
                new ScrollModel(document.createElement('div'), {
                    scrollTop: 100,
                })
            );
            expect(spyUpdateShadows).toHaveBeenCalledTimes(2);
            expect(spyUpdateOffsets).toHaveBeenCalledTimes(1);
        });
    });

    describe('setShadowVisibility', () => {
        let stickyController;
        let contextData: IStickyDataContext;
        const dispatch = (_contextData) => {
            contextData = _contextData;
        };
        beforeEach(() => {
            stickyController = new StickyController(dispatch, jest.fn(), jest.fn());
            jest.spyOn(stickyController, '_updateFixedInitially').mockImplementation();
            jest.spyOn(stickyController, '_resizeObserve').mockImplementation();
            jest.spyOn(global.window, 'getComputedStyle').mockImplementation();
        });

        afterEach(() => {
            contextData = null;
            stickyController = null;
        });

        // 1. Зарегано 3 блока
        // 2. Зовем setShadowVisibility и передаем hidden/visible
        // 3. Проверяем, что в модели пересчитались тени
        it('Пересчитываются тени, если скролл контейнер сказал контроллеру показать/скрыть тени', async () => {
            const stickyBlocksData = getStickyBlocksData();

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 20;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            stickyController._fixedPositionChange([
                { id: '0', fixedPosition: 'top', prevFixedPosition: '' },
            ]);
            const expectedData = {
                0: {
                    fixedPosition: 'top',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: 'top',
                        prevPosition: '',
                    },
                },
                1: {
                    fixedPosition: '',
                    offset: {
                        top: 20,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                2: {
                    fixedPosition: '',
                    offset: {
                        top: 40,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
            };
            expect(contextData.models).toEqual(expectedData);
            stickyController.setShadowVisibility(
                ScrollShadowVisibility.Visible,
                ScrollShadowVisibility.Visible
            );
            expectedData['0'].shadow.bottom = true;
            expect(contextData.models).toEqual(expectedData);
        });

        // 1. Зарегано 3 блока с mode replaceable с одинаковой высотой
        // 2. Зовем setShadowVisibility и передаем hidden/visible
        // 3. Проверяем, что в модели пересчитались тени
        it('Пересчитываются тени, если скролл контейнер сказал контроллеру показать/скрыть тени у заменяемых блоков с одинаковой высотой', async () => {
            const stickyBlocksData = getStickyBlocksData();
            stickyBlocksData.block0.props.mode = 'replaceable';
            stickyBlocksData.block1.props.mode = 'replaceable';
            stickyBlocksData.block2.props.mode = 'replaceable';

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                return 20;
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            stickyController._fixedPositionChange([
                { id: '0', fixedPosition: 'top', prevFixedPosition: '' },
                { id: '1', fixedPosition: 'top', prevFixedPosition: '' },
                { id: '2', fixedPosition: 'top', prevFixedPosition: '' },
            ]);
            const expectedData = {
                0: {
                    fixedPosition: 'top',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: 'top',
                    },
                },
                1: {
                    fixedPosition: 'top',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: 'top',
                    },
                },
                2: {
                    fixedPosition: 'top',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: 'top',
                        prevPosition: '',
                    },
                },
            };
            expect(contextData.models).toEqual(expectedData);
            stickyController.setShadowVisibility(
                ScrollShadowVisibility.Visible,
                ScrollShadowVisibility.Visible
            );
            expectedData['0'].shadow.bottom = true;
            expectedData['1'].shadow.bottom = false;
            expectedData['2'].shadow.bottom = false;
            expect(contextData.models).toEqual(expectedData);
        });

        // 1. Зарегано 3 блока с mode replaceable с разной высотой
        // 2. Зовем setShadowVisibility и передаем hidden/visible
        // 3. Проверяем, что в модели пересчитались тени
        it('Пересчитываются тени, если скролл контейнер сказал контроллеру показать/скрыть тени у заменяемых блоков с разной высотой', async () => {
            const stickyBlocksData = getStickyBlocksData();
            stickyBlocksData.block0.props.mode = 'replaceable';
            stickyBlocksData.block1.props.mode = 'replaceable';
            stickyBlocksData.block2.props.mode = 'replaceable';

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                    case '2':
                        return 100;
                }
            });
            mocksForRegister(stickyController);
            jest.spyOn(functions, 'getStickyBlockHeight').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 20;
                    case '1':
                        return 25;
                    case '2':
                        return 30;
                }
            });
            const registerPromise = contextData.registerCallback(stickyBlocksData.block0);
            contextData.registerCallback(stickyBlocksData.block1);
            contextData.registerCallback(stickyBlocksData.block2);
            await registerPromise;

            stickyController._fixedPositionChange([
                { id: '2', fixedPosition: 'top', prevFixedPosition: '' },
            ]);
            const expectedData = {
                0: {
                    fixedPosition: '',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                1: {
                    fixedPosition: '',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: '',
                        prevPosition: '',
                    },
                },
                2: {
                    fixedPosition: 'top',
                    offset: {
                        top: 0,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    shadow: {
                        top: undefined,
                        bottom: undefined,
                        left: undefined,
                        right: undefined,
                    },
                    syntheticFixedPosition: {
                        fixedPosition: 'top',
                        prevPosition: '',
                    },
                },
            };
            expect(contextData.models).toEqual(expectedData);
            stickyController.setShadowVisibility(
                ScrollShadowVisibility.Visible,
                ScrollShadowVisibility.Visible
            );
            expectedData['2'].shadow.bottom = true;
            expect(contextData.models).toEqual(expectedData);
        });
    });
});
