/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import EditingDemo from 'Controls-demo/gridReact/Editing/EditWholeRow';
import { clickCell, getCells } from '../GridHelpers';

describe('Controls-ListsUnit/Lists/Editing/EditWholeRow', () => {
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

    it('should edit first cell on whole row', async () => {
        const { getFirstItem } = renderGrid(<EditingDemo />, { container });

        await clickCell(getFirstItem(), 0);

        await waitFor(() => {
            const editingCells = getCells(getFirstItem());
            expect(editingCells.length).toBe(1);

            const customEditors = screen.getAllByTestId('custom-row-editor');
            expect(customEditors.length).toBe(1);
        });
    });
});
