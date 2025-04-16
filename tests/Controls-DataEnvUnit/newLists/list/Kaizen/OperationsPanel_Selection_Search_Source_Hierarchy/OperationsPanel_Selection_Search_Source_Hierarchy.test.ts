/**
 * @jest-environment jsdom
 */
import Demo, { EXPLORER_QA } from '../../Demo/Explorer';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationsPanel_Selection_Search_Source_Hierarchy. Тесты взаимодействия ПМО со множественным выделением, поиском, сурсом и иерархией.', () => {
    const { container } = setupTestEnv();

    it('Если во время поиска выделить все элементы, то после сброса поиска сбросится и выделение', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    operationsPanelVisible: true,
                    root: '1',
                },
            },
        });

        slice.search('округ');

        await waitForIdle(5000);

        slice.selectAll();

        await waitForIdle();

        slice.resetSearch();

        await waitForIdle(5000);

        expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();

        checkChanges();
    });
});
