/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA, PMO_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import {
    personsData,
    KEY_PROPERTY,
} from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';
import { RecordSet } from 'Types/collection';

describe('OperationPanel_Selection. Тесты взаимодействия ПМО со множественным выделением.', () => {
    const { container } = setupTestEnv();

    describe('Построение.', () => {
        it('Задали видимость ПМО в true. В списке должны отображаться чекбоксы по умолчанию', async () => {
            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                    },
                },
            });

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });

        it('Задали видимость ПМО в true. В списке должны отображаться чекбоксы, даже если они скрыты прикладной настройкой', async () => {
            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                        multiSelectVisibility: 'hidden',
                    },
                },
            });

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });

        it('Если при инициализации состояния есть список действий и выбранные элементы, тогда должна открыться пмо с корректным счетчиком', async () => {
            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        selectedKeys: [0, 3],
                        listActions: [{ actionName: 'Controls/actions:Remove' }],
                    },
                },
            });

            expect(getByTestId(PMO_QA)).toMatchSnapshot();
            checkChanges();
        });
    });

    describe('Выбрать все', () => {
        it('Можно сбросить все выделение, если инвертировать, когда выделены все элементы', async () => {
            const { getByTestId, checkChanges, waitForIdle, slice } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                    },
                },
            });

            slice.selectAll();

            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();

            slice.invertSelection();

            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });

    it('После закрытия ПМО чекбокс отображается только при наведении мышью, выделение сбрасывается', async () => {
        const { getByTestId, checkChanges, waitForIdle, slice } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    operationsPanelVisible: true,
                    selectedKeys: [1, 2],
                },
            },
        });

        slice.closeOperationsPanel();

        await waitForIdle();

        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });

    it('При выделении в списке открывается ПМО', async () => {
        const { getByTestId, checkChanges, waitForIdle, slice } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    multiSelectVisibility: 'onhover',
                    listActions: [],
                },
            },
        });

        slice.select(1);

        await waitForIdle();

        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });

    describe('Поддержка прикладных возможностей', () => {
        describe('Сохранение состояния при SPA переходе', () => {
            it('Сохранение выделенных элементов при массовом выделении', async () => {
                const { waitForIdle, slice } = await renderDemo(Demo, {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            listConfigStoreId: 'storeId',
                            multiSelectVisibility: 'visible',
                            operationsPanelVisible: true,
                        },
                    },
                });

                slice.selectAll();
                await waitForIdle();

                slice.select(1);
                await waitForIdle();

                const { getByTestId } = await renderDemo(Demo, {
                    container: document.createElement('div'),
                    demoProps: {
                        dataFactoryArguments: {
                            listConfigStoreId: 'storeId',
                            multiSelectVisibility: 'visible',
                            operationsPanelVisible: true,
                        },
                    },
                });

                await waitForIdle();
                expect(getByTestId(LIST_QA)).toMatchSnapshot();
            });
        });
        it('При открытии ПМО listCommandsSelection должен содержать элемент, на котором стоит маркер ', async () => {
            const { getByTestId, checkChanges, waitForIdle, callAction } = await renderDemo(Demo, {
                container,
            });

            await callAction('openOperationsPanel');

            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });

        describe('listCommandsSelection', () => {
            it('Элемент с checkboxAccessibility false не должен попадать в выбранные', async () => {
                const { getByTestId, checkChanges, waitForIdle, callAction } = await renderDemo(
                    Demo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                multiSelectAccessibilityProperty: 'checkboxAccessibility',
                                items: new RecordSet({
                                    rawData: [
                                        {
                                            key: 'Line',
                                            name: 'Line',
                                            checkboxAccessibility: false,
                                        },
                                        ...personsData.slice(0, 4),
                                    ],
                                    keyProperty: KEY_PROPERTY,
                                }),
                            },
                        },
                    }
                );

                await callAction('openOperationsPanel');

                await waitForIdle();

                expect(getByTestId(LIST_QA)).toMatchSnapshot();
                checkChanges();
            });
        });
    });
});
