/**
 * @jest-environment jsdom
 */
import Demo, { TREE_GRID_QA } from '../../Demo/TreeGrid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Hierarchy. Тесты взаимодействия с иерархией.', () => {
    const { container } = setupTestEnv();

    describe('Поддержка прикладных возможностей', () => {
        it('Прикладник может свернуть узлы после платформенного beforeApplyState', async () => {
            const { getByTestId, waitForIdle, checkChanges, callAction, slice } = await renderDemo(
                Demo,
                {
                    container,
                }
            );

            slice.expand('1');

            await waitForIdle();

            await callAction('collapseAllItemsAfterBas');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();

            // FIXME: UNSTABLE https://online.sbis.ru/opendoc.html?guid=3d7a6bba-29a4-43d8-8788-98b4891307f7&client=3
            checkChanges({ enabled: false });
        });
    });
});
