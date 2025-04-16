/**
 * @jest-environment jsdom
 */
import Demo, { PMO_QA } from '../../Demo/TreeGrid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import CountSource from '../../Demo/Utils/CountSource';

describe('OperationPanel_Hierarchy. Тесты взаимодействия ПМО с иерархией.', () => {
    const { container } = setupTestEnv();
    it('Если подсчитать количество записей нельзя, то будет отправлен запрос на указанную бл', async () => {
        const { getByTestId, checkChanges, slice, waitForIdle } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    operationsPanelVisible: true,
                    selectedCountConfig: {
                        rpc: new CountSource(),
                        command: 'demoCall',
                        data: {},
                    },
                },
            },
        });

        slice.select('1');

        await waitForIdle();

        expect(getByTestId(PMO_QA)).toMatchSnapshot();
        checkChanges();
    });
});
