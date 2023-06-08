import { Loader } from 'Controls-DataEnv/dataLoader';
import { Memory } from 'Types/source';

describe('Controls-DataEnv/dataLoader:Loader', () => {
    describe('validate params', () => {
        it('reject error with missed loaders in dependends', async () => {
            const config = {
                customLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dependencies: ['anotherLoaderKey'],
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return 1;
                        },
                        dependencies: ['customLoader1'],
                    },
                },
            };
            await Loader.load(config).catch((error) => {
                expect(typeof error).toBe('string');
            });
        });
        it('reject error with circular dependencies', async () => {
            const config = {
                customLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dependencies: ['customLoader'],
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return 1;
                        },
                        dependencies: ['customLoader1'],
                    },
                },
            };
            await Loader.load(config).catch((error) => {
                expect(typeof error).toBe('string');
            });
        });
    });

    describe('load', () => {
        it('simple', async () => {
            const config = {
                customLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve(1);
                        },
                    },
                },
            };
            await Loader.load(config).then((result) => {
                expect(result).toEqual({
                    customLoader: 1,
                });
            });
        });

        it('load with dependencies', async () => {
            let dependencyCall = 0; // Защита от кейса что dependency загрузчик позовется два раза
            const config = {
                customLoader: {
                    dependencies: ['customValue'],
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: (args, results) => {
                            return Promise.resolve(results[0]);
                        },
                    },
                },
                customLoader2: {
                    dependencies: ['customLoader'],
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: (args, results) => {
                            return Promise.resolve(results.customLoader);
                        },
                    },
                },
                customValue: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve(++dependencyCall);
                        },
                    },
                },
            };
            await Loader.load(config).then((result) => {
                expect(result).toEqual({
                    customLoader: 1,
                    customLoader2: 1,
                    customValue: 1,
                });
            });
        });

        it('загрузка данных для PropertyGrid, когда у редактора задан тип lookup', async () => {
            const lookupConfig = {
                type: 'lookup',
                caption: 'lookup',
                editorTemplateName: 'Controls/propertyGrid:LookupEditor',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 1,
                                title: 'Наша компания',
                            },
                            {
                                id: 2,
                                title: 'Все юридические лица',
                            },
                            {
                                id: 3,
                                title: 'Инори, ООО',
                            },
                        ],
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    searchParam: 'title',
                },
            };
            const config = {
                propertyGridLoader: {
                    dataFactoryName: 'Controls/dataFactory:PropertyGrid',
                    dataFactoryArguments: {
                        editingObject: {
                            lookup: [1],
                            emptyLookup: [],
                        },
                        typeDescription: [
                            {
                                ...lookupConfig,
                                editorOptions: {
                                    ...lookupConfig.editorOptions,
                                },
                                name: 'lookup',
                            },
                            {
                                ...lookupConfig,
                                editorOptions: {
                                    ...lookupConfig.editorOptions,
                                },
                                name: 'emptyLookup',
                            },
                        ],
                    },
                },
            };
            const loadResult = await Loader.load(config);
            const items =
                loadResult.propertyGridLoader.typeDescription[0].editorOptions
                    .items;
            const emptyLookupItems =
                loadResult.propertyGridLoader.typeDescription[1].editorOptions
                    .items;
            expect(items.getCount()).toEqual(1);
            expect(emptyLookupItems).toBeUndefined();
        });

        it('loader with order', async () => {
            const config = {
                firstLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryCreationOrder: 1,
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve('first');
                        },
                    },
                },
                secondLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryCreationOrder: 1,
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve('second');
                        },
                    },
                },
                thirdLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryCreationOrder: 2,
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve('third');
                        },
                    },
                },
            };
            const result = await Loader.load(config);
            expect(result.firstLoader).toBe('first');
            expect(result.secondLoader).toBe('second');
            expect(result.thirdLoader).toBeInstanceOf(Promise);
        });
    });
});
