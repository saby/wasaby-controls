/**
 * @jest-environment jsdom
 */
import Demo, { GRID_QA } from '../../Demo/Grid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Actions. Тесты действий над записями.', () => {
    const { container } = setupTestEnv();

    describe('Состояние контекстных операций (itemActions)', () => {
        it('Если в setState были заданы новые действия, происходит обновление модели', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        markerVisibility: 'visible',
                        markedKey: 2,
                        searchParam: 'name',
                    },
                },
            });

            await callAction('itemActions=Controls/actions:Remove');

            await waitForIdle();

            expect(getByTestId(GRID_QA)).toMatchSnapshot();

            checkChanges({ enabled: false });
        });
    });
});
