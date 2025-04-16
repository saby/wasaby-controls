/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld';
import { default as DemoWithWrongSlice } from '../../Demo/ListOld_WrongSlice';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Core. Тесты базовых возможностей слайса.', () => {
    const { container, mockConsole } = setupTestEnv();

    it('При использовании устаревшего метода будет выведена ошибка с информацией о слайсе', async () => {
        const { waitForIdle, callAction } = await renderDemo(Demo, {
            container,
        });

        await callAction('deprecatedMethod');
        await waitForIdle();

        expect(mockConsole.errors[0]).toBe(
            'Списочный слайс с идентификатором uniqueId0: \n' +
                'Свойство/метод/опция deprecatedMethod устарело и будет удалено в версию XX.XXXX.\n'
        );
        mockConsole.clearHistory();
    });
    describe('setState', () => {
        it('Объектный setState не начнет обновление, если состояние уже установлено', async () => {
            const { waitForIdle, checkChanges, slice, getByTestId } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        markedKey: 2,
                    },
                },
            });
            slice.setState({
                markedKey: 2,
            });
            await waitForIdle();
            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Объектный setState с установленным состоянием не отсеивается, если перед ним в очереди есть другие изменения', async () => {
            const { waitForIdle, checkChanges, slice, getByTestId } = await renderDemo(Demo, {
                container,
            });
            slice.setState({
                markedKey: 1,
            });
            slice.setState({
                markedKey: 2,
            });
            slice.setState({
                markedKey: 1,
            });
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
    describe('Поддержка прикладных возможностей', () => {
        it('Если прикладник передал в список неподходящий слайс, в консоль будет выведена ошибка', async () => {
            const { waitForIdle } = await renderDemo(DemoWithWrongSlice, {
                container,
            });

            await waitForIdle();

            expect(
                mockConsole.errors.indexOf(
                    'ПРИКЛАДНАЯ ОШИБКА использования списка.\n' +
                        'Использован слайс, неподходящий для данного списка.\n' +
                        'Необходимо убедиться, что прикладной слайс является наследником списочного из модуля Controls-DataEnv/currentList'
                ) !== -1
            ).toBeTruthy();

            mockConsole.clearHistory();
        });
        it('Прикладник может отменить изменения платформенной логики', async () => {
            const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        rejectPlatformChanges: true,
                    },
                },
            });

            slice.mark(1);
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Прикладник может отменить обновление слайса, вернув из beforeApplyState отменный промис', async () => {
            const { waitForIdle, checkChanges, slice, getByTestId } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        rejectByCanceledPromise: true,
                    },
                },
            });
            slice.mark(1);
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();

            expect(!!mockConsole.errors.length).toBeTruthy();
            mockConsole.clearHistory();
        });
        it('Прикладник получает рассчитанное по экшенам состояние', async () => {
            const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        changeItemOnMark: true,
                    },
                },
            });

            slice.mark(1);
            await waitForIdle();

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
