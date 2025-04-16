/**
 * @jest-environment jsdom
 */
import Demo, { TREE_GRID_QA } from '../../Demo/TreeGrid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import HierarchyMemory from 'Controls-DataEnvUnit/newLists/list/Demo/Utils/HierarchyMemory';
import {
    getSomeSubjects,
    KEY_PROPERTY,
} from 'Controls-DataEnvUnit/newLists/list/Demo/Data/RussiaSubjects';

import type { INavigationPositionSourceConfig } from 'Controls-DataEnv/listTypes';
import { _private_predicates } from 'Controls-DataEnv/abstractList';
import { RecordSet } from 'Types/collection';

const { isObject, isDefined } = _private_predicates;

describe('Source_Hierarchy. Тесты взаимодействия загрузки данных и иерархии.', () => {
    const { container, mockConsole } = setupTestEnv();

    describe('Раскрытие узлов', () => {
        it('Раскрытие вложенного элемента приводит к раскрытию всех родителей', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        items: new RecordSet({
                            keyProperty: KEY_PROPERTY,
                            rawData: getSomeSubjects([
                                ['1', 10],
                                ['1_1', 10],
                                ['1_1_1', 10],
                            ]),
                        }),
                    },
                },
            });

            await callAction('expand 1_1_1');
            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('За одно обновление можно раскрыть сразу несколько узлов', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
            });

            await callAction('expand 1, 2, 3');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Ошибка с бл при раскрытии узла не ломает список', async () => {
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                Demo,
                {
                    container,
                }
            );
            await callAction('rejectNextQuery');
            await waitForIdle();

            slice.expand('1');
            await waitForIdle();

            slice.expand('2');
            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();

            expect(!!mockConsole.errors.length).toBeTruthy();
            mockConsole.clearHistory();
        });
    });

    describe('Сворачивание узлов', () => {
        it('Сворачивание узла, должно сворачивать так же дочерние развёрнутые узлы', async () => {
            const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        expandedItems: ['1', '1_1', '1_1_1'],
                    },
                },
            });

            slice.collapse('1');

            await waitForIdle();

            slice.expand('1');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('При удалении узла, ключ должен удалиться из expandedItems', async () => {
            const { waitForIdle, slice, checkChanges, callAction } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        expandedItems: ['1'],
                        items: new RecordSet({
                            keyProperty: KEY_PROPERTY,
                            rawData: getSomeSubjects([
                                ['1', 10],
                                ['1_1', 10],
                                ['1_1_1', 10],
                                ['2', 10],
                                ['3', 10],
                                ['39', 10],
                                ['78', 10],
                            ]),
                        }),
                    },
                },
            });

            await callAction('remove 1');

            await waitForIdle();

            expect(slice.state.expandedItems.length).toEqual(0);

            checkChanges();
        });
    });

    describe('Поддержка прикладных возможностей', () => {
        it('Прикладник может свернуть узлы после платформенного beforeApplyState', async () => {
            const { getByTestId, waitForIdle, checkChanges, callAction } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        expandedItems: ['1'],
                    },
                },
            });

            await callAction('collapseAllItemsAfterBas');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();

            checkChanges();
        });
        describe('Сохранение состояния при SPA переходе', () => {
            it('Сохранение корня иерархии', async () => {
                const dataFactoryArguments = {
                    listConfigStoreId: 'storeId',
                };
                const { waitForIdle, slice } = await renderDemo(Demo, {
                    container,
                    demoProps: {
                        dataFactoryArguments,
                    },
                });

                slice.changeRoot('1');

                await waitForIdle();

                const { getByTestId, checkChanges } = await renderDemo(Demo, {
                    container: document.createElement('div'),
                    demoProps: {
                        dataFactoryArguments,
                    },
                });

                await waitForIdle();
                expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
                checkChanges();
            });
            it('Сохранение раскрытых узлов', async () => {
                const dataFactoryArguments = {
                    listConfigStoreId: 'storeId',
                };
                const { waitForIdle, slice } = await renderDemo(Demo, {
                    container,
                    demoProps: {
                        dataFactoryArguments,
                    },
                });

                slice.changeRoot('1');

                await waitForIdle();

                const { getByTestId, checkChanges } = await renderDemo(Demo, {
                    container: document.createElement('div'),
                    demoProps: {
                        dataFactoryArguments,
                    },
                });

                await waitForIdle();
                expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
                checkChanges();
            });
        });
    });

    describe('Перезагрузка списка', () => {
        // Не факт, что это правильно, но так работают все деревья на сайте
        it('При перезагрузке, expandedItems не должен измениться, даже если записей в recordSet нет', async () => {
            const originalExpandedItems = ['1', '2', '3'];
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                Demo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            expandedItems: originalExpandedItems,
                            source: new HierarchyMemory({
                                keyProperty: KEY_PROPERTY,
                                data: [],
                            }),
                        },
                    },
                }
            );

            await callAction('reload');
            await waitForIdle(5000);

            expect(slice.state.expandedItems).toEqual(originalExpandedItems);

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('При перезагрузке узлы сворачиваются, если не задана опция deepReload', async () => {
            // не работает сворачивание
            // поправить по ошибке
            // https://online.sbis.ru/opendoc.html?guid=fbb23526-5ae3-484d-a21b-5a5e7c66f510&client=3
            const { getByTestId, waitForIdle, callAction } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        expandedItems: ['1'],
                    },
                },
            });

            await callAction('reload');

            await waitForIdle(5000);

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
        });
        it('При перезагрузке узлы остаются развернутыми при заданной опции deepReload', async () => {
            const { getByTestId, waitForIdle, callAction } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        expandedItems: ['1'],
                        deepReload: true,
                    },
                },
            });

            await callAction('reload');

            await waitForIdle(5000);

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
        });
    });
    describe('Смена корня иерархии', () => {
        it('При проваливании в папку данные и корень обновляются в одном и том же обновлении', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
            });

            slice.changeRoot('1');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();

            checkChanges();
        });
        it('Можно провалиться в папку', async () => {
            const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
            });

            slice.changeRoot('1');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('При проваливании в папку сбрасывается позиционная навигация', async () => {
            const { waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        navigation: {
                            source: 'position',
                            view: 'infinity',
                            sourceConfig: {
                                position: 3,
                                direction: 'forward',
                                field: 'key',
                                limit: 10,
                            },
                        },
                    },
                },
            });

            slice.changeRoot('1');

            await waitForIdle(5000);

            const sourceConfig = slice.state.navigation?.sourceConfig;
            expect(isPositionDefined(sourceConfig) && sourceConfig.position).toEqual(null);

            checkChanges();
        });
    });

    describe('Поддержка прикладных возможностей', () => {
        it('При загрузке узла вызывается _nodeDataLoaded', async () => {
            const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        changeItemsInNodeDataLoaded: true,
                    },
                },
            });

            slice.expand('1');
            await waitForIdle(5000);

            // nodeDataLoaded вызывается, но изменения items внутри метода прикладника не попадают на слайс
            // поправить по ошибке:
            // https://online.sbis.ru/opendoc.html?guid=8d81d103-1140-47a9-be22-81850a7fc291&client=3
            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});

function isPositionDefined<T>(
    o: T
): o is T &
    Partial<INavigationPositionSourceConfig> &
    Pick<Required<INavigationPositionSourceConfig>, 'position'> {
    return (
        isObject(o) &&
        isDefined(
            (o as Pick<Partial<INavigationPositionSourceConfig>, 'position'>).position as unknown
        )
    );
}
