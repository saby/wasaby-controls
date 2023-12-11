import BlocksCollection from 'Controls/_stickyBlock/BlocksCollection';
import {
    FixedPosition,
    IStickyBlockRegisterData,
    StickyVerticalPosition,
} from 'Controls/_stickyBlock/types';
import * as functions from 'Controls/_stickyBlock/Controllers/helpers/functions';
import * as Utils from 'Controls/_stickyBlock/Utils/Utils';

describe('Controls/_stickyBlock/BlocksCollection', () => {
    // 1. Зовем add
    // 2. Проверяем, что блок есть в коллекции через метод get
    it('После вызова "add" стики блок добавился в коллекцию. Вызов "get" вернет добавленный блок', () => {
        const blocksCollection = new BlocksCollection();
        const stickyBlock: IStickyBlockRegisterData = {
            id: '0',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
        };
        blocksCollection.add(stickyBlock);
        expect(blocksCollection.get('0').id).toBe(stickyBlock.id);
    });

    describe('Тесты метода addToStack', () => {
        // 1. В стэке есть 2 блока
        // 2. Зовем addToStack, чтобы блок оказался в конце стэка
        // 3. Проверяем стэк
        it('"addToStack" добавит стики блок в конец стека. Оффсет больше, чем у текущих стики блоков в стеке', () => {
            const blocksCollection = new BlocksCollection();

            // подготовка данных.
            const stickyBlock0: IStickyBlockRegisterData = {
                id: '0',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '0',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            const stickyBlock1: IStickyBlockRegisterData = {
                id: '1',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '1',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            const stickyBlock2: IStickyBlockRegisterData = {
                id: '2',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '2',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            blocksCollection.add(stickyBlock0);
            blocksCollection.add(stickyBlock1);
            blocksCollection.add(stickyBlock2);

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 100;
                    case '2':
                        return 200;
                }
            });
            jest.spyOn(Utils, 'isHidden').mockReturnValue(false);
            blocksCollection.addToStack('1', undefined);
            blocksCollection.addToStack('0', undefined);
            blocksCollection.addToStack('2', undefined);
            expect(blocksCollection.getStack().top).toEqual(['0', '1', '2']);
        });

        // 1. В стэке 2 блока
        // 2. Зовем addToStack, чтобы блок оказался между блоками
        // 3. Проверяем стэк
        it(
            '"addToStack" добавит стики блок в середину стека. Оффсет меньше, чем у "id1", но больше чем' +
                ' у "id0"',
            () => {
                const blocksCollection = new BlocksCollection();

                // подготовка данных.
                const stickyBlock0: IStickyBlockRegisterData = {
                    id: 'id0',
                    props: {
                        position: StickyVerticalPosition.Top,
                    },
                    isGroup: true,
                    stickyRef: {
                        current: {
                            id: '0',
                            getBoundingClientRect: () => {
                                return { height: 10 };
                            },
                        },
                    },
                };
                const stickyBlock1: IStickyBlockRegisterData = {
                    id: 'id1',
                    props: {
                        position: StickyVerticalPosition.Top,
                    },
                    isGroup: true,
                    stickyRef: {
                        current: {
                            id: '1',
                            getBoundingClientRect: () => {
                                return { height: 10 };
                            },
                        },
                    },
                };
                const stickyBlock2: IStickyBlockRegisterData = {
                    id: 'id2',
                    props: {
                        position: StickyVerticalPosition.Top,
                    },
                    isGroup: true,
                    stickyRef: {
                        current: {
                            id: '2',
                            getBoundingClientRect: () => {
                                return { height: 10 };
                            },
                        },
                    },
                };
                blocksCollection.add(stickyBlock0);
                blocksCollection.add(stickyBlock1);
                blocksCollection.add(stickyBlock2);

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
                jest.spyOn(Utils, 'isHidden').mockReturnValue(false);

                blocksCollection.addToStack('id0', undefined);
                blocksCollection.addToStack('id1', undefined);
                blocksCollection.addToStack('id2', undefined);
                expect(blocksCollection.getStack().top).toEqual(['id0', 'id2', 'id1']);
            }
        );

        // 1. В стэке есть 2 блока
        // 2. Зовем addToStack - блок не был добавлен т.к. скрыт
        // 3. Проверяем стэк
        it('"addToStack" не добавит стики блок в стек, т.к. он скрыт', () => {
            const blocksCollection = new BlocksCollection();

            // подготовка данных.
            const stickyBlock0: IStickyBlockRegisterData = {
                id: '0',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '0',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            const stickyBlock1: IStickyBlockRegisterData = {
                id: '1',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '1',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            const stickyBlock2: IStickyBlockRegisterData = {
                id: '2',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '2',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            blocksCollection.add(stickyBlock0);
            blocksCollection.add(stickyBlock1);
            blocksCollection.add(stickyBlock2);

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                if (element.id === '0') {
                    return 0;
                }
                if (element.id === '1') {
                    return 100;
                }
                if (element.id === '2') {
                    return 50;
                }
            });
            jest.spyOn(Utils, 'isHidden').mockImplementation((element) => {
                return element.id === '2';
            });

            const result0 = blocksCollection.addToStack('0', undefined);
            const result1 = blocksCollection.addToStack('1', undefined);
            const result2 = blocksCollection.addToStack('2', undefined);
            expect(blocksCollection.getStack().top).toEqual(['0', '1']);
            expect(result0).toBeTruthy();
            expect(result1).toBeTruthy();
            expect(result2).toBeFalsy();
        });

        it('"addToStack" не добавит стики блок в стек, если он там уже есть', () => {
            const blocksCollection = new BlocksCollection();

            // подготовка данных.
            const stickyBlock0: IStickyBlockRegisterData = {
                id: 'id0',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '0',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            const stickyBlock1: IStickyBlockRegisterData = {
                id: 'id1',
                props: {
                    position: StickyVerticalPosition.Top,
                },
                isGroup: true,
                stickyRef: {
                    current: {
                        id: '1',
                        getBoundingClientRect: () => {
                            return { height: 10 };
                        },
                    },
                },
            };
            blocksCollection.add(stickyBlock0);
            blocksCollection.add(stickyBlock1);

            jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
                switch (element.id) {
                    case '0':
                        return 0;
                    case '1':
                        return 50;
                }
            });
            jest.spyOn(Utils, 'isHidden').mockReturnValue(false);

            blocksCollection.addToStack('id0', undefined);
            blocksCollection.addToStack('id1', undefined);
            blocksCollection.addToStack('id0', undefined);
            expect(blocksCollection.getStack().top).toEqual(['id0', 'id1']);
        });
    });

    // 1. В коллекции есть три блока
    // 2. После вызова remove осталось два
    it('После вызова "remove" стики блок удаляется из коллекции', () => {
        const blocksCollection = new BlocksCollection();

        // подготовка данных.
        const stickyBlock0: IStickyBlockRegisterData = {
            id: '0',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '0',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        const stickyBlock1: IStickyBlockRegisterData = {
            id: '1',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '1',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        const stickyBlock2: IStickyBlockRegisterData = {
            id: '2',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '2',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        blocksCollection.add(stickyBlock0);
        blocksCollection.add(stickyBlock1);
        blocksCollection.add(stickyBlock2);

        expect(blocksCollection.getBlocks()['1']).toBeDefined();
        expect(Object.keys(blocksCollection.getBlocks()).length).toBe(3);
        blocksCollection.remove('1');
        expect(Object.keys(blocksCollection.getBlocks()).length).toBe(2);
        expect(blocksCollection.getBlocks()['1']).toBeUndefined();
    });

    // 1. В стэке есть три блока
    // 2. После вызова removeFromStack осталось два
    it('После вызова "removeFromStack" стики блок удаляется со стэка', () => {
        const blocksCollection = new BlocksCollection();

        // подготовка данных.
        const stickyBlock0: IStickyBlockRegisterData = {
            id: '0',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '0',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        const stickyBlock1: IStickyBlockRegisterData = {
            id: '1',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '1',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        const stickyBlock2: IStickyBlockRegisterData = {
            id: '2',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: {
                    id: '2',
                    getBoundingClientRect: () => {
                        return { height: 10 };
                    },
                },
            },
        };
        blocksCollection.add(stickyBlock0);
        blocksCollection.add(stickyBlock1);
        blocksCollection.add(stickyBlock2);
        jest.spyOn(functions, 'getOffsetByContainer').mockImplementation((element) => {
            switch (element.id) {
                case '0':
                    return 0;
                case '1':
                    return 100;
                case '2':
                    return 200;
            }
        });
        jest.spyOn(Utils, 'isHidden').mockReturnValue(false);
        blocksCollection.addToStack('0', undefined);
        blocksCollection.addToStack('1', undefined);
        blocksCollection.addToStack('2', undefined);

        expect(blocksCollection.getStack().top).toEqual(['0', '1', '2']);
        blocksCollection.removeFromStack('1');
        expect(blocksCollection.getStack().top).toEqual(['0', '2']);
    });

    // 1. В коллекции есть четыре блока
    // 2. вызов getFixedStack возвращает только те блоки, у которых fixedPosition !== ''
    it('Вызов "getFixedStack" возвращает зафиксированные стики блоки. Возвращает только те блоки, у которых есть fixedPosition', () => {
        const blocksCollection = new BlocksCollection();

        // подготовка данных.
        const stickyBlock0: IStickyBlockRegisterData = {
            id: '0',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: '1',
            },
        };
        const stickyBlock1: IStickyBlockRegisterData = {
            id: '1',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: '1',
            },
        };
        const stickyBlock2: IStickyBlockRegisterData = {
            id: '2',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: '1',
            },
        };
        const stickyBlock3: IStickyBlockRegisterData = {
            id: '3',
            props: {
                position: StickyVerticalPosition.Top,
            },
            isGroup: true,
            stickyRef: {
                current: '1',
            },
        };
        blocksCollection.add(stickyBlock0);
        blocksCollection.add(stickyBlock1);
        blocksCollection.add(stickyBlock2);
        blocksCollection.add(stickyBlock3);

        expect(blocksCollection.getFixedStack().top).toEqual([]);
        expect(blocksCollection.getFixedStack().bottom).toEqual([]);
        expect(blocksCollection.getFixedStack().left).toEqual([]);
        expect(blocksCollection.getFixedStack().right).toEqual([]);

        blocksCollection.get('0').fixedPosition = FixedPosition.Top;
        blocksCollection.get('1').fixedPosition = FixedPosition.None;
        blocksCollection.get('2').fixedPosition = FixedPosition.Top;
        blocksCollection.get('3').fixedPosition = FixedPosition.Left;

        expect(blocksCollection.getFixedStack().top).toEqual(['0', '2']);
        expect(blocksCollection.getFixedStack().bottom).toEqual([]);
        expect(blocksCollection.getFixedStack().left).toEqual(['3']);
        expect(blocksCollection.getFixedStack().right).toEqual([]);
    });
});
