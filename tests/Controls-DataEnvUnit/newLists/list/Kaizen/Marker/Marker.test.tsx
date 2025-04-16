/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import { Memory } from 'Types/source';
import {
    KEY_PROPERTY,
    personsData,
} from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';

describe('Marker. Тесты отметки записей маркером.', () => {
    const { container } = setupTestEnv();

    describe('Установка маркера на запись', () => {
        it('Вызов API.mark() с параметром 0 устанавливает маркер на элемент', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        source: new Memory({
                            keyProperty: KEY_PROPERTY,
                            data: [
                                ...personsData.slice(0, 4),
                                {
                                    [KEY_PROPERTY]: 0,
                                    name: 'Lumi Neva',
                                    country: 'Finland',
                                    region: 'Southern Savonia',
                                    address: 'Myllypuronkatu 7881',
                                    phone: '07-960-114',
                                    email: 'lumi.neva@example.com',
                                },
                            ],
                        }),
                    },
                },
            });

            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            await callAction('markedKey=0');
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            checkChanges();
        });
    });

    describe('Смена состояния markerVisibility', () => {
        it('При выключении видимости, маркер сбрасывается в null', async () => {
            const { getByTestId, waitForIdle, callAction, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        markerVisibility: 'visible',
                        markedKey: 2,
                    },
                },
            });

            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            await callAction('markerVisibility=hidden');
            await waitForIdle();
            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            await callAction('markerVisibility=visible');
            await waitForIdle();
            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            checkChanges();
        });
    });

    it('Маркер сохраняется при SPA переходе', async () => {
        const { waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    listConfigStoreId: 'storeId',
                },
            },
        });

        slice.mark(1);
        await waitForIdle();

        const { getByTestId } = await renderDemo(Demo, {
            container: document.createElement('div'),
            demoProps: {
                dataFactoryArguments: {
                    listConfigStoreId: 'storeId',
                },
            },
        });

        await waitForIdle();
        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });
});
