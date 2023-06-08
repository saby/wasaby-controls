/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import EditingDemo from 'Controls-demo/gridReact/Editing/EditByCells';
import { clickCell } from '../GridHelpers';

describe('Controls-ListsUnit/Lists/Editing/EditingMode', () => {
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

    it('by default should edit whole row', async () => {
        const { getFirstItem } = renderGrid(<EditingDemo />, { container });

        const item = getFirstItem();
        await clickCell(item, 1);

        await waitFor(() => {
            // Проверяем что редактируется всего одна строка и редактируются все ячейки
            const editingCells = screen.getAllByTestId(
                'editing_component-editor_render'
            );
            expect(editingCells.length).toBe(3);
        });
    });

    it('should edit whole row if mode="row"', async () => {
        const { getFirstItem } = renderGrid(
            <EditingDemo editingMode={'row'} />,
            { container }
        );

        const item = getFirstItem();
        await clickCell(item, 1);

        await waitFor(() => {
            // Проверяем что редактируется всего одна строка и редактируются все ячейки
            const editingCells = screen.getAllByTestId(
                'editing_component-editor_render'
            );
            expect(editingCells.length).toBe(3);
        });
    });

    it('should edit one cell if mode="cell"', async () => {
        const { getFirstItem } = renderGrid(
            <EditingDemo editingMode={'cell'} />,
            { container }
        );

        const item = getFirstItem();
        await clickCell(item, 1);

        await waitFor(() => {
            const editingCells = screen.getAllByTestId(
                'editing_component-editor_render'
            );
            expect(editingCells.length).toBe(1);
        });
    });

    it('should rerender if change editing mode', async () => {
        const { getFirstItem } = renderGrid(
            <EditingDemo editingMode={'cell'} />,
            { container }
        );

        await userEvent.selectOptions(
            screen.getByTestId('mode-selector'),
            'row'
        );
        await waitFor(async () => {
            const item = getFirstItem();
            await clickCell(item, 1);
        });

        await waitFor(() => {
            const editingCells = screen.getAllByTestId(
                'editing_component-editor_render'
            );
            expect(editingCells.length).toBe(3);
        });
    });
});
