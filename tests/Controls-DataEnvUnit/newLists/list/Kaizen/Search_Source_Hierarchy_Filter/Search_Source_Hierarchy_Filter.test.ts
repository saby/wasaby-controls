/**
 * @jest-environment jsdom
 */
import Demo, { EXPLORER_QA } from '../../Demo/Explorer';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Search_Source_Hierarchy_Filter. Тесты взаимодействия поиска с сурсом, иерархией и фильтром.', () => {
    const { container } = setupTestEnv();

    describe('Задана опция searchStartingWith: "root"', () => {
        it('Значение поиска попадает в фильтр', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchStartingWith: 'root',
                    },
                },
            });

            slice.search('Москва и Московская обл.');
            await waitForIdle(5000);

            const { filter, searchParam } = slice.state;

            expect(
                !!filter && !!searchParam && (filter as Record<string, unknown>)[searchParam]
            ).toEqual('Москва и Московская обл.');
            expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
