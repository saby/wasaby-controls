/**
 * @jest-environment jsdom
 */
import Demo, { SEARCH_QA, EXPLORER_QA } from '../../Demo/Explorer';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Search_Source_Hierarchy. Тесты взаимодействия поиска с сурсом с иерархией.', () => {
    const { container } = setupTestEnv();

    it('Смена корня сбрасывает поиск', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
        });

        // Занести searchValue в dataFactoryArguments после исправления ошибки:
        // https://online.sbis.ru/opendoc.html?guid=6a570f1f-a7e9-4f7c-8fcf-8cc2e9141da0&client=3
        slice.search('Москва и Московская обл.');

        await waitForIdle(5000);

        slice.changeRoot('1');

        await waitForIdle(5000);

        expect(getByTestId(SEARCH_QA)).toMatchSnapshot();
        checkChanges();
    });

    it('При сбросе поиска должны вернуться в узел, с которого начинали поиск', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    root: '1',
                },
            },
        });

        slice.search('Москва и Московская обл.');

        await waitForIdle(5000);

        slice.resetSearch();

        await waitForIdle(5000);

        expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();
        checkChanges();
    });

    it('При поиске узлы должны сворачиваться, если не задана опция deepReload', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    expandedItems: ['1', '2', '3'],
                },
            },
        });

        slice.search('Москва и Московская обл.');
        await waitForIdle(5000);

        expect(slice.state.expandedItems.length).toBe(0);

        expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();
        checkChanges();
    });

    describe('Задана опция searchStartingWith: "root"', () => {
        it('Можно менять корень', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchStartingWith: 'root',
                    },
                },
            });

            slice.search('Москва и Московская обл.');
            await waitForIdle();

            slice.changeRoot('1');
            await waitForIdle(5000);

            expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
    describe('Задана опция searchNavigationMode: "expand"', () => {
        it('При смене корня в режиме поиска, узел должен раскрываться', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchNavigationMode: 'expand',
                    },
                },
            });

            slice.search('Москва и Московская обл.');
            await waitForIdle();

            slice.changeRoot('1');
            await waitForIdle(5000);

            expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();
            checkChanges();
        });
    });

    describe('Поддержка прикладных возможностей', () => {
        it('Прикладник может сохранить поисковое значение при смене корня иерархии', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        _userSaveSearchBetweenRoots: true,
                        searchValue: 'Санкт-Петербург',
                    },
                },
            });

            slice.changeRoot('1');

            await waitForIdle(5000);

            expect(getByTestId(SEARCH_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
