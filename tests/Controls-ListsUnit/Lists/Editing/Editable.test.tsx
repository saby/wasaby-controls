/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import EditingDemo from 'Controls-demo/gridReact/Editing/EditByCells';

describe('Controls-ListsUnit/Lists/Editing/Editable', () => {
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

    it('by default all cells are editable', () => {
        const { getFirstItem } = renderGrid(<EditingDemo />, { container });

        const item = getFirstItem();
        const editableCells = item.querySelectorAll(
            '.js-controls-ListView__editingTarget'
        );
        expect(editableCells.length).toBe(3);
    });

    it('should use EditingComponent if pass editorRender', () => {
        renderGrid(<EditingDemo />, { container });

        const editingCells = screen.getAllByTestId(
            'editing_component-view_render'
        );
        expect(editingCells.length).toBe(7);
    });
});
