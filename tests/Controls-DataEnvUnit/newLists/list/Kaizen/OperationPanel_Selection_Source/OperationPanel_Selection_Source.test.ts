/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('OperationPanel_Selection_Source. Тесты взаимодействия ПМО со множественным выделением и загрузкой данных.', () => {
    const { container } = setupTestEnv();

    it('Перезагрузка списка в режиме отображения отобранных элементов возвращает список к отображению всех элементов', async () => {
        // selectionViewMode не сбрасывается в ПМО
        // поправить по ошибке: https://online.sbis.ru/opendoc.html?guid=1ff2f4bb-fc15-4c83-b401-9ee76b4e72f5&client=3
        const { getByTestId, checkChanges, waitForIdle, slice, callAction } = await renderDemo(
            Demo,
            {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        operationsPanelVisible: true,
                    },
                },
            }
        );

        slice.select(1);
        await waitForIdle();

        // меняет состояние selectionViewMode на слайсе
        slice.setSelectionViewMode('selected');
        await waitForIdle();

        // устанавливает новые данные
        slice.executeCommand('selected');
        await waitForIdle();

        await callAction('reload');
        await waitForIdle();

        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });
});
