/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Selection. Тесты выделения.', () => {
    const { container } = setupTestEnv();

    describe('Поддержка прикладных возможностей', () => {
        it('При SPA переходе сохраняются выделенные элементы', async () => {
            const { waitForIdle, slice } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        listConfigStoreId: 'storeId',
                        multiSelectVisibility: 'visible',
                    },
                },
            });

            slice.select(1);
            await waitForIdle();

            const { getByTestId, checkChanges } = await renderDemo(Demo, {
                container: document.createElement('div'),
                demoProps: {
                    dataFactoryArguments: {
                        listConfigStoreId: 'storeId',
                        multiSelectVisibility: 'visible',
                    },
                },
            });

            await waitForIdle();
            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
