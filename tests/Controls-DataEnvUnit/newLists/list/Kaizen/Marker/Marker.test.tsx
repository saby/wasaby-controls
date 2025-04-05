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
                            data: personsData.slice(personsData.length - 5),
                        }),
                    },
                },
            });

            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            await callAction('markedKey=0');
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();

            // FIXME: UNSTABLE https://online.sbis.ru/opendoc.html?guid=3d7a6bba-29a4-43d8-8788-98b4891307f7&client=3
            checkChanges({ enabled: false });
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

            // FIXME: UNSTABLE https://online.sbis.ru/opendoc.html?guid=3d7a6bba-29a4-43d8-8788-98b4891307f7&client=3
            checkChanges({ enabled: false });
        });
    });
});
