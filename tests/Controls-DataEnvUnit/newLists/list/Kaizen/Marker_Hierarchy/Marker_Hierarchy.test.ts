/**
 * @jest-environment jsdom
 */
import Demo, { TREE_GRID_QA } from '../../Demo/TreeGrid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Marker_Hierarchy. Тесты взаимодействия выделения с иерархией.', () => {
    const { container } = setupTestEnv();

    it('Установка маркера на вложенном элементе приводит к раскрытию родителя', async () => {
        const { getByTestId, slice, waitForIdle, callAction, checkChanges } = await renderDemo(
            Demo,
            {
                container,
            }
        );

        slice.expand('1');

        await waitForIdle();

        slice.collapse('1');

        await waitForIdle();

        await callAction('Отметить Москва');

        await waitForIdle();

        expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
        checkChanges();
    });
    it('При проваливании в папку маркер сбрасывается', async () => {
        const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
            container,
        });

        slice.mark('1');

        await waitForIdle();

        slice.changeRoot('1');

        await waitForIdle();

        expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
        checkChanges();
    });

    describe('Выход из папки', () => {
        it('Маркер устанавливается на папку из которой вышли', async () => {
            const { getByTestId, slice, waitForIdle, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        root: '1',
                    },
                },
            });

            slice.changeRoot(null);

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Одновременный выход из папки и смена маркера устанавливает переданный маркер', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        root: '1',
                    },
                },
            });

            await callAction('setState: root null, markedKey 2');

            await waitForIdle();

            expect(getByTestId(TREE_GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
