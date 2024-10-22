import { NewSourceController, nodeHistoryUtil } from 'Controls/dataSource';
import {
    DataLoader,
    IDataLoaderOptions,
    ILoadDataConfig,
    ILoadDataCustomConfig,
    ILoadDataResult,
} from 'Controls/dataSourceOld';
import { Memory, PrefetchProxy } from 'Types/source';
import { default as groupUtil } from 'Controls/_dataSource/GroupUtil';
import { RecordSet } from 'Types/collection';
import { HTTPStatus } from 'Browser/Transport';
import { Logger } from 'UI/Utils';
// TODO: тест "load with searchValue and searchParam" неявно завязан на то, что это либа загружена
import 'Controls/search';

function getDataArray(): object[] {
    return [
        {
            id: 0,
            title: 'Sasha',
        },
        {
            id: 1,
            title: 'Sergey',
        },
        {
            id: 2,
            title: 'Dmitry',
        },
        {
            id: 3,
            title: 'Andrey',
        },
        {
            id: 4,
            title: 'Aleksey',
        },
    ];
}

function getSource(): Memory {
    return new Memory({
        data: getDataArray(),
        keyProperty: 'id',
    });
}

function getDataLoader(dataLoaderOptions?: IDataLoaderOptions): DataLoader {
    return new DataLoader(dataLoaderOptions);
}

