/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Search_Source_Selection. Тесты взаимодействия поиска с сурсом и выделением.', () => {
    const { container } = setupTestEnv();

    it('Если после поиска выделили конкретную запись, то при сбросе поиска выделение остается', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    multiSelectVisibility: 'visible',
                },
            },
        });

        slice.search('Hilary Osborne');
        await waitForIdle(5000);

        slice.select(1);
        await waitForIdle();

        slice.resetSearch();
        await waitForIdle(5000);

        expect(getByTestId(LIST_QA)).toMatchSnapshot();

        checkChanges();
    });
});
