/**
 * @jest-environment jsdom
 */
import Demo, { LIST_QA } from '../../Demo/ListOld_ManualSource';
import { renderDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/renderDemo';
import { waitFor } from '@testing-library/react';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Source. Тесты загрузки данных.', () => {
    const { container } = setupTestEnv();

    it('Отмена загрузки данных без последующего обновления слайса сбрасывает индикатор загрузки', async () => {
        const { getByTestId, waitForIdle, slice, callAction, checkChanges } = await renderDemo(
            Demo,
            {
                container,
            }
        );

        await callAction('source setManual true');
        await callAction('setFilter country=Norway');
        await waitFor(() => expect(slice.state.loading).toBeTruthy());

        await callAction('rejectSliceUpdate');
        await callAction('source resolveQuery');
        await waitForIdle(5000);
        expect(getByTestId(LIST_QA)).toMatchSnapshot();
        checkChanges();
    });
});
