/**
 * @jest-environment jsdom
 */
import ListDemo, { SEARCH_QA as LIST_SEARCH_QA } from '../../Demo/ListOld';
import ListManualSourceDemo, {
    SEARCH_QA as LIST_MANUAL_SOURCE_SEARCH_QA,
} from '../../Demo/ListOld_ManualSource';
import DynamicViewDemo, {
    SEARCH_QA as DYNAMIC_VIEW_SEARCH_QA,
    LIST_QA as DYNAMIC_VIEW_LIST_QA,
} from '../../Demo/DynamicView';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import { waitFor } from '@testing-library/react';
import { Interactor } from 'Controls-DataEnv/errorDescriptors';

describe('Поиск. Core.', () => {
    const { container, mockConsole } = setupTestEnv();

    it('Многократный вызов поиска с одинаковым значением во время загрузки данных приводит к новой загрузке данных без сброса индикатора загрузки.', async () => {
        const { getByTestId, checkChanges, slice, waitForIdle } = await renderDemo(ListDemo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    searchValue: 'test',
                },
            },
        });

        slice.search('test');
        slice.search('test');

        await waitForIdle();

        expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

        checkChanges();
    });

    it('Состояние загрузки не должно влиять на значение для строки поиска.', async () => {
        const { getByTestId, checkChanges, callAction, waitForIdle, slice } = await renderDemo(
            ListManualSourceDemo,
            {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchInputValue: '',
                        searchValue: '',
                        searchParam: 'country',
                        manualSource: true,
                    },
                },
            }
        );

        await callAction('setFilter country=Norway');
        await waitFor(() => expect(slice.state.loading).toBeTruthy());

        slice.search('Philippines');

        await callAction('source resolveQuery');

        await waitForIdle();

        expect(getByTestId(LIST_MANUAL_SOURCE_SEARCH_QA)).toMatchSnapshot();

        checkChanges();
    });

    describe('Поддержка прикладных возможностей.', () => {
        it('Возможность изменить значение в строке поиска через setState.', async () => {
            const { getByTestId, checkChanges, callAction, waitForIdle } = await renderDemo(
                ListDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            searchValue: '',
                            searchInputValue: '',
                        },
                    },
                }
            );

            await callAction('searchInputValue=value');

            await waitForIdle();

            expect(getByTestId(LIST_SEARCH_QA)).toMatchSnapshot();

            checkChanges();
        });
    });

    describe('Смена режима отображения при поиске', () => {
        it('Можно изменить режим отображения поиска, если не задан searchParam.', async () => {
            const missingParamMock = jest
                .spyOn(Interactor, 'MISSING_SEARCH_PARAM')
                .mockImplementation();

            const { getByTestId, checkChanges, callAction, waitForIdle, slice } = await renderDemo(
                DynamicViewDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            searchValue: '',
                            searchParam: '',
                        },
                    },
                }
            );

            slice.search('Jorden Pate');

            await waitForIdle();

            await callAction('viewMode=search');

            await waitForIdle();

            expect(getByTestId(DYNAMIC_VIEW_SEARCH_QA)).toMatchSnapshot();

            checkChanges();

            mockConsole.clearHistory('error');

            missingParamMock.mockRestore();
        });

        describe('Изменение режима отображения при наличии опции adaptiveSearchMode.', () => {
            it('Если за время поиска поменяли режим отображения, то после сброса мы должны откатиться на измененный.', async () => {
                const { getByTestId, checkChanges, callAction, waitForIdle, slice } =
                    await renderDemo(DynamicViewDemo, {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                searchValue: '',
                                adaptiveSearchMode: true,
                            },
                        },
                    });

                slice.search('Jorden Pate');
                await waitForIdle(5000);

                await callAction('viewMode=tile');
                await waitForIdle();

                slice.resetSearch();
                await waitForIdle(5000);

                expect(getByTestId(DYNAMIC_VIEW_LIST_QA)).toMatchSnapshot();

                checkChanges();
            });

            it('В результате поиска отображение плитки меняется на searchTile.', async () => {
                const { getByTestId, checkChanges, waitForIdle, slice } = await renderDemo(
                    DynamicViewDemo,
                    {
                        container,
                        demoProps: {
                            dataFactoryArguments: {
                                searchValue: '',
                                viewMode: 'tile',
                                adaptiveSearchMode: true,
                            },
                        },
                    }
                );

                slice.search('Jorden Pate');

                await waitForIdle();

                expect(getByTestId(DYNAMIC_VIEW_LIST_QA)).toMatchSnapshot();

                checkChanges();
            });
        });
    });
});
