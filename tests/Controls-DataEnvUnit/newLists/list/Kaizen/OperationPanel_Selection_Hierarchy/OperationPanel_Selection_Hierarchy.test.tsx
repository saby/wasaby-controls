/**
 * @jest-environment jsdom
 */
import Demo, { PMO_QA } from '../../Demo/TreeGrid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { IListDataFactoryArguments } from 'Controls-DataEnv/list';
import { Memory } from 'Types/source';
import { KEY_PROPERTY } from '../../Demo/Data/RussiaSubjects';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

// Падает ошибка сборки, так как на данный момент сборщик не поддерживает типы jest
type Each = <T>(
    cases: readonly T[]
) => (name: string, fn: (arg: T) => void, timeout?: number) => void;

const testCasesConfigurations: Partial<IListDataFactoryArguments>[] = [
    {
        selectionCountMode: 'leaf',
        selectAncestors: false,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'leaf',
        selectAncestors: false,
        selectDescendants: true,
    },
    {
        selectionCountMode: 'leaf',
        selectAncestors: true,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'leaf',
        selectAncestors: true,
        selectDescendants: true,
    },
    {
        selectionCountMode: 'node',
        selectAncestors: false,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'node',
        selectAncestors: false,
        selectDescendants: true,
    },
    {
        selectionCountMode: 'node',
        selectAncestors: true,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'node',
        selectAncestors: true,
        selectDescendants: true,
    },
    {
        selectionCountMode: 'all',
        selectAncestors: false,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'all',
        selectAncestors: false,
        selectDescendants: true,
    },
    {
        selectionCountMode: 'all',
        selectAncestors: true,
        selectDescendants: false,
    },
    {
        selectionCountMode: 'all',
        selectAncestors: true,
        selectDescendants: true,
    },
];

describe('OperationPanel_Selection. Тесты взаимодействия ПМО со множественным выделением.', () => {
    const { container } = setupTestEnv();

    describe('Счетчик.', () => {
        (it as unknown as { each: Each }).each(testCasesConfigurations)(
            'Выбор корня и листа. Конфигурация: %j',
            async (configuration) => {
                const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            operationsPanelVisible: true,
                            ...configuration,
                        },
                    },
                });

                slice.expand('1');

                await waitForIdle();

                slice.select('1');

                await waitForIdle();

                expect(getByTestId(PMO_QA)).toMatchSnapshot();

                slice.select('1_10');

                await waitForIdle();

                expect(getByTestId(PMO_QA)).toMatchSnapshot();

                checkChanges();
            }
        );

        (
            it as unknown as {
                each: Each;
            }
        ).each(testCasesConfigurations)('Выбор всего. Конфигурация: %j', async (configuration) => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                        ...configuration,
                    },
                },
            });

            slice.expand('1');

            await waitForIdle();

            slice.selectAll();

            await waitForIdle();

            expect(getByTestId(PMO_QA)).toMatchSnapshot();

            checkChanges();
        });

        it('Скрытые узлы без дочерних элементов', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                        source: new Memory({
                            keyProperty: KEY_PROPERTY,
                            data: hiddenNodesData,
                        }),
                        hasChildrenProperty: 'hasChildren',
                        expandedItems: ['1', '2', '3'],
                    },
                },
            });

            slice.select('1_1');

            await waitForIdle();

            slice.select('2_1');

            await waitForIdle();

            expect(getByTestId(PMO_QA)).toMatchSnapshot();

            checkChanges();
        });
    });
});

const hiddenNodesData = [
    {
        key: '1',
        title: '1',
        parent: null,
        node: true,
    },
    {
        key: '1_1',
        title: '1_1',
        parent: '1',
        node: false,
        hasChildren: false,
    },
    {
        key: '2',
        title: '2',
        parent: null,
        node: true,
    },
    {
        key: '2_1',
        title: '2_1',
        parent: '2',
        node: false,
        hasChildren: false,
    },
    {
        key: '3',
        title: '3',
        parent: null,
        node: true,
    },
    {
        key: '3_1',
        title: '3_1',
        parent: '3',
        node: false,
        hasChildren: false,
    },
];
