import { Initializer } from 'Controls-DataEnv/newLists/_abstractList/Initializer';
import * as ErrorDescriptors from 'Controls-DataEnv/newLists/_abstractList/ErrorDescriptors';
import { RecordSet } from 'Types/collection';
import RightColumns from 'Controls-DataEnvUnit/newLists/initializer/_resources/RightColumns';
import WrongColumns from 'Controls-DataEnvUnit/newLists/initializer/_resources/WrongColumns';
import WrongColumns2 from 'Controls-DataEnvUnit/newLists/initializer/_resources/WrongColumns2';
import RightHeader from 'Controls-DataEnvUnit/newLists/initializer/_resources/RightHeader';
import WrongHeader from 'Controls-DataEnvUnit/newLists/initializer/_resources/WrongHeader';
import WrongHeader2 from 'Controls-DataEnvUnit/newLists/initializer/_resources/WrongHeader2';
import { loadSync } from 'WasabyLoader/ModulesLoader';

describe('Controls-DataEnv/abstractList:Initializer', () => {
    const loadResult = { isLatestInteractorVersion: false };
    const config = {
        items: new RecordSet(),
        metaData: [],
        keyProperty: 'id',
    };
    let mockedErrorCallback: jest.SpyInstance;

    let __originWarn: (typeof import('Application/Env'))['logger']['warn'];
    let __originError: (typeof import('Application/Env'))['logger']['error'];
    let consoleWarns: unknown[][] = [];
    let consoleErrors: unknown[][] = [];

    beforeAll(() => {
        __originWarn = loadSync<typeof import('Application/Env')>('Application/Env').logger.warn;
        __originError = loadSync<typeof import('Application/Env')>('Application/Env').logger.error;
        loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = jest.fn(
            (...args) => {
                consoleWarns.push(...args);
            }
        );
        loadSync<typeof import('Application/Env')>('Application/Env').logger.error = jest.fn(
            (...args) => {
                consoleErrors.push(...args);
                // throw Error(...args);
            }
        );
    });

    beforeEach(() => {
        mockedErrorCallback = jest.spyOn(ErrorDescriptors, 'DUPLICATES_IN_ARRAY');
        consoleWarns = [];
        consoleErrors = [];
    });

    afterEach(() => {
        mockedErrorCallback.mockRestore();
    });

    afterAll(() => {
        loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = __originWarn;
        loadSync<typeof import('Application/Env')>('Application/Env').logger.error = __originError;
    });

    describe('operationsPanel.', () => {
        it('Счетчик выбранных записей в пмо должен инициализироваться со значением 0', () => {
            const initState = Initializer.getState(loadResult, config);
            expect(initState.count).toEqual(0);
        });
    });
    describe('actions.', () => {
        describe('Если указаны listActions, то в состоянии они должны быть массивом действий.', () => {
            it('Правильные пути у действий. На состоянии будет массив действий.', () => {
                const initState = Initializer.getState(loadResult, {
                    ...config,
                    listActions:
                        'Controls-DataEnvUnit/newLists/initializer/_resources/RightActions',
                });
                expect(initState.listActions).toEqual([
                    {
                        actionName: 'Controls/actions:Remove',
                    },
                ]);
            });

            it('Неправильные пути у действий. На состояние такие действия не перекладываются.', () => {
                const initState = Initializer.getState(loadResult, {
                    ...config,
                    listActions:
                        'Controls-DataEnvUnit/newLists/initializer/_resources/WrongActions',
                });
                expect(initState.listActions).toBeUndefined();

                expect(consoleErrors.length).toBe(1);
                expect(consoleErrors[0]).toBe(
                    'Исключение в Controls-DataEnv/abstractList!\n' +
                        'Значение опции невалидно!\n' +
                        '[{"actionName":"WrongPath"}]'
                );
            });
        });
        describe('Валидация действий', () => {
            describe('В действии обязано быть описание команды (actionName, viewCommandName или commandName)', () => {
                it('actionName', () => {
                    const initState = Initializer.getState(loadResult, {
                        ...config,
                        listActions: [
                            {
                                actionName: 'Controls/actions:Remove',
                            },
                        ],
                    });
                    expect(initState.listActions).toEqual([
                        {
                            actionName: 'Controls/actions:Remove',
                        },
                    ]);
                });
                it('viewCommandName', () => {
                    const initState = Initializer.getState(loadResult, {
                        ...config,
                        listActions: [
                            {
                                viewCommandName: 'Controls/actions:Remove',
                            },
                        ],
                    });
                    expect(initState.listActions).toEqual([
                        {
                            viewCommandName: 'Controls/actions:Remove',
                        },
                    ]);
                });
                it('commandName', () => {
                    const initState = Initializer.getState(loadResult, {
                        ...config,
                        listActions: [
                            {
                                commandName: 'Controls/actions:Remove',
                            },
                        ],
                    });
                    expect(initState.listActions).toEqual([
                        {
                            commandName: 'Controls/actions:Remove',
                        },
                    ]);
                });
            });
        });
    });
    describe('columnsState.', () => {
        const configs = {
            columns: {
                right: RightColumns,
                rightStr: 'Controls-DataEnvUnit/newLists/initializer/_resources/RightColumns',
                missingKey: WrongColumns,
                keyTypeError: WrongColumns2,
            },
            header: {
                right: RightHeader,
                rightStr: 'Controls-DataEnvUnit/newLists/initializer/_resources/RightHeader',
                missingKey: WrongHeader,
                keyTypeError: WrongHeader2,
            },
        } as const;

        describe('isLatestInteractorVersion=true.', () => {
            (['header', 'columns'] as const).forEach((optionName) => {
                it(`${optionName}. Заданы массивом.`, async () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: true },
                        {
                            ...config,
                            [optionName]: configs[optionName].right,
                        }
                    );

                    expect(initState[optionName]).toBe(configs[optionName].right);
                });
                it(`${optionName}. Если указаны строкой, то в состоянии они должны быть массивом.`, async () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: true },
                        {
                            ...config,
                            [optionName]: configs[optionName].rightStr,
                        }
                    );

                    expect(typeof configs[optionName].rightStr).toBe('string');
                    expect(initState[optionName]).toBe(configs[optionName].right);
                });
                it(`${optionName}. В каждой колонке должен быть ключ`, () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: true },
                        {
                            ...config,
                            [optionName]: configs[optionName].missingKey,
                        }
                    );

                    expect(initState[optionName]).toBe(undefined);
                    expect(consoleErrors.length).toBe(2);
                    expect(consoleErrors[0]).toBe(
                        'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                            'Неверная конфигурация опции header/columns!\n' +
                            'В одной из конфигураций не задан ключ\n' +
                            '[\n' +
                            '\t{ key: 1, ... }\n' +
                            '\t{ key: undefined, ... }\n' +
                            '\t{ key: 3, ... }\n' +
                            ']\n'
                    );
                    expect(consoleErrors[1]).toBe(
                        'Исключение в Controls-DataEnv/abstractList!\n' +
                            'Значение опции невалидно!\n' +
                            '[{"key":"1"},{},{"key":"3"}]'
                    );
                });
                it(`${optionName}. Ключ должен быть строкой или числом`, () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: true },
                        {
                            ...config,
                            [optionName]: configs[optionName].keyTypeError,
                        }
                    );

                    expect(initState[optionName]).toBe(undefined);
                    expect(consoleErrors.length).toBe(2);
                    expect(consoleErrors[0]).toBe(
                        'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                            'Неверная конфигурация опции header/columns!\n' +
                            'В одной из конфигураций не задан ключ\n' +
                            '[\n' +
                            '\t{ key: 1, ... }\n' +
                            '\t{ key: null, ... }\n' +
                            ']\n'
                    );
                    expect(consoleErrors[0]).toBe(
                        'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                            'Неверная конфигурация опции header/columns!\n' +
                            'В одной из конфигураций не задан ключ\n' +
                            '[\n' +
                            '\t{ key: 1, ... }\n' +
                            '\t{ key: null, ... }\n' +
                            ']\n'
                    );
                });
            });
        });

        describe('isLatestInteractorVersion=false.', () => {
            (['header', 'columns'] as const).forEach((optionName) => {
                it(`${optionName}. Заданы массивом.`, async () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: false },
                        {
                            ...config,
                            [optionName]: configs[optionName].rightStr,
                        }
                    );

                    expect(typeof configs[optionName].rightStr).toBe('string');
                    expect(initState[optionName]).toBe(configs[optionName].right);
                });
                it(`${optionName}. Если ${optionName} указаны строкой, то в состоянии они должны быть массивом.`, async () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: false },
                        {
                            ...config,
                            [optionName]: configs[optionName].right,
                        }
                    );

                    expect(initState[optionName]).toBe(configs[optionName].right);
                });
                it(`${optionName}. В каждой колонке должен быть ключ. Игнорируем в текущих списках.`, () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: false },
                        {
                            ...config,
                            [optionName]: configs[optionName].missingKey,
                        }
                    );

                    expect(initState[optionName]).toBe(configs[optionName].missingKey);
                    expect(consoleWarns.length).toBe(1);
                    expect(consoleWarns[0]).toBe(
                        'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                            'Неверная конфигурация опции header/columns!\n' +
                            'В одной из конфигураций не задан ключ\n' +
                            '[\n' +
                            '\t{ key: 1, ... }\n' +
                            '\t{ key: undefined, ... }\n' +
                            '\t{ key: 3, ... }\n' +
                            ']\n'
                    );
                });
                it(`${optionName}. Ключ должен быть строкой или числом. Игнорируем в текущих списках.`, () => {
                    const initState = Initializer.getState(
                        { ...loadResult, isLatestInteractorVersion: false },
                        {
                            ...config,
                            [optionName]: configs[optionName].keyTypeError,
                        }
                    );

                    expect(initState[optionName]).toBe(configs[optionName].keyTypeError);
                    expect(consoleWarns.length).toBe(1);
                    expect(consoleWarns[0]).toBe(
                        'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                            'Неверная конфигурация опции header/columns!\n' +
                            'В одной из конфигураций не задан ключ\n' +
                            '[\n' +
                            '\t{ key: 1, ... }\n' +
                            '\t{ key: null, ... }\n' +
                            ']\n'
                    );
                });
            });
        });
    });
    describe('hierarchy', () => {
        it('Если передан массив ключей с дублями, выбрасывается ошибка и дубли удаляются', () => {
            const customConfig = {
                ...config,
                expandedItems: [1, 2, 2, 3],
                collapsedItems: [4, 5, 5, 6],
            };
            const initState = Initializer.getState(loadResult, customConfig);

            expect(initState.expandedItems).toEqual([1, 2, 3]);
            expect(initState.collapsedItems).toEqual([4, 5, 6]);
            expect(mockedErrorCallback.mock.calls.length).toBe(2);

            expect(consoleWarns.length).toBe(2);
            expect(consoleWarns[0]).toBe(
                'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                    'В опцию expandedItems был передан массив, содержащий дубли элементов.\n' +
                    'Необходимо предварительно убрать их в своем коде.'
            );
            expect(consoleWarns[1]).toBe(
                'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                    'В опцию collapsedItems был передан массив, содержащий дубли элементов.\n' +
                    'Необходимо предварительно убрать их в своем коде.'
            );
        });
        it('Корень иерархии может инициализироваться с ключом 0', () => {
            const customConfig = {
                ...config,
                root: 0,
            };
            const initState = Initializer.getState(loadResult, customConfig);

            expect(initState.root).toEqual(0);
        });
    });
    describe('selection.', () => {
        it('Если передан массив ключей с дублями, выбрасывается ошибка и дубли удаляются', () => {
            const customConfig = {
                ...config,
                selectedKeys: [1, 2, 2, 3],
                excludedKeys: [4, 5, 5, 6],
            };
            const initState = Initializer.getState(loadResult, customConfig);

            expect(initState.selectedKeys).toEqual([1, 2, 3]);
            expect(initState.excludedKeys).toEqual([4, 5, 6]);
            expect(mockedErrorCallback.mock.calls.length).toBe(2);
            expect(consoleWarns.length).toBe(2);
            expect(consoleWarns[0]).toBe(
                'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                    'В опцию selectedKeys был передан массив, содержащий дубли элементов.\n' +
                    'Необходимо предварительно убрать их в своем коде.'
            );
            expect(consoleWarns[1]).toBe(
                'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n' +
                    'В опцию excludedKeys был передан массив, содержащий дубли элементов.\n' +
                    'Необходимо предварительно убрать их в своем коде.'
            );
        });
    });
});
