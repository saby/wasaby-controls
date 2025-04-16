/**
 * @jest-environment jsdom
 */
import Demo, { SEARCH_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Search_Source. Тесты поиска с сурсом.', () => {
    const { container } = setupTestEnv();

    describe('Поддержка прикладных возможностей', () => {
        it('Сохранение поиска при SPA переходе', async () => {
            const dataFactoryArguments = {
                listConfigStoreId: 'storeId',
            };
            const { waitForIdle, slice } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments,
                },
            });

            slice.search('Москва');

            await waitForIdle(5000);

            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container: document.createElement('div'),
                demoProps: {
                    dataFactoryArguments,
                },
            });

            await waitForIdle();
            expect(getByTestId(SEARCH_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
