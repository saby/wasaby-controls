/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationPanel_Selection_Search. Тесты взаимодействия ПМО со множественным выделением и поиском .', () => {
    const { container } = setupTestEnv();

    it('Если во время поиска выделить все элементы, то после сброса поиска сбросится и выделение', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    operationsPanelVisible: true,
                },
            },
        });

        slice.search('Hilary Osborne');
        await waitForIdle(5000);

        slice.selectAll();
        await waitForIdle();

        slice.resetSearch();
        await waitForIdle();

        expect(getByTestId(LIST_QA)).toMatchSnapshot();

        checkChanges();
    });
});
