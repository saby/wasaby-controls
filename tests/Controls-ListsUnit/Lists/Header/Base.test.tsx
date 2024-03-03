/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';
import { TGetRowPropsCallback } from 'Controls/gridReact';
import { getRowPropsWithBackgroundEvenItems } from 'Controls-ListsUnit/Lists/Helpers';

import Demo from 'Controls-demo/gridReact/Header';

describe('Controls-ListsUnit/Lists/Header/Base', () => {
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

    it('should render header', () => {
        const { getHeader } = renderGrid(<Demo />, { container });

        const header = getHeader();
        expect(header).toBeTruthy();
    });

    it('should render header if getRowProps is defined', async () => {
        // Checked that header is not passed into getRowProps callback
        const getRowProps: TGetRowPropsCallback = getRowPropsWithBackgroundEvenItems();
        const { getHeader } = renderGrid(<Demo getRowProps={getRowProps} />, { container });

        await waitFor(() => {
            const header = getHeader();
            expect(header).toBeTruthy();
        });
    });

    it('should render grid after change columns', async () => {
        // Checked that columns changing don't affect on header
        const { getHeader, getList, getItems } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByText('Regenerate columns'));

        await waitFor(() => {
            expect(getList()).toBeTruthy();
            expect(getHeader()).toBeTruthy();
            expect(getItems().length).toBeTruthy();
        });
    });
});
