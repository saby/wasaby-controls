/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';
import { TGetRowPropsCallback } from 'Controls/gridReact';
import { getRowPropsWithBackgroundEvenItems } from 'Controls-ListsUnit/Lists/Helpers';

import Demo from 'Controls-demo/gridReact/Results';

describe('Controls-ListsUnit/Lists/Results/Base', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('should render results', () => {
        const { getResults } = renderGrid(<Demo />, { container });

        const results = getResults();
        expect(results).toBeTruthy();
    });

    it('should rerender results if change field in metaData', async () => {
        const { getResults } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Change results field'));

        await waitFor(() => {
            const results = getResults();
            const firstCell = getCell(results, 0);
            expect(firstCell.textContent).toBe('201');
        });
    });

    it('should rerender results if change metaData', async () => {
        const { getResults } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Change full metadata'));

        await waitFor(() => {
            const results = getResults();
            const firstCell = getCell(results, 0);
            expect(firstCell.textContent).toBe('201');
        });
    });

    it('should rerender results if new items is generated with new metaData', async () => {
        const { getResults } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Regenerate items with new meta data'));

        await waitFor(() => {
            const results = getResults();
            const firstCell = getCell(results, 0);
            expect(firstCell.textContent).toBe('201');
        });
    });

    it('should rerender results if change results and configured colspan', async () => {
        const { getResults } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Results with colspan'));

        await waitFor(() => {
            const results = getResults();
            const cells = getCells(results);
            expect(cells.length).toBe(1);
            expect(results.textContent).toBe('Общее кол-во записей:200');
        });
    });

    it('should render grid after change results', async () => {
        // Checked that results changing don't affect on columns
        const { getResults, getList, getItems } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Regenerate results'));

        await waitFor(() => {
            expect(getList()).toBeTruthy();
            expect(getResults()).toBeTruthy();
            expect(getItems().length).toBeTruthy();
        });
    });

    it('should render grid after change columns', async () => {
        // Checked that columns changing don't affect on results
        const { getResults, getList, getItems } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Regenerate columns'));

        await waitFor(() => {
            expect(getList()).toBeTruthy();
            expect(getResults()).toBeTruthy();
            expect(getItems().length).toBeTruthy();
        });
    });

    it('should render results if getRowProps is defined', async () => {
        // Checked that results is not passed into getRowProps callback
        const getRowProps: TGetRowPropsCallback = getRowPropsWithBackgroundEvenItems();
        const { getResults } = renderGrid(<Demo getRowProps={getRowProps}/>, { container });

        await waitFor(() => {
            expect(getResults()).toBeTruthy();
        });
    });
});
