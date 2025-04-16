/**
 * @jest-environment jsdom
 */
import Demo, { FILTER_QA } from '../../Demo/Grid';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

import { Memory } from 'Types/source';
import { personsData } from 'Controls-DataEnvUnit/newLists/list/Demo/Data/personsData';
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

describe('Filter. Тесты фильтрации', () => {
    const { container } = setupTestEnv();

    it('Открытие и закрытие панели фильтров', async () => {
        const { getByTestId, waitForIdle, checkChanges, slice } = await renderDemo(Demo, {
            container,
            demoProps: {
                dataFactoryArguments: {
                    filterDescription: [countryFilter],
                    searchParam: 'name',
                },
            },
        });

        slice.openFilterDetailPanel();
        await waitForIdle();

        expect(getByTestId(FILTER_QA)).toMatchSnapshot();

        slice.closeFilterDetailPanel();
        await waitForIdle();

        expect(getByTestId(FILTER_QA)).toMatchSnapshot();
        checkChanges();
    });
});
