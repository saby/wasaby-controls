/**
 * @jest-environment jsdom
 */
import Demo, { FILTER_QA, GRID_QA } from '../../Demo/Grid';
import { default as ListDemo, LIST_QA } from '../../Demo/ListOld';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';
import { Memory } from 'Types/source';
import { personsData } from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';
import { FilterHistory } from 'Controls/filter';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';

const countryFilter: IFilterDescriptionItem = {
    name: 'country',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    value: null,
    resetValue: null,
    viewMode: 'basic',
    textValue: '',
    editorOptions: {
        source: new Memory({
            data: personsData.slice(0, 5).map((item) => ({
                id: item.country,
                title: item.country,
            })),
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Страна',
    },
};
describe('Source_Filter. Тесты взаимодействия фильтра с сурсом', () => {
    const { container } = setupTestEnv();

    it('Применение структуры фильтров. Фильтр сохраняется в историю', async () => {
        jest.spyOn(FilterHistory, 'update').mockImplementation();
        const { getByTestId, waitForIdle, checkChanges, slice } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    filterDescription: [countryFilter],
                    historyId: 'demo',
                    searchParam: 'name',
                },
            },
        });

        slice.applyFilterDescription([
            {
                ...countryFilter,
                value: 'Norway',
            },
        ]);
        await waitForIdle(5000);

        expect(getByTestId(GRID_QA)).toMatchSnapshot();

        slice.openFilterDetailPanel();
        await waitForIdle();
        expect(getByTestId(FILTER_QA)).toMatchSnapshot();

        expect(FilterHistory.update).toHaveBeenCalled();
        checkChanges();
    });
    it('Сброс структуры фильтров с историей', async () => {
        jest.spyOn(FilterHistory, 'update').mockImplementation();
        const { getByTestId, waitForIdle, checkChanges, callAction } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            ...countryFilter,
                            value: 'Norway',
                        },
                    ],
                    historyId: 'demo',
                    searchParam: 'name',
                },
            },
        });

        await callAction('resetFilterDescription');
        await waitForIdle(5000);

        expect(getByTestId(GRID_QA)).toMatchSnapshot();
        checkChanges();

        expect(FilterHistory.update).toHaveBeenCalled();
    });
    describe('Поддержка прикладных возможностей', () => {
        it('API.setFilter() загружает новые данные с учетом переданного фильтра', async () => {
            const { getByTestId, waitForIdle, checkChanges, callAction } = await renderDemo(Demo, {
                container,
                demoProps: {
                    dataFactoryArguments: {
                        searchParam: 'name',
                    },
                },
            });

            await callAction('setFilter Norway');
            await waitForIdle(5000);

            expect(getByTestId(GRID_QA)).toMatchSnapshot();
            checkChanges();
        });
        it('API.load(filter) загружает данные с учетом переданного фильтра', async () => {
            const { getByTestId, waitForIdle, checkChanges, callAction } = await renderDemo(
                ListDemo,
                {
                    container,
                    demoProps: {
                        dataFactoryArguments: {
                            searchParam: 'name',
                        },
                    },
                }
            );

            await callAction('load filter');
            await waitForIdle(5000);

            expect(getByTestId(LIST_QA)).toMatchSnapshot();
            checkChanges();
        });
    });
});