describe('Controls/dataSource:loadData', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('loadData', async () => {
        const loadDataConfig = {
            source: getSource(),
        };
        const loadDataResult = await getDataLoader().load([loadDataConfig]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0].data.getCount() === 5).toBeTruthy();
        expect(loadDataResult[0].data.getRawData()).toEqual(getDataArray());
    });

    it('loadData with filter', async () => {
        const loadDataConfig = {
            source: getSource(),
            filter: {
                title: 'Sasha',
            },
        };
        const loadDataResult = await getDataLoader().load([loadDataConfig]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0].data.getCount() === 1).toBeTruthy();
    });

    it('loadData with several configs', async () => {
        const loadDataConfig = {
            source: getSource(),
        };
        const loadDataConfigWithFilter = {
            source: getSource(),
            filter: {
                title: 'Sasha',
            },
        };
        const loadDataResult = await getDataLoader().load([
            loadDataConfig,
            loadDataConfigWithFilter,
        ]);

        expect(loadDataResult.length === 2).toBeTruthy();
        expect(loadDataResult[0].data.getCount() === 5).toBeTruthy();
        expect(loadDataResult[1].data.getCount() === 1).toBeTruthy();
    });

    it('loadData with filterButtonSource', async () => {
        const loadDataConfigWithFilter = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterButtonSource: [
                {
                    name: 'title',
                    value: 'Sasha',
                    textValue: 'Sasha',
                    // eslint-disable-next-line no-empty,no-empty-function,@typescript-eslint/no-empty-function
                    filterChangedCallback: () => {},
                },
            ],
        } as ILoadDataConfig;
        const dataLoader = getDataLoader();
        const loadDataResult = await dataLoader.load<ILoadDataResult>([loadDataConfigWithFilter]);
        const filterController = dataLoader.getFilterController();

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0].data.getCount() === 1).toBeTruthy();
        expect(filterController !== filterController._options.filterController).toBeTruthy();
        expect(loadDataResult[0].filter).toEqual({
            title: 'Sasha',
        });
        expect(loadDataResult[0].filterController.getFilter()).toEqual({
            title: 'Sasha',
        });
    });

    it('loadData with nodeHistoryId should return expandedItems from history', async () => {
        const loadDataConfigWithFilter = {
            type: 'list',
            source: new Memory(),
            filter: {},
            nodeHistoryId: 'testId',
            parentProperty: 'testParentProperty',
        } as ILoadDataConfig;
        const stubRestore = jest
            .spyOn(nodeHistoryUtil, 'restore')
            .mockClear()
            .mockImplementation((id) => {
                return Promise.resolve(['node_0']);
            });
        const dataLoader = getDataLoader();
        const result = await dataLoader.load<ILoadDataResult>([loadDataConfigWithFilter]);

        expect(result[0].expandedItems).toEqual(['node_0']);
        stubRestore.mockRestore();
    });

    it('load with custom loader', async () => {
        const loadDataConfigCustomLoader = {
            type: 'custom',
            loadDataMethod: () => {
                return Promise.resolve({
                    testField: 'testValue',
                    historyItems: [],
                });
            },
        } as ILoadDataCustomConfig;
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0]).toEqual({
            testField: 'testValue',
            historyItems: [],
        });
    });

    it('custom loader returns primitive value', async () => {
        const loadDataConfigCustomLoader = {
            type: 'custom',
            loadDataMethod: () => {
                return Promise.resolve(false);
            },
        } as ILoadDataCustomConfig;
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0] === false).toBeTruthy();
    });

    it('load with custom loader (promise rejected)', async () => {
        const loadDataConfigCustomLoader = {
            type: 'custom',
            loadDataMethod: () => {
                return Promise.reject({
                    testField: 'testValue',
                    historyItems: [],
                });
            },
        } as ILoadDataCustomConfig;
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0]).toEqual({
            testField: 'testValue',
            historyItems: [],
        });
    });

    it('custom loader returns error', async () => {
        const error = new Error();
        const loadDataConfigCustomLoader = {
            type: 'custom',
            loadDataMethod: () => {
                return Promise.resolve(error);
            },
        } as ILoadDataCustomConfig;
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        expect(loadDataResult.length === 1).toBeTruthy();
        expect(loadDataResult[0]).toEqual(error);
    });

    it('load with filterHistoryLoader', async () => {
        const historyItem = {
            name: 'title',
            value: 'Sasha',
            textValue: 'Sasha',
        };
        const loadDataConfigCustomLoader = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterButtonSource: [
                {
                    name: 'title',
                    value: '',
                    textValue: '',
                },
            ],
            filterHistoryLoader: () => {
                return Promise.resolve({
                    historyItems: [{ ...historyItem }],
                    filter: {
                        city: 'Yaroslavl',
                    },
                });
            },
        };
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        expect((loadDataResult[0] as ILoadDataResult).filter).toEqual({
            title: 'Sasha',
            city: 'Yaroslavl',
        });
        expect(loadDataResult[0].historyItems).toEqual([{ ...historyItem }]);
    });

    it('load data with sourceController in config', async () => {
        const source = getSource();
        const sourceController = new NewSourceController({ source });
        const dataLoader = getDataLoader();
        await dataLoader.load([{ source, sourceController }]);

        expect(dataLoader.getSourceController() === sourceController).toBeTruthy();
    });

    it('load data with sourceController and prefetchProxy in config', async () => {
        const source = getSource();
        const rs = new RecordSet({
            rawData: getDataArray(),
        });
        const prefetchSource = new PrefetchProxy({
            target: source,
            data: {
                query: rs,
            },
        });
        const sourceController = new NewSourceController({ source });
        const dataLoader = getDataLoader();
        await dataLoader.load([{ source: prefetchSource, sourceController }]);

        expect(dataLoader.getSourceController().getItems() === rs).toBeTruthy();
    });

    it('load with collapsedGroups', async () => {
        const loadDataConfigWithFilter = {
            source: getSource(),
            filter: {},
            groupHistoryId: 'testGroupHistoryId',
        };

        jest.spyOn(groupUtil, 'restoreCollapsedGroups')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve(['testCollapsedGroup1', 'testCollapsedGroup2']);
            });
        const loadDataResult = await getDataLoader().load([loadDataConfigWithFilter]);
        expect((loadDataResult[0] as ILoadDataResult).collapsedGroups).toEqual([
            'testCollapsedGroup1',
            'testCollapsedGroup2',
        ]);
        jest.restoreAllMocks();
    });

    it('load with searchValue and searchParam', async () => {
        const loadDataConfigWithFilter = {
            source: getSource(),
            filter: {},
            searchParam: 'title',
            searchValue: 'Sasha',
            minSearchLength: 3,
        };

        const dataLoader = getDataLoader();
        const loadDataResult = await dataLoader.load([loadDataConfigWithFilter]);
        expect((loadDataResult[0] as ILoadDataResult).data.getCount() === 1).toBeTruthy();
        expect(!dataLoader.getSearchControllerSync('randomId')).toBeTruthy();
        expect(dataLoader.getSearchControllerSync()).toBeTruthy();
    });

    it('load with default load timeout', async () => {
        jest.useFakeTimers();
        const source = getSource();
        const filterDescription = [
            {
                name: 'tasks',
                type: 'list',
                value: [],
                resetValue: [],
                textValue: '',
                editorOptions: {
                    source: getSource(),
                    filter: {},
                },
            },
        ];
        source.query = () => {
            return new Promise(() => {
                Promise.resolve().then(() => {
                    jest.advanceTimersByTime(40000);
                });
            });
        };
        const loadDataConfig = {
            source,
            filterDescription,
            filter: {},
        };

        const dataLoader = getDataLoader();
        const loadDataResult = dataLoader.load([loadDataConfig]);
        return new Promise((resolve) => {
            loadDataResult.then((loadResult) => {
                expect(
                    loadResult[0].sourceController.getLoadError().status ===
                        HTTPStatus.GatewayTimeout
                ).toBeTruthy();
                resolve();
            });
        });
    });

    it('load filter data with history ids in filter', async () => {
        const filterDescription = [
            {
                name: 'tasks',
                type: 'list',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                value: [],
                resetValue: [],
                textValue: '',
                editorOptions: {
                    source: getSource(),
                    historyId: 'history',
                    filter: {
                        myTasks: true,
                    },
                },
            },
            {
                name: 'contacts',
                type: 'list',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                value: ['1'],
                resetValue: ['2'],
                textValue: '',
                editorOptions: {
                    source: getSource(),
                    historyId: 'history',
                    keyProperty: 'id',
                    filter: {
                        myContacts: true,
                    },
                    navigation: {},
                },
            },
        ];
        const loadDataConfigWithFilter = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterDescription,
        } as ILoadDataConfig;
        const dataLoader = getDataLoader();
        await dataLoader.load<ILoadDataResult>([loadDataConfigWithFilter]);
        const filterController = dataLoader.getFilterController();
        const tasksFilterItem = filterController.getFilterButtonItems()[0];
        const tasksFilter = tasksFilterItem.editorOptions.filter;
        const tasksFilterInSourceController =
            tasksFilterItem.editorOptions.sourceController.getFilter();
        const expectedTasksFilter = {
            myTasks: true,
            _historyIds: ['history'],
        };
        const contactsFilterItem = filterController.getFilterButtonItems()[1];
        const contactsFilter = contactsFilterItem.editorOptions.filter;
        const contactsFilterInSourceController =
            contactsFilterItem.editorOptions.sourceController.getFilter();
        const expectedContactsFilter = {
            myContacts: true,
            _historyIds: ['history'],
            id: ['1'],
        };

        expect(expectedTasksFilter).toEqual(tasksFilter);
        expect(expectedTasksFilter).toEqual(tasksFilterInSourceController);

        expect(expectedContactsFilter).toEqual(contactsFilter);
        expect(expectedContactsFilter).toEqual(contactsFilterInSourceController);
    });

    it('load filter data with frequent filter', async () => {
        const filterButtonSource = [
            {
                name: 'tasks',
                type: 'list',
                editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                value: ['1'],
                resetValue: ['2'],
                textValue: '',
                viewMode: 'frequent',
                editorOptions: {
                    source: getSource(),
                    filter: {
                        myTasks: true,
                    },
                },
            },
        ];
        const loadDataConfigWithFilter = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterButtonSource,
        } as ILoadDataConfig;
        const dataLoader = getDataLoader();
        await dataLoader.load<ILoadDataResult>([loadDataConfigWithFilter]);
        const filterController = dataLoader.getFilterController();
        const tasksFilter = filterController.getFilterButtonItems()[0].editorOptions.filter;
        const expectedTasksFilter = {
            myTasks: true,
        };
        expect(expectedTasksFilter).toEqual(tasksFilter);
    });

    it('load with timeout', async () => {
        jest.useFakeTimers();
        const source = getSource();
        const loadTimeOut = 5000;
        const queryLoadTimeOut = 10000;
        source.query = () => {
            return new Promise(() => {
                Promise.resolve().then(() => {
                    jest.advanceTimersByTime(queryLoadTimeOut);
                });
            });
        };
        const loadDataConfig = {
            source,
            filter: {},
        };

        const dataLoader = getDataLoader();
        const loadDataResult = dataLoader.load([loadDataConfig], loadTimeOut);
        return new Promise((resolve) => {
            loadDataResult.then((loadResult) => {
                expect(
                    loadResult[0].sourceController.getLoadError().status ===
                        HTTPStatus.GatewayTimeout
                ).toBeTruthy();
                resolve();
            });
        });
    });

    it('object config', () => {
        const config = {
            list: {
                type: 'list',
                source: getSource(),
                filter: {},
            },
            custom: {
                type: 'custom',
                loadDataMethod: () => {
                    return Promise.resolve('result');
                },
            },
        };
        const dataLoader = getDataLoader();
        return dataLoader.load(config).then((loadDataResult) => {
            expect(loadDataResult.list instanceof Object).toBe(true);
            expect(loadDataResult.custom).toEqual('result');
        });
    });

    describe('dependencies', () => {
        it('multiple dependencies', () => {
            const config = {
                list: {
                    type: 'list',
                    source: getSource(),
                    filter: {},
                },
                custom: {
                    type: 'custom',
                    dependencies: ['list'],
                    loadDataMethod: (args, { list }) => {
                        return Promise.resolve({
                            list: list instanceof Object,
                        });
                    },
                },
                custom1: {
                    type: 'custom',
                    dependencies: ['list', 'custom'],
                    loadDataMethod: (args, { list, custom }) => {
                        return Promise.resolve({
                            list: list instanceof Object,
                            custom: custom && custom.list,
                        });
                    },
                },
            };
            const dataLoader = getDataLoader();
            return dataLoader.load(config).then((loadDataResult) => {
                expect(loadDataResult.custom.list).toBe(true);
                expect(loadDataResult.custom1.list).toBe(true);
                expect(loadDataResult.custom1.custom).toBe(true);
            });
        });
        it('circular dependencies', () => {
            // Мокаем логгер, т.к. при ошибке загрузки кидаем ошибку в логи, но при ошибках в консоль падают юниты
            const logError = Logger.error;
            Logger.error = () => {
                return void 0;
            };
            const config = {
                custom1: {
                    type: 'custom',
                    dependencies: ['custom'],
                    loadDataMethod: (args, { custom1 }) => {
                        return Promise.resolve({
                            custom: custom1 && custom1.custom1,
                        });
                    },
                },
                custom: {
                    type: 'custom',
                    dependencies: ['custom1'],
                    loadDataMethod: (args, { custom }) => {
                        return Promise.resolve({
                            custom1: custom && custom.custom,
                        });
                    },
                },
            };
            const dataLoader = getDataLoader();
            let finishedWithErrors = false;
            return dataLoader
                .load(config)
                .catch(() => {
                    finishedWithErrors = true;
                })
                .finally(() => {
                    expect(finishedWithErrors).toBe(true);
                    Logger.error = logError;
                });
        });

        it('undefined dependencies', () => {
            // Мокаем логгер, т.к. при ошибке загрузки кидаем ошибку в логи, но при ошибках в консоль падают юниты
            const logError = Logger.error;
            Logger.error = () => {
                return void 0;
            };
            const config = {
                custom: {
                    type: 'custom',
                    dependencies: ['custom1', 'custom2'],
                    loadDataMethod: (args, { custom }) => {
                        return Promise.resolve({
                            custom1: custom && custom.custom,
                        });
                    },
                },
            };
            const dataLoader = getDataLoader();
            let finishedWithErrors = false;
            return dataLoader
                .load(config)
                .catch(() => {
                    finishedWithErrors = true;
                })
                .finally(() => {
                    expect(finishedWithErrors).toBe(true);
                    Logger.error = logError;
                });
        });

        it('self dependencies', () => {
            // Мокаем логгер, т.к. при ошибке загрузки кидаем ошибку в логи, но при ошибках в консоль падают юниты
            const logError = Logger.error;
            Logger.error = () => {
                return void 0;
            };
            const config = {
                custom: {
                    type: 'custom',
                    dependencies: ['custom'],
                    loadDataMethod: (args, { custom }) => {
                        return Promise.resolve({
                            custom1: custom && custom.custom,
                        });
                    },
                },
            };
            const dataLoader = getDataLoader();
            let finishedWithErrors = false;
            return dataLoader
                .load(config)
                .catch(() => {
                    finishedWithErrors = true;
                })
                .finally(() => {
                    expect(finishedWithErrors).toBe(true);
                    Logger.error = logError;
                });
        });
    });
});
