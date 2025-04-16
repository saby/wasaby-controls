/**
 * @jest-environment jsdom
 */
import ListDemo, { SEARCH_QA as LIST_SEARCH_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Поиск.', () => {
    const { container } = setupTestEnv();

    describe('Взаимодействие со строкой поиска.', () => {
        it('После поиска не должно сбрасываться значение строки поиска, если оно менялось пока выполнялся запрос.', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges, callAction } = await renderDemo(
                ListDemo,
                {
                    container,
                }
            );

            slice.search('test');

            await callAction('searchInputValue=testPlus');

            await waitForIdle(5000);

            expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

            checkChanges();
        });

        it('Значение в строке поиска не сбрасывается, если за время поиска успели сбросить и что-то написать.', async () => {
            const { getByTestId, waitForIdle, checkChanges, slice } = await renderDemo(ListDemo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchValue: '',
                        searchInputValue: '',
                    },
                },
            });

            slice.search('7777');
            slice.search('');
            slice.search('value');

            await waitForIdle();

            expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

            checkChanges();
        });

        it('Значение в строке поиска не сбрасывается, при вызове обновления с пустым searchValue.', async () => {
            const { getByTestId, waitForIdle, checkChanges, callAction } = await renderDemo(
                ListDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            searchValue: 'testValue',
                            searchInputValue: 'testValue',
                        },
                    },
                }
            );

            await callAction('searchValue=');

            await waitForIdle();

            expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

            checkChanges();
        });

        it('Поиск можно сбросить после инициализации со значением.', async () => {
            const { getByTestId, waitForIdle, checkChanges, slice } = await renderDemo(ListDemo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchValue: 'searchValue',
                    },
                },
            });

            slice.resetSearch();

            await waitForIdle();

            expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

            checkChanges();
        });
    });
});
