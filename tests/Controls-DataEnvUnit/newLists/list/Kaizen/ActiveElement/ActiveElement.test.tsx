/**
 * @jest-environment jsdom
 */
import Demo from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import { RecordSet } from 'Types/collection';
import {
    KEY_PROPERTY,
    personsData,
} from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';

describe('ActiveElement. Тесты установки активного элемента.', () => {
    const { container } = setupTestEnv();

    describe('Инициализация', () => {
        it('Если в конфигурации задан activeElement, он устанавливается в слайс', async () => {
            const { waitForIdle, slice } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        activeElement: 1,
                    },
                },
            });

            await waitForIdle();

            expect(slice.state.activeElement).toEqual(1);
        });

        it('Если в конфигурации не задан activeElement activeElement но он есть в метаданных, он устанавливается в слайс', async () => {
            const items = new RecordSet({
                rawData: personsData.slice(0, 5),
                keyProperty: KEY_PROPERTY,
            });

            items.setMetaData({
                navigation: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        {
                            key: 3,
                        },
                    ],
                }),
            });

            const { waitForIdle, slice } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        items,
                    },
                },
            });

            await waitForIdle();

            expect(slice.state.activeElement).toEqual(3);
        });

        it('Если в конфигурации не задан activeElement и его нет в мета-данных, в activeElement устанавливается первый элемент', async () => {
            const { waitForIdle, slice } = await renderDemo(Demo, {
                container,
            });

            await waitForIdle();

            expect(slice.state.activeElement).toEqual(1);
        });
    });
});
