/**
 * @jest-environment jsdom
 */
import { default as ListOld_ManualSourceDemo, LIST_QA } from '../../Demo/ListOld_ManualSource';
import { default as ListOldDemo, LIST_QA as LIST_OLD_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { waitFor } from '@testing-library/react';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import {
    KEY_PROPERTY,
    personsData,
} from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';
import { Memory } from 'Types/source';

describe('Source. Тесты загрузки данных.', () => {
    const { container } = setupTestEnv();

    describe('Загрузка данных', () => {
        it('Повторный вызов метода reload должен отменить предыдущую загрузку, если она выполняется', async () => {
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                ListOld_ManualSourceDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            manualSource: true,
                        },
                    },
                }
            );

            const promise = slice.reload();
            await waitFor(() => expect(slice.state.loading).toBeTruthy());

            slice.reload();
            await waitFor(() => expect(slice.state.loading).not.toBeFalsy());
            promise.catch((error) => {
                expect(error.isCanceled).toBeTruthy();
            });

            await callAction('source resolveQuery');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Во время загрузки данных (API.load) пользователь может менять состояние списка, не влияющее на загрузку', async () => {
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                ListOld_ManualSourceDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            manualSource: true,
                        },
                    },
                }
            );
            await callAction('load with filter');

            slice.mark(1);

            await callAction('source resolveQuery');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('Можно сохранить текущую навигацию', async () => {
            const { getByTestId, waitForIdle, callAction, slice } = await renderDemo(ListOldDemo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        source: new Memory({
                            keyProperty: KEY_PROPERTY,
                            data: personsData.slice(0, 50),
                        }),
                        navigation: {
                            source: 'page',
                            view: 'infinity',
                            sourceConfig: {
                                pageSize: 10,
                                page: 0,
                                hasMore: false,
                            },
                            viewConfig: {
                                pagingMode: 'basic',
                            },
                        },
                    },
                },
            });

            slice.load('down');
            await waitForIdle(5000);

            await callAction('change RecordSet');
            await waitForIdle();

            await callAction('reload keepNavigation');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
        });
        it('Данные в списке обновляются', async () => {
            const { getByTestId, waitForIdle, callAction } = await renderDemo(ListOldDemo, {
                container,
            });

            await callAction('change RecordSet');
            await waitForIdle();

            await callAction('reload');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
        });
        it('API.load() без аргументов не меняет фильтр', async () => {
            const { getByTestId, waitForIdle, callAction } = await renderDemo(ListOldDemo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        filter: {
                            country: 'Norway',
                        },
                    },
                },
            });

            await callAction('load');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
        });
        it('Можно перезагрузить конкретную запись', async () => {
            const { getByTestId, waitForIdle, callAction } = await renderDemo(ListOldDemo, {
                container,
            });

            await callAction('change RecordSet');
            await waitForIdle();

            await callAction('reloadItem 1');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
        });
    });
    describe('Индикатор загрузки', () => {
        it('Отмена загрузки данных без последующего обновления слайса сбрасывает индикатор загрузки', async () => {
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                ListOld_ManualSourceDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            manualSource: true,
                        },
                    },
                }
            );
            await callAction('setFilter country=Norway');
            await waitFor(() => expect(slice.state.loading).toBeTruthy());

            await callAction('rejectSliceUpdate');
            await callAction('source resolveQuery');
            await waitForIdle(5000);
            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('При многократном вызове перезагрузки списка не сбрасывается индикатор загрузки', async () => {
            const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
                ListOld_ManualSourceDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            manualSource: true,
                        },
                    },
                }
            );

            slice.reload();
            await waitFor(() => expect(slice.state.loading).toBeTruthy());

            await callAction('setFilter country=Norway');
            await waitFor(() => expect(slice.state.loading).not.toBeFalsy());

            await callAction('source resolveQuery');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
    describe('Поддержка прикладных возможностей', () => {
        describe('_dataLoaded', () => {
            it('_dataLoaded вызывается после загрузки данных и в нем можно менять состояние', async () => {
                const { getByTestId, waitForIdle, slice } = await renderDemo(
                    ListOld_ManualSourceDemo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                changeAllItemsInDataLoaded: true,
                            },
                        },
                    }
                );

                slice.reload();
                await waitForIdle(5000);

                expect(getByTestId(LIST_OLD_QA)).toMatchSnapshot();
            });
            it('_dataLoaded вызывается после вызова API.load', async () => {
                const { getByTestId, waitForIdle, callAction } = await renderDemo(
                    ListOld_ManualSourceDemo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                changeAllItemsInDataLoaded: true,
                            },
                        },
                    }
                );

                // dataLoaded вызывается, но изменения items внутри метода прикладника не попадают на слайс
                // поправить по ошибке:
                // https://online.sbis.ru/opendoc.html?guid=8d81d103-1140-47a9-be22-81850a7fc291&client=3
                await callAction('load with filter');
                await waitForIdle(5000);

                expect(getByTestId(LIST_OLD_QA)).toMatchSnapshot();
            });
            it('_dataLoaded вернул Promise', async () => {
                const { getByTestId, waitForIdle, slice } = await renderDemo(
                    ListOld_ManualSourceDemo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                changeAllItemsInDataLoaded: true,
                                dataLoadedReturnPromise: true,
                            },
                        },
                    }
                );

                slice.reload();
                await waitForIdle(5000);

                expect(getByTestId(LIST_OLD_QA)).toMatchSnapshot();
            });
        });
        describe('Ошибка при загрузке данных', () => {
            it('Ошибка об отмене reload не проставляется в слайс', async () => {
                const { getByTestId, waitForIdle, slice, callAction, checkChanges } =
                    await renderDemo(ListOld_ManualSourceDemo, {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                manualSource: true,
                            },
                        },
                    });

                const promise = slice.reload();
                await waitFor(() => expect(slice.state.loading).toBeTruthy());

                slice.reload();
                await waitFor(() => expect(slice.state.loading).not.toBeFalsy());
                promise.catch((error) => {
                    expect(error.isCanceled).toBeTruthy();
                });

                await callAction('source resolveQuery');
                await waitForIdle(5000);

                expect(slice.state.error).toBeUndefined();

                expect(getByTestId(LIST_QA)).toMatchSnapshot();
                checkChanges();
            });
        });
        describe('Загрузка данных', () => {
            it('Если в прикладном bas были изменения, требующие загрузку, она должна выполниться', async () => {
                const { getByTestId, waitForIdle, slice, checkChanges } = await renderDemo(
                    ListOldDemo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                setFilterByMarkedKey: true,
                            },
                        },
                    }
                );

                slice.mark(1);

                await waitForIdle(5000);

                expect(getByTestId(LIST_OLD_QA)).toMatchSnapshot();
                checkChanges();
            });
        });
    });
});
