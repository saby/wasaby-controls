/**
 * @jest-environment jsdom
 */
import Demo, { PMO_QA } from 'Controls-DataEnvUnit/newLists/list/Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationPanel. Тесты ПМО.', () => {
    const { container } = setupTestEnv();

    describe('Построение.', () => {
        it('Задали видимость ПМО в false. ПМО НЕ должна быть видна.', async () => {
            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: false,
                    },
                },
            });

            expect(getByTestId(PMO_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Задали видимость ПМО в true. ПМО должна быть видна.', async () => {
            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                    },
                },
            });

            expect(getByTestId(PMO_QA)).toMatchSnapshot();
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
});
