/**
 * @jest-environment jsdom
 */
import Demo, { EXPLORER_QA } from '../../Demo/Explorer';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Search_Source_Selection_Hierarchy. Тесты взаимодействия поиска с сурсом, множественным выделением и иерархией.', () => {
    const { container } = setupTestEnv();

    it('Если после поиска выделили конкретную запись, то при сбросе поиска выделение остается', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    multiSelectVisibility: 'visible',
                    root: '1',
                },
            },
        });

        slice.search('округ');

        await waitForIdle(5000);

        slice.select('1_1_1');

        await waitForIdle();

        slice.resetSearch();

        await waitForIdle(5000);

        expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();

        checkChanges();
    });
});
