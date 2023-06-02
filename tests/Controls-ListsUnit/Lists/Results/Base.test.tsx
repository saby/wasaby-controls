/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';

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
        expect(results).toBeDefined();
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
});
