/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';
import { getRowPropsWithBackgroundEvenItems } from 'Controls-ListsUnit/Lists/Helpers';
import { TGetRowPropsCallback } from 'Controls/gridReact';

import Demo from 'Controls-demo/gridReact/Footer';

describe('Controls-ListsUnit/Lists/Footer/Base', () => {
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

    it('should render footer', () => {
        const { getFooter } = renderGrid(<Demo />, { container });

        const footer = getFooter();
        expect(footer).toBeTruthy();
    });

    it('should rerender footer if change it and configured colspan', async () => {
        const { getFooter } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Footer with colspan'));

        await waitFor(() => {
            const footer = getFooter();
            const cells = getCells(footer);
            expect(cells.length).toBe(1);
            expect(footer.textContent).toBe('Ячейка подвала на всю строку');
        });
    });

    it('should render grid after change columns', async () => {
        // Checked that columns changing don't affect on footer
        const { getFooter, getList, getItems } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Regenerate columns'));

        await waitFor(() => {
            expect(getList()).toBeTruthy();
            expect(getFooter()).toBeTruthy();
            expect(getItems().length).toBeTruthy();
        });
    });

    it('should render footer if getRowProps is defined', async () => {
        // Checked that footer is not passed into getRowProps callback
        const getRowProps: TGetRowPropsCallback = getRowPropsWithBackgroundEvenItems();
        const { getFooter } = renderGrid(<Demo getRowProps={getRowProps} />, { container });

        await waitFor(() => {
            expect(getFooter()).toBeTruthy();
        });
    });
});
