/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

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
});
