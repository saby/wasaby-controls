/**
 * @jest-environment jsdom
 */
import Demo, { EXPLORER_QA } from '../../Demo/Explorer';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationPanel_Selection_Search_Hierarchy. Тесты взаимодействия ПМО со множественным выделением, поиском и иерархией.', () => {
    const { container } = setupTestEnv();

    describe('Сброс поиска', () => {
        it('Если ранее были выделены все записи через ПМО, то при сбросе выделение сбрасывается', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchParam: 'title',
                        operationsPanelVisible: true,
                        displayProperty: 'title',
                    },
                },
            });

            slice.search('Москва и Московская обл.');

            await waitForIdle();

            slice.selectAll();

            await waitForIdle();

            slice.resetSearch();

            await waitForIdle();

            expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();

            // FIXME: UNSTABLE https://online.sbis.ru/opendoc.html?guid=3d7a6bba-29a4-43d8-8788-98b4891307f7&client=3
            checkChanges({ enabled: false });
        });

        it('Если ранее выделили конкретную запись, то при сбросе выделение остается', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchParam: 'title',
                    },
                },
            });

            slice.search('Москва и Московская обл.');

            await waitForIdle();

            slice.select('1');

            await waitForIdle();

            slice.resetSearch();

            await waitForIdle();

            expect(getByTestId(EXPLORER_QA)).toMatchSnapshot();

            // FIXME: UNSTABLE https://online.sbis.ru/opendoc.html?guid=3d7a6bba-29a4-43d8-8788-98b4891307f7&client=3
            checkChanges({ enabled: false });
        });
    });
});
