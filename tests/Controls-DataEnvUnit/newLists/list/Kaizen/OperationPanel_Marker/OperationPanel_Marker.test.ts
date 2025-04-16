/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationPanel_Marker. Тесты взаимодействия ПМО с маркером.', () => {
    const { container } = setupTestEnv();
    it('Задали видимость ПМО в true. В списке должен отобразиться маркер, если его не было', async () => {
        const { getByTestId, checkChanges, callAction, waitForIdle } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    operationsPanelVisible: false,
                },
            },
        });

        await callAction('openOperationsPanel');
        await waitForIdle();

        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });
});
